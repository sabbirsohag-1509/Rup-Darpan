import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.post("/notifications", verifyToken, createNotification);
router.get("/notifications", verifyToken, getUserNotifications);
router.get("/notifications/unread-count", verifyToken, getUnreadNotificationCount);
router.patch("/notifications/:id/read", verifyToken, markNotificationRead);
router.patch("/notifications/read-all", verifyToken, markAllNotificationsRead);
router.delete("/notifications/:id", verifyToken, deleteNotification);

export default router;
