import { reviewCollection, packagesCollection, userCollection, ObjectId, isValidObjectId } from "../config/db.js";
import { createNotification } from "../utils/notification.helper.js";

/**
 * Submit a customer review (User)
 */
export const createReview = async (req, res) => {
  try {
    const { packageId, rating, comment } = req.body;
    const userId = req.user.userId;

    if (!packageId || !rating || !comment) {
      return res.status(400).send({
        message: "Package ID, rating, and comment are required.",
      });
    }

    if (!isValidObjectId(packageId)) {
      return res.status(400).send({
        message: "Invalid package ID.",
      });
    }

    const [user, pkg] = await Promise.all([
      userCollection.findOne({ _id: new ObjectId(userId) }),
      packagesCollection.findOne({ _id: new ObjectId(packageId) }),
    ]);

    if (!pkg) {
      return res.status(404).send({
        message: "Package not found.",
      });
    }

    const newReview = {
      packageId: String(packageId),
      packageName: pkg.name || pkg.title || "Package",
      userId: String(userId),
      userName: user?.name || "Customer",
      userPhoto: user?.profilePhoto || "",
      rating: Number(rating),
      comment: comment.trim(),
      status: "pending",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await reviewCollection.insertOne(newReview);

    // Notify admins safely
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
            type: "review",
            title: "New Review Submitted",
            message: `${user?.name || "A user"} submitted a review for ${pkg.name || "a package"}.`,
            relatedId: result.insertedId,
          }),
        ),
      );
    } catch (notifErr) {
      console.error("⚠️ Non-fatal notification error on review submission:", notifErr.message);
    }

    return res.status(201).send({
      success: true,
      message: "Review submitted successfully and is awaiting moderation.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to submit review:", error);
    return res.status(500).send({
      message: "Failed to submit review.",
    });
  }
};

/**
 * Get approved reviews for a specific package (Public)
 */
export const getPackageReviews = async (req, res) => {
  try {
    const { packageId } = req.params;

    const reviews = await reviewCollection
      .find({
        packageId: String(packageId),
        status: "approved",
      })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).send(reviews);
  } catch (error) {
    console.error("Failed to fetch package reviews:", error);
    return res.status(500).send({
      message: "Failed to fetch reviews.",
    });
  }
};

/**
 * Get all reviews (Admin Only)
 */
export const getAdminReviews = async (req, res) => {
  try {
    const reviews = await reviewCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).send(reviews);
  } catch (error) {
    console.error("Failed to fetch admin reviews:", error);
    return res.status(500).send({
      message: "Failed to fetch admin reviews.",
    });
  }
};

/**
 * Approve review (Admin Only)
 */
export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await reviewCollection.findOne({ _id: new ObjectId(id) });

    if (!review) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    const result = await reviewCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "approved",
          approvedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(400).send({
        success: false,
        message: "Review was not approved",
      });
    }

    // Notify reviewer safely
    try {
      await createNotification({
        recipientId: review.userId,
        recipientRole: "user",
        type: "review",
        title: "Review Published",
        message: `Your review for ${review.packageName || "the package"} has been approved and published.`,
        relatedId: review._id,
      });
    } catch (notifErr) {
      console.error("⚠️ Non-fatal notification error:", notifErr.message);
    }

    return res.send({
      success: true,
      message: "Review approved successfully",
    });
  } catch (error) {
    console.error("Failed to approve review:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to approve review",
    });
  }
};

/**
 * Reject review (Admin Only)
 */
export const rejectReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await reviewCollection.findOne({ _id: new ObjectId(id) });

    if (!review) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    const result = await reviewCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "rejected",
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(400).send({
        success: false,
        message: "Review was not rejected",
      });
    }

    try {
      await createNotification({
        recipientId: review.userId,
        recipientRole: "user",
        type: "review",
        title: "Review Rejected",
        message: `Your review for ${review.packageName || "the package"} was not approved.`,
        relatedId: review._id,
      });
    } catch (notifErr) {
      console.error("⚠️ Non-fatal notification error:", notifErr.message);
    }

    return res.send({
      success: true,
      message: "Review rejected successfully",
    });
  } catch (error) {
    console.error("Failed to reject review:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to reject review",
    });
  }
};

/**
 * Toggle feature status for review (Admin Only)
 */
export const toggleFeatureReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await reviewCollection.findOne({ _id: new ObjectId(id) });

    if (!review) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    await reviewCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          featured: Boolean(featured),
          updatedAt: new Date(),
        },
      },
    );

    return res.send({
      success: true,
      message: featured
        ? "Review featured successfully"
        : "Review unfeatured successfully",
    });
  } catch (error) {
    console.error("Failed to toggle review feature status:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to update review feature status",
    });
  }
};

/**
 * Delete review by Admin
 */
export const deleteAdminReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid review ID",
      });
    }

    const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    return res.send({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to delete review",
    });
  }
};

/**
 * Get reviews created by current user
 */
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await reviewCollection
      .find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).send(reviews);
  } catch (error) {
    console.error("Failed to fetch my reviews:", error);
    return res.status(500).send({
      message: "Failed to fetch your reviews",
    });
  }
};

/**
 * Update review by owner (User)
 */
export const updateMyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid review ID.",
      });
    }

    const review = await reviewCollection.findOne({
      _id: new ObjectId(id),
      userId: req.user.userId,
    });

    if (!review) {
      return res.status(404).send({
        message: "Review not found or you are not authorized to edit it",
      });
    }

    const updateDoc = {
      $set: {
        rating: Number(rating),
        comment: comment?.trim() || "",
        status: "pending",
        updatedAt: new Date(),
      },
    };

    const result = await reviewCollection.updateOne(
      { _id: new ObjectId(id), userId: req.user.userId },
      updateDoc,
    );

    if (result.modifiedCount === 0) {
      return res.status(400).send({
        message: "Review was not updated",
      });
    }

    return res.status(200).send({
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Failed to update review:", error);
    return res.status(500).send({
      message: "Failed to update review",
    });
  }
};

/**
 * Delete review by owner (User)
 */
export const deleteMyReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid review ID.",
      });
    }

    const result = await reviewCollection.deleteOne({
      _id: new ObjectId(id),
      userId: req.user.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "Review not found or you are not authorized to delete it",
      });
    }

    return res.status(200).send({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete review:", error);
    return res.status(500).send({
      message: "Failed to delete review",
    });
  }
};

export default {
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
};
