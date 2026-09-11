import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  addPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/package.controller.js";

const router = Router();

// Public package browsing
router.get("/packages", getAllPackages);
router.get("/packages/:id", getPackageById);

// Admin package management
router.post("/packages", verifyToken, verifyAdmin, addPackage);
router.put("/packages/:id", verifyToken, verifyAdmin, updatePackage);
router.delete("/packages/:id", verifyToken, verifyAdmin, deletePackage);

export default router;
