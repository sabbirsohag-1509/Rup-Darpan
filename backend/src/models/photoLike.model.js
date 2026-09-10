import { photoLikes, ObjectId } from "../config/db.js";

export const findLike = async (photoId, visitorId) => {
  return await photoLikes.findOne({
    photoId: String(photoId),
    visitorId: String(visitorId),
  });
};

export const addLike = async (photoId, visitorId) => {
  return await photoLikes.insertOne({
    photoId: String(photoId),
    visitorId: String(visitorId),
    createdAt: new Date(),
  });
};

export const removeLike = async (likeId) => {
  return await photoLikes.deleteOne({ _id: new ObjectId(likeId) });
};

export const countPhotoLikes = async (photoId) => {
  return await photoLikes.countDocuments({ photoId: String(photoId) });
};

export { photoLikes };
export default {
  collection: photoLikes,
  findLike,
  addLike,
  removeLike,
  countPhotoLikes,
};
