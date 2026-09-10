import { packagesCollection, ObjectId, isValidObjectId } from "../config/db.js";

export const findPackageById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await packagesCollection.findOne({ _id: new ObjectId(id) });
};

export const createPackage = async (packageData) => {
  return await packagesCollection.insertOne({
    ...packageData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updatePackageById = async (id, updateData) => {
  if (!isValidObjectId(id)) return null;
  return await packagesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
  );
};

export const deletePackageById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await packagesCollection.deleteOne({ _id: new ObjectId(id) });
};

export { packagesCollection };
export default {
  collection: packagesCollection,
  findPackageById,
  createPackage,
  updatePackageById,
  deletePackageById,
};
