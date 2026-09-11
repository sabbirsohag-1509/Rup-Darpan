import { heroImagesCollection, ObjectId, isValidObjectId } from "../config/db.js";

/**
 * Add a new hero image
 */
export const addHeroImage = async (req, res) => {
  try {
    const { title, image, publicId, altText, displayOrder, isActive } = req.body;

    if (!image) {
      return res.status(400).send({
        message: "Hero image is required.",
      });
    }

    const heroImageCount = await heroImagesCollection.countDocuments();

    if (heroImageCount >= 8) {
      return res.status(400).send({
        message: "Maximum 8 hero images are allowed.",
      });
    }

    const heroImage = {
      title: title?.trim() || "",
      image: image.trim(),
      publicId: publicId?.trim() || "",
      altText: altText?.trim() || title?.trim() || "Rup Darpon Hero Image",
      displayOrder: Number(displayOrder) || heroImageCount + 1,
      isActive: isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await heroImagesCollection.insertOne(heroImage);

    return res.status(201).send({
      success: true,
      message: "Hero image added successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Add hero image error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to add hero image.",
    });
  }
};

/**
 * Get all hero images
 */
export const getHeroImages = async (req, res) => {
  try {
    const heroImages = await heroImagesCollection
      .find({})
      .sort({ displayOrder: 1, createdAt: -1 })
      .toArray();

    return res.status(200).send(heroImages);
  } catch (error) {
    console.error("Get hero images error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to fetch hero images.",
    });
  }
};

/**
 * Update hero image by ID
 */
export const updateHeroImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid hero image ID.",
      });
    }

    const { title, image, publicId, altText, displayOrder, isActive } = req.body;

    const updateData = {
      title: title?.trim() || "",
      image: image?.trim() || "",
      publicId: publicId?.trim() || "",
      altText: altText?.trim() || title?.trim() || "Rup Darpon Hero Image",
      displayOrder: Number(displayOrder) || 1,
      isActive: isActive !== false,
      updatedAt: new Date(),
    };

    const result = await heroImagesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Hero image not found.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Hero image updated successfully.",
    });
  } catch (error) {
    console.error("Update hero image error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to update hero image.",
    });
  }
};

/**
 * Delete hero image by ID
 */
export const deleteHeroImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid hero image ID.",
      });
    }

    const result = await heroImagesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Hero image not found.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Hero image deleted successfully.",
    });
  } catch (error) {
    console.error("Delete hero image error:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to delete hero image.",
    });
  }
};

export default {
  addHeroImage,
  getHeroImages,
  updateHeroImage,
  deleteHeroImage,
};
