import { heroImagesCollection, ObjectId, isValidObjectId } from "../config/db.js";

export const findHeroImageById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await heroImagesCollection.findOne({ _id: new ObjectId(id) });
};

export const countHeroImages = async () => {
  return await heroImagesCollection.countDocuments();
};

export const createHeroImage = async (data) => {
  return await heroImagesCollection.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateHeroImageById = async (id, updateData) => {
  if (!isValidObjectId(id)) return null;
  return await heroImagesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
  );
};

export const deleteHeroImageById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await heroImagesCollection.deleteOne({ _id: new ObjectId(id) });
};

export { heroImagesCollection };
export default {
  collection: heroImagesCollection,
  findHeroImageById,
  countHeroImages,
  createHeroImage,
  updateHeroImageById,
  deleteHeroImageById,
};
