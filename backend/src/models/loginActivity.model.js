import { loginActivityCollection, ObjectId } from "../config/db.js";

export const recordLoginActivity = async (activityData) => {
  return await loginActivityCollection.insertOne({
    ...activityData,
    loginAt: new Date(),
  });
};

export const getLoginActivityByUserId = async (userId, limit = 10) => {
  return await loginActivityCollection
    .find({ userId: String(userId) })
    .sort({ loginAt: -1 })
    .limit(limit)
    .toArray();
};

export { loginActivityCollection };
export default {
  collection: loginActivityCollection,
  recordLoginActivity,
  getUserActivity: getLoginActivityByUserId,
};
