import {
  ObjectId,
  isValidObjectId,
  paymentTransactionsCollection,
} from "../config/db.js";

export const createPaymentTransaction = async (transactionData) => {
  return paymentTransactionsCollection.insertOne({
    ...transactionData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const findPaymentTransactionById = async (transactionId) => {
  return paymentTransactionsCollection.findOne({ transactionId });
};

export const updatePaymentTransaction = async (
  transactionId,
  status,
  details = {},
) => {
  return paymentTransactionsCollection.updateOne(
    { transactionId },
    {
      $set: {
        ...details,
        status,
        updatedAt: new Date(),
      },
    },
  );
};

export const findPaymentTransactionsByBookingId = async (bookingId) => {
  if (!isValidObjectId(bookingId)) return [];

  return paymentTransactionsCollection
    .find({ bookingId: new ObjectId(bookingId) })
    .sort({ createdAt: -1 })
    .toArray();
};

export { paymentTransactionsCollection };

export default {
  collection: paymentTransactionsCollection,
  createPaymentTransaction,
  findPaymentTransactionById,
  updatePaymentTransaction,
  findPaymentTransactionsByBookingId,
};
