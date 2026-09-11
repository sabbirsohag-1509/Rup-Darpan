import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
  updateUserRole,
  editUserById,
  deleteUser,
  getLoginActivity,
} from "../controllers/user.controller.js";

const router = Router();

// Current User Profile
router.get("/users/me", verifyToken, getMyProfile);
router.patch("/users/me", verifyToken, updateMyProfile);
router.get("/users/login-activity", verifyToken, getLoginActivity);

// Admin User Management
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.patch("/users/:id/role", verifyToken, verifyAdmin, updateUserRole);
router.patch("/users/:id", verifyToken, verifyAdmin, editUserById);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);

export default router;
