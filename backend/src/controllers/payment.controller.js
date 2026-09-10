import sslcz from "../config/sslcommerz.js";
import env from "../config/env.js";
import { bookingCollection, ObjectId, isValidObjectId } from "../config/db.js";

/**
 * Initialize SSLCommerz Payment session (User)
 */
export const initPayment = async (req, res) => {
  try {
    const { amount, customerName, customerEmail, bookingId } = req.body;

    if (!amount || !customerName || !customerEmail || !bookingId) {
      return res.status(400).send({
        success: false,
        message: "Amount, customer name, customer email and booking ID are required.",
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

    if (booking.paymentStatus === "paid") {
      return res.status(400).send({
        success: false,
        message: "This booking has already been paid.",
      });
    }

    const paymentAmount = Number(booking.packagePrice);

    if (Number(amount) !== paymentAmount) {
      return res.status(400).send({
        success: false,
        message: "Payment amount does not match booking amount.",
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

      cus_name: customerName,
      cus_email: customerEmail,
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

    console.log("💳 Initializing SSLCommerz Payment for tran_id:", transactionId);

    const apiResponse = await sslcz.init(data);

    if (!apiResponse?.GatewayPageURL) {
      return res.status(500).send({
        success: false,
        message: "Failed to initialize SSLCommerz payment.",
      });
    }

    // Save transaction ID on booking
    await bookingCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { transactionId, updatedAt: new Date() } },
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

    if (booking.paymentStatus === "paid") {
      return res.status(200).send({
        success: true,
        message: "Payment already processed.",
      });
    }

    const paidAmount = Number(validationResponse.amount);
    const bookingAmount = Number(booking.packagePrice);

    if (paidAmount !== bookingAmount) {
      return res.status(400).send({
        success: false,
        message: "Payment amount does not match booking amount.",
      });
    }

    if (booking.transactionId && booking.transactionId !== tran_id) {
      return res.status(400).send({
        success: false,
        message: "Transaction ID does not match booking.",
      });
    }

    const updateResult = await bookingCollection.updateOne(
      {
        _id: new ObjectId(bookingId),
        paymentStatus: { $ne: "paid" },
      },
      {
        $set: {
          paymentStatus: "paid",
          paymentMethod: "sslcommerz",
          transactionId: tran_id,
          paymentAmount: paidAmount,
          paidAt: new Date(),
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

export default {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
};
