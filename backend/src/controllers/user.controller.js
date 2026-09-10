import { userCollection, ObjectId, isValidObjectId } from "../config/db.js";
import { loginActivityCollection } from "../models/loginActivity.model.js";

/**
 * Get all users with pagination and search (Admin Only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const search = req.query.search?.trim() || "";
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [totalCount, users] = await Promise.all([
      userCollection.countDocuments(query),
      userCollection
        .find(query)
        .project({ password: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.send({
      users,
      total: totalCount,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 * Get profile of the current logged-in user
 */
export const getMyProfile = async (req, res) => {
  try {
    const user = await userCollection.findOne(
      { email: req.user.email },
      { projection: { password: 0 } },
    );

    if (!user) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    return res.send(user);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return res.status(500).send({
      message: "Failed to fetch profile.",
    });
  }
};

/**
 * Update profile of the current logged-in user
 */
export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, address, bio, profilePhoto } = req.body;

    if (!req.user?.email) {
      return res.status(401).send({
        message: "User email not found in token.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).send({
        message: "Name is required.",
      });
    }

    const updateData = {
      name: name.trim(),
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      bio: bio?.trim() || "",
      profilePhoto: profilePhoto?.trim() || "",
      updatedAt: new Date(),
    };

    const result = await userCollection.updateOne(
      { email: req.user.email },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    const updatedUser = await userCollection.findOne(
      { email: req.user.email },
      { projection: { password: 0 } },
    );

    return res.send({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return res.status(500).send({
      message: "Failed to update profile.",
    });
  }
};

/**
 * Update user role (Admin Only)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid user ID.",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).send({
        message: "Invalid role.",
      });
    }

    const targetUser = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!targetUser) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    // Prevent admin from modifying their own role
    if (targetUser.email === req.user?.email) {
      return res.status(403).send({
        message: "You cannot change your own role.",
      });
    }

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    return res.send({
      message: "User role updated successfully.",
    });
  } catch (error) {
    console.error("Failed to change user role:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 * Edit user profile by ID (Admin Only)
 */
export const editUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profilePhoto, role } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid user ID.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).send({
        message: "Name is required.",
      });
    }

    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).send({
        message: "Invalid role.",
      });
    }

    const targetUser = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!targetUser) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    if (targetUser.email === req.user?.email && role && role !== targetUser.role) {
      return res.status(403).send({
        message: "You cannot change your own role.",
      });
    }

    const updateData = {
      name: name.trim(),
      profilePhoto: profilePhoto?.trim() || "",
      updatedAt: new Date(),
    };

    if (role) {
      updateData.role = role;
    }

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    return res.send({
      message: "User updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 * Delete user (Admin Only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid user ID.",
      });
    }

    const targetUser = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!targetUser) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    if (targetUser.email === req.user?.email) {
      return res.status(403).send({
        message: "You cannot delete your own account.",
      });
    }

    const result = await userCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    return res.send({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 * Get user login activity history
 */
export const getLoginActivity = async (req, res) => {
  try {
    const activities = await loginActivityCollection
      .find({ userId: req.user.userId })
      .sort({ loginAt: -1 })
      .limit(10)
      .toArray();

    return res.status(200).send({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Get login activity error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch login activity.",
    });
  }
};

export default {
  getAllUsers,
  getMyProfile,
  updateMyProfile,
  updateUserRole,
  editUserById,
  deleteUser,
  getLoginActivity,
};
