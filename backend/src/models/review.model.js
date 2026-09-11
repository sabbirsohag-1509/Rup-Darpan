import { reviewCollection, ObjectId, isValidObjectId } from "../config/db.js";

export const findReviewById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await reviewCollection.findOne({ _id: new ObjectId(id) });
};

export const createReview = async (reviewData) => {
  return await reviewCollection.insertOne({
    ...reviewData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateReviewById = async (id, updateData) => {
  if (!isValidObjectId(id)) return null;
  return await reviewCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
  );
};

export const deleteReviewById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await reviewCollection.deleteOne({ _id: new ObjectId(id) });
};

export { reviewCollection };
export default {
  collection: reviewCollection,
  findReviewById,
  createReview,
  updateReviewById,
  deleteReviewById,
};
