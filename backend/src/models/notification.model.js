import { notificationsCollection, ObjectId, isValidObjectId } from "../config/db.js";

export const countUnreadNotifications = async (userId) => {
  return await notificationsCollection.countDocuments({
    recipientId: String(userId),
    isRead: false,
  });
};

export const markNotificationAsRead = async (id, recipientId) => {
  if (!isValidObjectId(id)) return null;
  return await notificationsCollection.updateOne(
    {
      _id: new ObjectId(id),
      recipientId: String(recipientId),
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );
};

export const markAllNotificationsAsRead = async (recipientId) => {
  return await notificationsCollection.updateMany(
    {
      recipientId: String(recipientId),
      isRead: false,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );
};

export const deleteNotificationById = async (id, recipientId) => {
  if (!isValidObjectId(id)) return null;
  return await notificationsCollection.deleteOne({
    _id: new ObjectId(id),
    recipientId: String(recipientId),
  });
};

export { notificationsCollection };
export default {
  collection: notificationsCollection,
  countUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
};
