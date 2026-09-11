import { bookingCollection, userCollection, ObjectId, isValidObjectId } from "../config/db.js";
import { createNotification } from "../utils/notification.helper.js";

/**
 * Create a new booking (User)
 */
export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    if (!isValidObjectId(req.user.userId)) {
      return res.status(401).send({
        message: "Invalid user authentication information.",
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

    const newBooking = {
      ...bookingData,
      userId: req.user.userId,
      userName: user.name,
      userEmail: user.email,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await bookingCollection.insertOne(newBooking);

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
            type: "booking",
            title: "New Booking Received",
            message: `${user.name} has submitted a new booking request.`,
            relatedId: result.insertedId,
          }),
        ),
      );
    } catch (adminNotifErr) {
      console.error("⚠️ Non-fatal admin notification error:", adminNotifErr.message);
    }

    // Notify booking creator safely
    try {
      await createNotification({
        recipientId: req.user.userId,
        recipientRole: "user",
        type: "booking",
        title: "Booking Submitted",
        message:
          "Your booking request has been submitted successfully and is waiting for confirmation.",
        relatedId: result.insertedId,
      });
    } catch (userNotifErr) {
      console.error("⚠️ Non-fatal user notification error:", userNotifErr.message);
    }

    return res.status(201).send({
      success: true,
      message: "Booking created successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return res.status(500).send({
      message: "Failed to create booking",
    });
  }
};

/**
 * Get bookings for the authenticated user
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await bookingCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.send(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return res.status(500).send({
      message: "Failed to fetch bookings",
    });
  }
};

/**
 * Get all bookings (Admin Only)
 */
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await bookingCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.send(bookings);
  } catch (error) {
    console.error("Failed to fetch admin bookings:", error);
    return res.status(500).send({
      message: "Failed to fetch admin bookings",
    });
  }
};

/**
 * Confirm booking (Admin Only)
 */
export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "confirmed",
          updatedAt: new Date(),
        },
      },
    );

    // Notify user safely
    try {
      await createNotification({
        recipientId: booking.userId,
        recipientRole: "user",
        type: "booking",
        title: "Booking Confirmed",
        message: "Your booking has been confirmed successfully.",
        relatedId: id,
      });
    } catch (notifErr) {
      console.error("⚠️ Non-fatal notification error:", notifErr.message);
    }

    return res.send({
      success: true,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("Failed to confirm booking:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to confirm booking",
    });
  }
};

/**
 * Cancel booking (Admin Only)
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }

    await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      },
    );

    // Notify user safely
    try {
      await createNotification({
        recipientId: booking.userId,
        recipientRole: "user",
        type: "booking",
        title: "Booking Cancelled",
        message: "Your booking has been cancelled by the administrator.",
        relatedId: id,
      });
    } catch (notifErr) {
      console.error("⚠️ Non-fatal notification error:", notifErr.message);
    }

    return res.send({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

/**
 * Delete booking (Admin Only)
 */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        message: "Invalid booking ID",
      });
    }

    const result = await bookingCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        message: "Booking not found",
      });
    }

    return res.send({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return res.status(500).send({
      message: "Failed to delete booking",
    });
  }
};

export default {
  createBooking,
  getUserBookings,
  getAdminBookings,
  confirmBooking,
  cancelBooking,
  deleteBooking,
};
