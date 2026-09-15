import sslcz from "../config/sslcommerz.js";
import env from "../config/env.js";
import { bookingCollection, ObjectId, isValidObjectId } from "../config/db.js";
import {
  createPaymentTransaction,
  findPaymentTransactionById,
  findPaymentTransactionsByBookingId,
  updatePaymentTransaction,
} from "../models/paymentTransaction.model.js";

/**
 * Initialize SSLCommerz Payment session (User)
 */
export const initPayment = async (req, res) => {
  try {
    const { amount, customerName, customerEmail, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).send({
        success: false,
        message: "Amount and booking ID are required.",
      });
    }

    if (
      !env.SSLCOMMERZ_STORE_ID ||
      !env.SSLCOMMERZ_STORE_PASSWORD ||
      !env.CLIENT_URL ||
      !env.SERVER_URL
    ) {
      return res.status(503).send({
        success: false,
        message: "Payment gateway is not configured.",
      });
    }

    if (
      env.SSLCOMMERZ_IS_LIVE &&
      (!env.CLIENT_URL.startsWith("https://") ||
        !env.SERVER_URL.startsWith("https://"))
    ) {
      return res.status(503).send({
        success: false,
        message: "Live payments require HTTPS client and server URLs.",
      });
    }

    if (!isValidObjectId(bookingId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found.",
      });
    }

    // Verify ownership
    if (booking.userId !== req.user.userId) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to pay for this booking.",
      });
    }

    const packageAmount = Number(booking.packagePrice);
    if (!Number.isFinite(packageAmount) || packageAmount <= 0) {
      return res.status(400).send({
        success: false,
        message: "This booking has an invalid package amount.",
      });
    }
    const paymentTransactions =
      await findPaymentTransactionsByBookingId(bookingId);
    const paidAmount = paymentTransactions
      .filter((transaction) => transaction.status === "paid")
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );
    const remainingAmount = Math.max(packageAmount - paidAmount, 0);
    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount < 1) {
      return res.status(400).send({
        success: false,
        message: "Payment amount must be at least 1 BDT.",
      });
    }

    if (remainingAmount <= 0) {
      return res.status(400).send({
        success: false,
        message: "This booking has already been paid.",
      });
    }

    if (paymentAmount > remainingAmount) {
      return res.status(400).send({
        success: false,
        message: `Payment cannot exceed the remaining amount of ${remainingAmount} BDT.`,
      });
    }

    const transactionId = `RUP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    const data = {
      total_amount: paymentAmount,
      currency: "BDT",
      tran_id: transactionId,

      success_url: `${env.SERVER_URL}/payment/success`,
      fail_url: `${env.SERVER_URL}/payment/fail`,
      cancel_url: `${env.SERVER_URL}/payment/cancel`,
      ipn_url: `${env.SERVER_URL}/payment/ipn`,

      shipping_method: "NO",

      product_name: booking.packageName || "Photography Booking",
      product_category: "Photography",
      product_profile: "general",

      cus_name: booking.userName || customerName || "Customer",
      cus_email: booking.userEmail || customerEmail,
      cus_add1: booking.eventLocation || "Bangladesh",
      cus_city: "Dinajpur",
      cus_state: "Dinajpur",
      cus_postcode: "5200",
      cus_country: "Bangladesh",
      cus_phone: booking.phone || "01700000000",

      ship_name: customerName,
      ship_add1: booking.eventLocation || "Bangladesh",
      ship_city: "Dinajpur",
      ship_state: "Dinajpur",
      ship_postcode: "5200",
      ship_country: "Bangladesh",

      // Custom metadata
      value_a: bookingId,
      value_b: req.user.userId,
    };

    console.log(
      "💳 Initializing SSLCommerz Payment for tran_id:",
      transactionId,
    );

    const transaction = await createPaymentTransaction({
      bookingId: new ObjectId(bookingId),
      userId: req.user.userId,
      transactionId,
      amount: paymentAmount,
      currency: "BDT",
      paymentMethod: "sslcommerz",
      gateway: "sslcommerz",
      status: "initiated",
    });

    let apiResponse;
    try {
      apiResponse = await sslcz.init(data);
    } catch (gatewayError) {
      await updatePaymentTransaction(transactionId, "failed", {
        failureReason: "Gateway initialization failed",
      });
      throw gatewayError;
    }

    if (!apiResponse?.GatewayPageURL) {
      await updatePaymentTransaction(transactionId, "failed", {
        failureReason: "Gateway did not return a payment URL",
      });
      return res.status(500).send({
        success: false,
        message: "Failed to initialize SSLCommerz payment.",
      });
    }

    // Keep only the latest transaction as a booking summary; history lives in its own collection.
    await bookingCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { lastTransactionId: transactionId, updatedAt: new Date() } },
    );

    return res.send({
      success: true,
      paymentUrl: apiResponse.GatewayPageURL,
      transactionId,
    });
  } catch (error) {
    console.error("❌ SSLCommerz payment initialization error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to initialize payment.",
    });
  }
};

/**
 * Handle payment success callback from SSLCommerz (POST redirect)
 */
export const paymentSuccess = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (!tran_id) {
      return res.status(400).send({
        success: false,
        message: "Transaction ID is missing.",
      });
    }

    return res.redirect(
      `${env.CLIENT_URL}/payment/success?tran_id=${encodeURIComponent(tran_id)}`,
    );
  } catch (error) {
    console.error("❌ Payment success error:", error);
    return res.redirect(`${env.CLIENT_URL}/payment/fail`);
  }
};

/**
 * Handle payment fail callback from SSLCommerz (POST redirect)
 */
export const paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (tran_id) {
      await updatePaymentTransaction(tran_id, "failed");
    }

    return res.redirect(
      `${env.CLIENT_URL}/payment/fail${tran_id ? `?tran_id=${encodeURIComponent(tran_id)}` : ""}`,
    );
  } catch (error) {
    console.error("❌ Payment fail error:", error);
    return res.redirect(`${env.CLIENT_URL}/payment/fail`);
  }
};

/**
 * Handle payment cancel callback from SSLCommerz (POST redirect)
 */
export const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.body;

    if (tran_id) {
      await updatePaymentTransaction(tran_id, "cancelled");
    }

    return res.redirect(
      `${env.CLIENT_URL}/payment/cancel${tran_id ? `?tran_id=${encodeURIComponent(tran_id)}` : ""}`,
    );
  } catch (error) {
    console.error("❌ Payment cancel error:", error);
    return res.redirect(`${env.CLIENT_URL}/payment/cancel`);
  }
};

/**
 * Handle Instant Payment Notification (IPN) webhook from SSLCommerz
 */
export const paymentIPN = async (req, res) => {
  try {
    const { tran_id, val_id, status } = req.body;

    if (!tran_id || !val_id) {
      return res.status(400).send({
        success: false,
        message: "Transaction information is missing.",
      });
    }

    if (status !== "VALID" && status !== "VALIDATED") {
      console.log("❌ Invalid payment status from SSLCommerz IPN:", status);
      return res.status(400).send({
        success: false,
        message: "Payment is not valid.",
      });
    }

    const validationResponse = await sslcz.validate({ val_id });

    if (!validationResponse || validationResponse.status !== "VALID") {
      return res.status(400).send({
        success: false,
        message: "Payment validation failed.",
      });
    }

    const bookingId = validationResponse.value_a;

    if (!bookingId || !isValidObjectId(bookingId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found.",
      });
    }

    const existingTransaction = await findPaymentTransactionById(tran_id);

    if (existingTransaction?.status === "paid") {
      return res.status(200).send({
        success: true,
        message: "Payment already processed.",
      });
    }

    const paidAmount = Number(validationResponse.amount);
    const bookingAmount = Number(booking.packagePrice);

    if (
      !existingTransaction ||
      paidAmount !== Number(existingTransaction.amount) ||
      paidAmount < 1
    ) {
      return res.status(400).send({
        success: false,
        message: "Payment amount does not match the initialized transaction.",
      });
    }

    if (
      String(existingTransaction.bookingId) !== String(booking._id) ||
      String(existingTransaction.userId) !== String(booking.userId)
    ) {
      return res.status(400).send({
        success: false,
        message: "Transaction ownership could not be verified.",
      });
    }

    const transactionUpdate = await updatePaymentTransaction(tran_id, "paid", {
      amount: paidAmount,
      currency: validationResponse.currency || "BDT",
      validationId: val_id,
      gatewayStatus: validationResponse.status,
      paidAt: new Date(),
    });

    if (transactionUpdate.modifiedCount === 0) {
      return res.status(200).send({
        success: true,
        message: "Payment already processed.",
      });
    }

    const updateResult = await bookingCollection.updateOne(
      {
        _id: new ObjectId(bookingId),
        paymentStatus: { $ne: "paid" },
        $expr: {
          $lte: [
            {
              $add: [{ $ifNull: ["$paidAmount", 0] }, paidAmount],
            },
            { $toDouble: "$packagePrice" },
          ],
        },
      },
      {
        $set: {
          paymentStatus: "partial",
          paymentMethod: "sslcommerz",
          updatedAt: new Date(),
        },
        $inc: {
          paymentAmount: paidAmount,
          paidAmount,
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      await updatePaymentTransaction(tran_id, "rejected", {
        failureReason: "Payment would exceed the booking amount",
      });
      return res.status(400).send({
        success: false,
        message: "Payment would exceed the remaining booking amount.",
      });
    }

    const paidTransactions =
      await findPaymentTransactionsByBookingId(bookingId);
    const totalPaid = paidTransactions
      .filter((transaction) => transaction.status === "paid")
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0,
      );
    const finalPaymentStatus = totalPaid >= bookingAmount ? "paid" : "partial";

    await bookingCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          paymentStatus: finalPaymentStatus,
          paymentAmount: totalPaid,
          paidAmount: totalPaid,
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(200).send({
        success: true,
        message: "Payment already processed.",
      });
    }

    console.log("✅ BOOKING PAYMENT UPDATED SUCCESSFULLY:", bookingId);

    return res.status(200).send({
      success: true,
      message: "Payment verified and booking updated successfully.",
    });
  } catch (error) {
    console.error("❌ SSLCommerz IPN error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to process payment IPN.",
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!isValidObjectId(bookingId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(bookingId),
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.userId !== req.user.userId) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to view this payment history.",
      });
    }

    const transactions = await findPaymentTransactionsByBookingId(bookingId);

    return res.send({
      success: true,
      bookingId,
      packageAmount: Number(booking.packagePrice || 0),
      totalPaid: transactions
        .filter((transaction) => transaction.status === "paid")
        .reduce(
          (total, transaction) => total + Number(transaction.amount || 0),
          0,
        ),
      transactions,
    });
  } catch (error) {
    console.error("❌ Failed to fetch payment history:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch payment history.",
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await findPaymentTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).send({
        success: false,
        message: "Payment transaction not found.",
      });
    }

    if (String(transaction.userId) !== String(req.user.userId)) {
      return res.status(403).send({
        success: false,
        message: "You are not authorized to view this payment.",
      });
    }

    return res.send({
      success: true,
      transaction: {
        transactionId: transaction.transactionId,
        bookingId: transaction.bookingId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        paidAt: transaction.paidAt || null,
        failureReason: transaction.failureReason || null,
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch payment status:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch payment status.",
    });
  }
};

export default {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  getPaymentHistory,
  getPaymentStatus,
};
