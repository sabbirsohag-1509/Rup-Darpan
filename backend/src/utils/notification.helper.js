import { notificationsCollection } from "../config/db.js";

/**
 * Creates an in-app notification record safely without throwing unhandled exceptions
 */
export const createNotification = async ({
  recipientId,
  recipientRole = "user",
  type,
  title,
  message,
  relatedId = null,
}) => {
  try {
    if (!recipientId) {
      console.warn("⚠️ createNotification called without recipientId. Skipping notification.");
      return null;
    }

    const notificationData = {
      recipientId: String(recipientId),
      recipientRole,
      type,
      title,
      message,
      relatedId: relatedId ? String(relatedId) : null,
      isRead: false,
      createdAt: new Date(),
    };

    const result = await notificationsCollection.insertOne(notificationData);

    return {
      _id: result.insertedId,
      ...notificationData,
    };
  } catch (error) {
    console.error("❌ Failed to create notification:", error.message);
    return null;
  }
};

export default createNotification;
