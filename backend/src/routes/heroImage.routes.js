import { Router } from "express";
import {
  addHeroImage,
  getHeroImages,
  updateHeroImage,
  deleteHeroImage,
} from "../controllers/heroImage.controller.js";

const router = Router();

router.post("/hero-images", addHeroImage);
router.get("/hero-images", getHeroImages);
router.put("/hero-images/:id", updateHeroImage);
router.delete("/hero-images/:id", deleteHeroImage);

export default router;
