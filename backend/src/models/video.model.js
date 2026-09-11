import { videoCollection, ObjectId, isValidObjectId } from "../config/db.js";

export const findVideoById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await videoCollection.findOne({ _id: new ObjectId(id) });
};

export const countFeaturedVideos = async () => {
  return await videoCollection.countDocuments({ featured: true });
};

export const createVideo = async (videoData) => {
  return await videoCollection.insertOne({
    ...videoData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateVideoById = async (id, updateData) => {
  if (!isValidObjectId(id)) return null;
  return await videoCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
  );
};

export const deleteVideoById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await videoCollection.deleteOne({ _id: new ObjectId(id) });
};

export { videoCollection };
export default {
  collection: videoCollection,
  findVideoById,
  countFeaturedVideos,
  createVideo,
  updateVideoById,
  deleteVideoById,
};
