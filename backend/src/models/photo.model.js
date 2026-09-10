import { photoCollection, ObjectId, isValidObjectId } from "../config/db.js";

export const countFeaturedPhotos = async () => {
  return await photoCollection.countDocuments({ featured: true });
};

export const countTotalPhotos = async (query = {}) => {
  return await photoCollection.countDocuments(query);
};

export const findPhotoById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await photoCollection.findOne({ _id: new ObjectId(id) });
};

export const createPhoto = async (photoData) => {
  return await photoCollection.insertOne({
    ...photoData,
    createdAt: new Date(),
  });
};

export const updatePhotoById = async (id, updateData) => {
  if (!isValidObjectId(id)) return null;
  return await photoCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
  );
};

export const deletePhotoById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await photoCollection.deleteOne({ _id: new ObjectId(id) });
};

export { photoCollection };
export default {
  collection: photoCollection,
  countFeaturedPhotos,
  countTotalPhotos,
  findPhotoById,
  createPhoto,
  updatePhotoById,
  deletePhotoById,
};
