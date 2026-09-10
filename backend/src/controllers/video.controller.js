import { videoCollection, ObjectId, isValidObjectId } from "../config/db.js";
import { isFacebookUrl } from "../utils/validators.js";

/**
 * Add a new video (Admin Only)
 */
export const addVideo = async (req, res) => {
  try {
    const {
      title,
      videoUrl,
      thumbnailUrl,
      category,
      description,
      featured,
      isPublished,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).send({
        success: false,
        message: "Video title is required.",
      });
    }

    if (!videoUrl?.trim()) {
      return res.status(400).send({
        success: false,
        message: "Facebook video URL is required.",
      });
    }

    if (!thumbnailUrl?.trim()) {
      return res.status(400).send({
        success: false,
        message: "Video thumbnail is required.",
      });
    }

    const cleanTitle = title.trim();
    const cleanVideoUrl = videoUrl.trim();
    const cleanThumbnailUrl = thumbnailUrl.trim();
    const cleanCategory = category?.trim() || "";
    const cleanDescription = description?.trim() || "";

    if (!isFacebookUrl(cleanVideoUrl)) {
      return res.status(400).send({
        success: false,
        message: "Only Facebook reel, share video, or watch URLs are allowed.",
      });
    }

    // Featured limit validation
    if (featured === true) {
      const featuredCount = await videoCollection.countDocuments({
        featured: true,
      });

      if (featuredCount >= 8) {
        return res.status(400).send({
          success: false,
          message:
            "Maximum 8 featured videos are allowed. Please unfeature another video first.",
        });
      }
    }

    const newVideo = {
      title: cleanTitle,
      videoUrl: cleanVideoUrl,
      thumbnailUrl: cleanThumbnailUrl,
      category: cleanCategory,
      description: cleanDescription,
      featured: featured === true,
      isPublished: isPublished !== false,
      likes: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await videoCollection.insertOne(newVideo);

    return res.status(201).send({
      success: true,
      message: "Video added successfully.",
      insertedId: result.insertedId,
      video: {
        _id: result.insertedId,
        ...newVideo,
      },
    });
  } catch (error) {
    console.error("Add video error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to add video.",
    });
  }
};

/**
 * Get videos for Admin with pagination
 */
export const getAdminVideos = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 50);
    const skip = (page - 1) * limit;

    const [total, featuredCount, videos] = await Promise.all([
      videoCollection.countDocuments(),
      videoCollection.countDocuments({ featured: true }),
      videoCollection
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    return res.status(200).send({
      success: true,
      videos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      featuredCount,
    });
  } catch (error) {
    console.error("Get admin videos error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch videos.",
    });
  }
};

/**
 * Get featured videos (Public)
 */
export const getFeaturedVideos = async (req, res) => {
  try {
    const featuredVideos = await videoCollection
      .find({
        featured: true,
        isPublished: true,
      })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();

    return res.status(200).send({
      success: true,
      videos: featuredVideos,
    });
  } catch (error) {
    console.error("Featured videos error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch featured videos.",
    });
  }
};

/**
 * Get all published videos for gallery (Public)
 */
export const getAllVideos = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const query = { isPublished: true };

    const [total, videos] = await Promise.all([
      videoCollection.countDocuments(query),
      videoCollection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    return res.status(200).send({
      success: true,
      videos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("All videos error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch videos.",
    });
  }
};

/**
 * Update video by ID (Admin Only)
 */
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid video id.",
      });
    }

    const videoId = new ObjectId(id);
    const {
      title,
      videoUrl,
      thumbnailUrl,
      category,
      description,
      featured,
      isPublished,
    } = req.body;

    const currentVideo = await videoCollection.findOne({ _id: videoId });

    if (!currentVideo) {
      return res.status(404).send({
        success: false,
        message: "Video not found.",
      });
    }

    if (videoUrl && !isFacebookUrl(videoUrl.trim())) {
      return res.status(400).send({
        success: false,
        message: "Only Facebook reel, share video, or watch URLs are allowed.",
      });
    }

    if (featured === true && !currentVideo.featured) {
      const featuredCount = await videoCollection.countDocuments({
        featured: true,
      });

      if (featuredCount >= 8) {
        return res.status(400).send({
          success: false,
          message:
            "Maximum 8 featured videos are allowed. Please unfeature another video first.",
        });
      }
    }

    const updatePayload = {
      ...(title !== undefined && { title: title.trim() }),
      ...(videoUrl !== undefined && { videoUrl: videoUrl.trim() }),
      ...(thumbnailUrl !== undefined && { thumbnailUrl: thumbnailUrl.trim() }),
      ...(category !== undefined && { category: category?.trim() || "" }),
      ...(description !== undefined && { description: description?.trim() || "" }),
      ...(featured !== undefined && { featured: featured === true }),
      ...(isPublished !== undefined && { isPublished: isPublished !== false }),
      updatedAt: new Date(),
    };

    const result = await videoCollection.updateOne(
      { _id: videoId },
      { $set: updatePayload },
    );

    return res.status(200).send({
      success: true,
      message: "Video updated successfully.",
      result,
    });
  } catch (error) {
    console.error("Update video error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to update video.",
    });
  }
};

/**
 * Toggle featured flag for video (Admin Only)
 */
export const toggleFeaturedVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid video id.",
      });
    }

    if (typeof featured !== "boolean") {
      return res.status(400).send({
        message: "Featured value must be true or false.",
      });
    }

    const videoId = new ObjectId(id);
    const video = await videoCollection.findOne({ _id: videoId });

    if (!video) {
      return res.status(404).send({
        message: "Video not found.",
      });
    }

    if (featured === true && !video.featured) {
      const featuredCount = await videoCollection.countDocuments({
        featured: true,
      });

      if (featuredCount >= 8) {
        return res.status(400).send({
          message:
            "Maximum 8 featured videos are allowed. Please unfeature another video first.",
        });
      }
    }

    await videoCollection.updateOne(
      { _id: videoId },
      {
        $set: {
          featured,
          updatedAt: new Date(),
        },
      },
    );

    return res.status(200).send({
      success: true,
      message: featured
        ? "Video added to featured list successfully."
        : "Video removed from featured list successfully.",
    });
  } catch (error) {
    console.error("Toggle featured video error:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

/**
 * Delete video by ID (Admin Only)
 */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid video id.",
      });
    }

    const result = await videoCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Video not found.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Video deleted successfully.",
    });
  } catch (error) {
    console.error("Delete video error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to delete video.",
    });
  }
};

export default {
  addVideo,
  getAdminVideos,
  getFeaturedVideos,
  getAllVideos,
  updateVideo,
  toggleFeaturedVideo,
  deleteVideo,
};
