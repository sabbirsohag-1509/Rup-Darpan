import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  addVideo,
  getAdminVideos,
  getFeaturedVideos,
  getAllVideos,
  updateVideo,
  toggleFeaturedVideo,
  deleteVideo,
} from "../controllers/video.controller.js";

const router = Router();

// Public Video routes
router.get("/featured-videos", getFeaturedVideos);
router.get("/all-videos", getAllVideos);

// Admin Video management
router.post("/videos", verifyToken, verifyAdmin, addVideo);
router.get("/videos", verifyToken, verifyAdmin, getAdminVideos);
router.put("/videos/:id", verifyToken, verifyAdmin, updateVideo);
router.patch("/videos/:id/featured", verifyToken, verifyAdmin, toggleFeaturedVideo);
router.delete("/videos/:id", verifyToken, verifyAdmin, deleteVideo);

export default router;
