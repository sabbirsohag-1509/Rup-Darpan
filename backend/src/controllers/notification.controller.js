import { notificationsCollection, ObjectId, isValidObjectId } from "../config/db.js";
import { createNotification as createNotificationHelper } from "../utils/notification.helper.js";

/**
 * Create a new notification manually
 */
export const createNotification = async (req, res) => {
  try {
    const { recipientId, recipientRole, type, title, message, relatedId } = req.body;

    if (!recipientId || !title || !message) {
      return res.status(400).send({
        success: false,
        message: "Recipient ID, title, and message are required.",
      });
    }

    const notification = await createNotificationHelper({
      recipientId,
      recipientRole: recipientRole || "user",
      type: type || "general",
      title,
      message,
      relatedId: relatedId || null,
    });

    return res.status(201).send({
      success: true,
      message: "Notification created successfully.",
      notification,
    });
  } catch (error) {
    console.error("Create notification endpoint error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to create notification.",
    });
  }
};

/**
 * Get notifications for authenticated user
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await notificationsCollection
      .find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).send({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

/**
 * Get unread notification count for user
 */
export const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await notificationsCollection.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    return res.status(200).send({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch unread notification count.",
    });
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const result = await notificationsCollection.updateOne(
      {
        _id: new ObjectId(id),
        recipientId: req.user.userId,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Notification not found or you are not authorized.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Notification marked as read.",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to mark notification as read.",
    });
  }
};

/**
 * Mark all notifications as read for current user
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await notificationsCollection.updateMany(
      {
        recipientId: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    return res.status(200).send({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to mark all notifications as read.",
    });
  }
};

/**
 * Delete a notification by ID
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const result = await notificationsCollection.deleteOne({
      _id: new ObjectId(id),
      recipientId: req.user.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Notification not found or you are not authorized.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to delete notification.",
    });
  }
};

export default {
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
};
