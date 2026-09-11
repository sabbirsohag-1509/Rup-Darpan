import { Router } from "express";
import passport from "../config/passport.js";
import env from "../config/env.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  getCurrentUser,
  logout,
  googleAuthCallback,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth.controller.js";

const router = Router();

// Authentication
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getCurrentUser);

// Password recovery & update
router.post("/users/forgot-password", forgotPassword);
router.patch("/users/reset-password/:token", resetPassword);
router.patch("/users/change-password", verifyToken, changePassword);

// Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.CLIENT_URL}/login`,
  }),
  googleAuthCallback,
);

export default router;
