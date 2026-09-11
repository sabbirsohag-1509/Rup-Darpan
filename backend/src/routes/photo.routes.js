import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  addPhoto,
  getAdminPhotos,
  getFeaturedPhotos,
  getAllPhotos,
  updatePhoto,
  deletePhoto,
  togglePhotoLike,
  getPhotoLikeStatus,
} from "../controllers/photo.controller.js";

const router = Router();

// Public Photo routes
router.get("/featured-photos", getFeaturedPhotos);
router.get("/all-photos", getAllPhotos);
router.post("/photos/:id/like", togglePhotoLike);
router.get("/photos/:id/like/:visitorId", getPhotoLikeStatus);

// Admin Photo management
router.post("/photos", verifyToken, verifyAdmin, addPhoto);
router.get("/photos", verifyToken, verifyAdmin, getAdminPhotos);
router.put("/photos/:id", verifyToken, verifyAdmin, updatePhoto);
router.delete("/photos/:id", verifyToken, verifyAdmin, deletePhoto);

export default router;
