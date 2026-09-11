import { bookingCollection, ObjectId, isValidObjectId } from "../config/db.js";

export const findBookingById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await bookingCollection.findOne({ _id: new ObjectId(id) });
};

export const createBooking = async (bookingData) => {
  return await bookingCollection.insertOne({
    ...bookingData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateBookingById = async (id, updateData) => {
  if (!isValidObjectId(id)) return null;
  return await bookingCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
  );
};

export const deleteBookingById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await bookingCollection.deleteOne({ _id: new ObjectId(id) });
};

export { bookingCollection };
export default {
  collection: bookingCollection,
  findBookingById,
  createBooking,
  updateBookingById,
  deleteBookingById,
};
