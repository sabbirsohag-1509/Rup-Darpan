import jwt from "jsonwebtoken";
import env from "../config/env.js";

/**
 * Verify JWT token from cookie or Authorization header
 */
export const verifyToken = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized access. Please Login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Normalize user object across different identifier conventions
    const userId = decoded.userId || decoded._id || decoded.id;

    req.user = {
      ...decoded,
      userId: String(userId),
      _id: String(userId),
      id: String(userId),
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).send({
      message: "Invalid or expired token",
    });
  }
};

/**
 * Verify administrator role
 */
export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send({
      message: "Admin Access required",
    });
  }

  next();
};

export default {
  verifyToken,
  verifyAdmin,
};
