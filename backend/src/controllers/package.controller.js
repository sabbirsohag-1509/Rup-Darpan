import { packagesCollection, ObjectId, isValidObjectId } from "../config/db.js";

/**
 * Add a new package (Admin Only)
 */
export const addPackage = async (req, res) => {
  try {
    const newPackage = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await packagesCollection.insertOne(newPackage);
    return res.status(201).send(result);
  } catch (error) {
    console.error("Add package error:", error);
    return res.status(500).send({
      message: "Failed to add package",
    });
  }
};

/**
 * Get all packages (Public)
 */
export const getAllPackages = async (req, res) => {
  try {
    const packages = await packagesCollection.find().toArray();
    return res.status(200).send(packages);
  } catch (error) {
    console.error("Failed to fetch packages:", error);
    return res.status(500).send({
      message: "Failed to fetch packages",
    });
  }
};

/**
 * Get single package details by ID (Public)
 */
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid package ID.",
      });
    }

    const pkg = await packagesCollection.findOne({ _id: new ObjectId(id) });

    if (!pkg) {
      return res.status(404).send({
        message: "Package not found",
      });
    }

    return res.status(200).send(pkg);
  } catch (error) {
    console.error("Failed to fetch package:", error);
    return res.status(500).send({
      message: "Failed to fetch package",
    });
  }
};

/**
 * Update package by ID (Admin Only)
 */
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid package ID.",
      });
    }

    const updatePayload = {
      ...req.body,
      updatedAt: new Date(),
    };

    const result = await packagesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatePayload },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        message: "Package not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Package updated successfully.",
      result,
    });
  } catch (error) {
    console.error("Update package error:", error);
    return res.status(500).send({
      message: "Failed to update package",
    });
  }
};

/**
 * Delete package by ID (Admin Only)
 */
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid package ID.",
      });
    }

    const result = await packagesCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "Package not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Delete package error:", error);
    return res.status(500).send({
      message: "Failed to delete package",
    });
  }
};

export default {
  addPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
