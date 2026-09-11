import { photoCollection, photoLikes, ObjectId, isValidObjectId } from "../config/db.js";

/**
 * Add a new photo (Admin Only)
 */
export const addPhoto = async (req, res) => {
  try {
    const photo = {
      ...req.body,
      createdAt: new Date(),
    };
    const result = await photoCollection.insertOne(photo);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Add photo error:", error);
    return res.status(500).send({ message: "Failed to add photo" });
  }
};

/**
 * Get photos for admin management with pagination
 */
export const getAdminPhotos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const [total, featuredCount, photos] = await Promise.all([
      photoCollection.countDocuments(),
      photoCollection.countDocuments({ featured: true }),
      photoCollection
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    return res.send({
      photos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      featuredCount,
    });
  } catch (error) {
    console.error("Get photos error:", error);
    return res.status(500).send({
      message: "Failed to fetch photos",
    });
  }
};

/**
 * Get featured photos (Public)
 */
export const getFeaturedPhotos = async (req, res) => {
  try {
    const featuredPhotos = await photoCollection
      .find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();

    return res.send(featuredPhotos);
  } catch (error) {
    console.error("Featured photos error:", error);
    return res.status(500).send({
      message: "Failed to fetch featured photos",
    });
  }
};

/**
 * Get all photos for gallery (Public)
 */
export const getAllPhotos = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const total = await photoCollection.countDocuments();
    const photos = await photoCollection
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return res.status(200).send({
      photos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get gallery photos error:", error);
    return res.status(500).send({
      message: "Failed to fetch photos",
    });
  }
};

/**
 * Update photo by ID (Admin Only)
 */
export const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid photo id",
      });
    }

    const photoId = new ObjectId(id);
    const photoData = req.body;

    const currentPhoto = await photoCollection.findOne({ _id: photoId });

    if (!currentPhoto) {
      return res.status(404).send({
        message: "Photo not found",
      });
    }

    // Featured limit validation (max 8)
    const isCurrentlyFeatured = Boolean(currentPhoto.featured);
    const wantsToBeFeatured = photoData.featured === true;
    const isTryingToAddFeatured = wantsToBeFeatured && !isCurrentlyFeatured;

    if (isTryingToAddFeatured) {
      const featuredCount = await photoCollection.countDocuments({
        featured: true,
      });

      if (featuredCount >= 8) {
        return res.status(400).send({
          message:
            "Maximum 8 featured photos are allowed. Please remove one featured photo first.",
        });
      }
    }

    const updatePayload = {
      ...photoData,
      updatedAt: new Date(),
    };

    const result = await photoCollection.updateOne(
      { _id: photoId },
      { $set: updatePayload },
    );

    return res.send({
      success: true,
      message: "Photo updated successfully.",
      result,
    });
  } catch (error) {
    console.error("Update photo error:", error);
    return res.status(500).send({
      message: "Failed to update photo.",
    });
  }
};

/**
 * Delete photo by ID (Admin Only)
 */
export const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid photo id" });
    }

    const result = await photoCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Photo not found" });
    }

    return res.send({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    return res.status(500).send({ message: "Failed to delete photo" });
  }
};

/**
 * Toggle photo like for visitor
 */
export const togglePhotoLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).send({
        message: "visitorId is required",
      });
    }

    const existingLike = await photoLikes.findOne({
      photoId: id,
      visitorId,
    });

    // Already liked -> Unlike
    if (existingLike) {
      await photoLikes.deleteOne({ _id: existingLike._id });
      const likes = await photoLikes.countDocuments({ photoId: id });
      return res.send({ liked: false, likes });
    }

    // New like (guard against concurrent unique constraint violation)
    try {
      await photoLikes.insertOne({
        photoId: id,
        visitorId,
        createdAt: new Date(),
      });
    } catch (insertError) {
      if (insertError.code !== 11000) throw insertError;
    }

    const likes = await photoLikes.countDocuments({ photoId: id });
    return res.send({ liked: true, likes });
  } catch (error) {
    console.error("Photo like error:", error);
    return res.status(500).send({
      message: "Failed to like photo",
    });
  }
};

/**
 * Get visitor like status for a photo
 */
export const getPhotoLikeStatus = async (req, res) => {
  try {
    const { id, visitorId } = req.params;

    if (!visitorId) {
      return res.status(400).send({
        message: "visitorId is required",
      });
    }

    const [existingLike, likes] = await Promise.all([
      photoLikes.findOne({ photoId: id, visitorId }),
      photoLikes.countDocuments({ photoId: id }),
    ]);

    return res.send({
      liked: !!existingLike,
      likes,
    });
  } catch (error) {
    console.error("Get photo like status error:", error);
    return res.status(500).send({
      message: "Failed to get photo like status",
    });
  }
};

export default {
  addPhoto,
  getAdminPhotos,
  getFeaturedPhotos,
  getAllPhotos,
  updatePhoto,
  deletePhoto,
  togglePhotoLike,
  getPhotoLikeStatus,
};
