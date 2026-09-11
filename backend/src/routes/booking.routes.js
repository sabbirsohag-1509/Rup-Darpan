import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";
import {
  createBooking,
  getUserBookings,
  getAdminBookings,
  confirmBooking,
  cancelBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";

const router = Router();

// User bookings
router.post("/bookings", verifyToken, createBooking);
router.get("/bookings", verifyToken, getUserBookings);

// Admin booking operations
router.get("/admin/bookings", verifyToken, verifyAdmin, getAdminBookings);
router.patch("/admin/bookings/:id/confirm", verifyToken, verifyAdmin, confirmBooking);
router.patch("/admin/bookings/:id/cancel", verifyToken, verifyAdmin, cancelBooking);
router.delete("/admin/bookings/:id", verifyToken, verifyAdmin, deleteBooking);

export default router;
