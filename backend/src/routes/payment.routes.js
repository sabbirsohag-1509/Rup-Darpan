import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
} from "../controllers/payment.controller.js";

const router = Router();

// User Payment Session Initiation
router.post("/payment/init", verifyToken, initPayment);

// SSLCommerz Gateway Callbacks (Redirects)
router.post("/payment/success", paymentSuccess);
router.post("/payment/fail", paymentFail);
router.post("/payment/cancel", paymentCancel);

// SSLCommerz Webhook / IPN
router.post("/payment/ipn", paymentIPN);

export default router;
