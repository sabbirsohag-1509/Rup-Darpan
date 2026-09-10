import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  createReview,
  getPackageReviews,
  getAdminReviews,
  approveReview,
  rejectReview,
  toggleFeatureReview,
  deleteAdminReview,
  getMyReviews,
  updateMyReview,
  deleteMyReview,
} from "../controllers/review.controller.js";

const router = Router();

// Public reviews
router.get("/reviews/package/:packageId", getPackageReviews);

// User review actions
router.post("/reviews", verifyToken, createReview);
router.get("/reviews/my", verifyToken, getMyReviews);
router.patch("/reviews/:id", verifyToken, updateMyReview);
router.delete("/reviews/:id", verifyToken, deleteMyReview);

// Admin review moderation
router.get("/admin/reviews", verifyToken, verifyAdmin, getAdminReviews);
router.patch("/admin/reviews/:id/approve", verifyToken, verifyAdmin, approveReview);
router.patch("/admin/reviews/:id/reject", verifyToken, verifyAdmin, rejectReview);
router.patch("/admin/reviews/:id/feature", verifyToken, verifyAdmin, toggleFeatureReview);
router.delete("/admin/reviews/:id", verifyToken, verifyAdmin, deleteAdminReview);

export default router;
