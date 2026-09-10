import { userCollection, ObjectId, isValidObjectId } from "../config/db.js";

export const findUserByEmail = async (email, projectPassword = true) => {
  if (!email) return null;
  const projection = projectPassword ? {} : { projection: { password: 0 } };
  return await userCollection.findOne({ email }, projection);
};

export const findUserById = async (id, projectPassword = false) => {
  if (!isValidObjectId(id)) return null;
  const projection = projectPassword ? {} : { projection: { password: 0 } };
  return await userCollection.findOne({ _id: new ObjectId(id) }, projection);
};

export const createUser = async (userData) => {
  return await userCollection.insertOne({
    ...userData,
    createdAt: new Date(),
  });
};

export const updateUserById = async (id, updateData) => {
  if (!isValidObjectId(id)) return null;
  return await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...updateData, updatedAt: new Date() } },
  );
};

export const deleteUserById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await userCollection.deleteOne({ _id: new ObjectId(id) });
};

export { userCollection };
export default {
  collection: userCollection,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
