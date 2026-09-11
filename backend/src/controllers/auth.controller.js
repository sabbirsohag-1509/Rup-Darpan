import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { userCollection, isValidObjectId, ObjectId } from "../config/db.js";
import { loginActivityCollection } from "../models/loginActivity.model.js";
import { createNotification } from "../utils/notification.helper.js";
import { getDeviceInfo } from "../utils/deviceInfo.js";
import { sendEmail } from "../config/mailer.js";

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, profilePhoto } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      profilePhoto: profilePhoto || "",
      role: "user",
      createdAt: new Date(),
    };

    const result = await userCollection.insertOne(newUser);

    // Create notifications for admins safely (do not block or fail registration)
    try {
      const admins = await userCollection
        .find({ role: "admin" })
        .project({ _id: 1, name: 1 })
        .toArray();

      await Promise.all(
        admins.map((admin) =>
          createNotification({
            recipientId: admin._id,
            recipientRole: "admin",
            type: "registration",
            title: "New User Registered",
            message: `${name} has registered a new account.`,
            relatedId: result.insertedId,
          }),
        ),
      );
    } catch (notifErr) {
      console.error("⚠️ Non-fatal admin notification error:", notifErr.message);
    }

    return res.status(201).send({
      success: true,
      message: "Registration successful",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 * User login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
      });
    }

    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(401).send({
        message: "Invalid email or password",
      });
    }

    // Guard: Prevent bcrypt crash if user signed up with Google (password is undefined)
    if (!user.password) {
      return res.status(401).send({
        message: "This account is linked with Google. Please log in using Google.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).send({
        message: "Invalid email or password",
      });
    }

    const deviceInfo = getDeviceInfo(req);

    // Record login activity
    try {
      await loginActivityCollection.insertOne({
        userId: user._id.toString(),
        email: user.email,
        loginMethod: "email",
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        loginAt: new Date(),
      });
    } catch (actErr) {
      console.error("⚠️ Non-fatal login activity error:", actErr.message);
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.user.userId)) {
      return res.status(400).send({
        message: "Invalid user token information",
      });
    }

    const user = await userCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } },
    );

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.send({ user });
  } catch (error) {
    console.error("Failed to fetch user in /me:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 * Logout
 */
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.send({
    message: "Logout successful",
  });
};

/**
 * Google OAuth Callback
 */
export const googleAuthCallback = async (req, res) => {
  try {
    const deviceInfo = getDeviceInfo(req);
    const userId = req.user._id.toString();

    try {
      await loginActivityCollection.insertOne({
        userId,
        email: req.user.email,
        loginMethod: "google",
        loginAt: new Date(),
        device: deviceInfo.device,
        deviceType: deviceInfo.deviceType,
        ip: deviceInfo.ip,
      });
    } catch (actErr) {
      console.error("⚠️ Non-fatal login activity error on Google OAuth:", actErr.message);
    }

    const token = jwt.sign(
      {
        userId,
        email: req.user.email,
        role: req.user.role,
      },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${env.CLIENT_URL}/`);
  } catch (error) {
    console.error("Google callback error:", error);
    return res.redirect(`${env.CLIENT_URL}/login`);
  }
};

/**
 * Forgot password - request reset email
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        message: "Email is required.",
      });
    }

    const user = await userCollection.findOne({ email });

    // Security: don't reveal whether email exists
    if (!user) {
      return res.status(200).send({
        message: "If an account exists with this email, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    await userCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: resetTokenExpires,
        },
      },
    );

    const resetLink = `${env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name || "there"},</p>
          <p>We received a request to reset your password.</p>
          <p>Click the button below to create a new password for your account:</p>
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">Reset Password</a>
          <p>This link expires in 15 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>`,
      });
    } catch (mailErr) {
      console.error("⚠️ Mail delivery failed:", mailErr.message);
    }

    return res.status(200).send({
      message: "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).send({
      message: "Failed to process forgot password request.",
    });
  }
};

/**
 * Reset password using token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).send({
        message: "Password must be at least 8 characters.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userCollection.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).send({
        message: "Password reset token is invalid or has expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: "",
        },
      },
    );

    return res.status(200).send({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).send({
      message: "Failed to reset password.",
    });
  }
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send({
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).send({
        message: "New password must be at least 8 characters.",
      });
    }

    if (!req.user?.userId || !isValidObjectId(req.user.userId)) {
      return res.status(401).send({
        message: "Invalid or missing user ID in session.",
      });
    }

    const user = await userCollection.findOne({
      _id: new ObjectId(req.user.userId),
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    if (!user.password) {
      return res.status(400).send({
        message: "Password change is not available for Google accounts.",
      });
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).send({
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    return res.status(200).send({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
  googleAuthCallback,
  forgotPassword,
  resetPassword,
  changePassword,
};
