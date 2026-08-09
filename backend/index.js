require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
// VERIFY JWT TOKEN
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized access. Please Login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).send({
      message: "Invalid or expired token",
    });
  }
};

//Verify Admin
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send({
      message: "Admin Access required",
    });
  }

  next();
};
////////////////////////

app.get("/", (req, res) => {
  res.send("Hello World! CRUD is working fine");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycluster.eyaxb6h.mongodb.net/?retryWrites=true&w=majority&appName=myCluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    //db collection start

    const myDB = client.db("rup-darpon");
    const photoCollection = myDB.collection("photos");
    const userCollection = myDB.collection("users");
    const packagesCollection = myDB.collection("packages");
    const bookingCollection = myDB.collection("bookings");
    const reviewCollection = myDB.collection("reviews");

    // Google Strategy
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },

        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
              return done(null, false);
            }

            let user = await userCollection.findOne({ email });

            if (!user) {
              const newUser = {
                name: profile.displayName,
                email,
                profilePhoto: profile.photos?.[0]?.value || "",
                role: "user",
                authProvider: "google",
                createdAt: new Date(),
              };

              const result = await userCollection.insertOne(newUser);

              user = {
                _id: result.insertedId,
                ...newUser,
              };
            }

            return done(null, user);
          } catch (error) {
            console.error("Google authentication error:", error);
            return done(error, null);
          }
        },
      ),
    );
    ////
    //////////////////////// USER's RELATED API ////////////////////////////////////////////
    // GET ALL USERS - ADMIN ONLY
    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

        const limit = Math.min(
          Math.max(parseInt(req.query.limit, 10) || 10, 1),
          50,
        );

        const search = req.query.search?.trim() || "";

        const skip = (page - 1) * limit;

        const query = search
          ? {
              $or: [
                {
                  name: {
                    $regex: search,
                    $options: "i",
                  },
                },
                {
                  email: {
                    $regex: search,
                    $options: "i",
                  },
                },
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

        res.send({
          users,
          total: totalCount,
          page,
          totalPages,
        });
      } catch (error) {
        console.error("Failed to fetch users:", error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
    //Change user role - ADMIN ONLY PATCH
    app.patch("/users/:id/role", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;
        const { role } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            message: "Invalid user ID.",
          });
        }

        if (!["user", "admin"].includes(role)) {
          return res.status(400).send({
            message: "Invalid role.",
          });
        }

        // Prevent admin from changing their own role
        if (req.user?.email) {
          const targetUser = await userCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!targetUser) {
            return res.status(404).send({
              message: "User not found.",
            });
          }

          if (targetUser.email === req.user.email) {
            return res.status(403).send({
              message: "You cannot change your own role.",
            });
          }
        }

        const result = await userCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: {
              role,
            },
          },
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({
            message: "User not found.",
          });
        }

        res.send({
          message: "User role updated successfully.",
        });
      } catch (error) {
        console.error("Failed to change user role:", error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
    //Edit user profile - PATCH Admin only
    app.patch("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        const { name, profilePhoto, role } = req.body;

        if (!ObjectId.isValid(id)) {
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

        const targetUser = await userCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!targetUser) {
          return res.status(404).send({
            message: "User not found.",
          });
        }

        // Prevent admin from changing their own role
        if (
          targetUser.email === req.user?.email &&
          role &&
          role !== targetUser.role
        ) {
          return res.status(403).send({
            message: "You cannot change your own role.",
          });
        }

        const updateData = {
          name: name.trim(),
          profilePhoto: profilePhoto?.trim() || "",
        };

        // Only update role if provided
        if (role) {
          updateData.role = role;
        }

        const result = await userCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: updateData,
          },
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({
            message: "User not found.",
          });
        }

        res.send({
          message: "User updated successfully.",
        });
      } catch (error) {
        console.error("Failed to update user:", error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
    //Delete user - DELETE Admin only
    app.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            message: "Invalid user ID.",
          });
        }

        const targetUser = await userCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!targetUser) {
          return res.status(404).send({
            message: "User not found.",
          });
        }

        // Prevent admin from deleting themselves
        if (targetUser.email === req.user?.email) {
          return res.status(403).send({
            message: "You cannot delete your own account.",
          });
        }

        const result = await userCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({
            message: "User not found.",
          });
        }

        res.send({
          message: "User deleted successfully.",
        });
      } catch (error) {
        console.error("Failed to delete user:", error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });

    //////////////////////// PHOTO RELATED API ////////////////////////////////////////////
    //POST
    app.post("/photos", verifyToken, verifyAdmin, async (req, res) => {
      const photo = req.body;
      const result = await photoCollection.insertOne(photo);
      res.status(201).json(result);
    });
    //GET with pagination support: ?page=1&limit=5
    app.get("/photos", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const total = await photoCollection.countDocuments();

        const photos = await photoCollection
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        res.send({
          photos,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({
          message: "Failed to fetch photos",
        });
      }
    });
    // Put update photo
    app.put("/photos/:id", verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid photo id" });
      }

      const photoData = req.body;
      const updatePayload = {
        ...photoData,
        updatedAt: new Date(),
      };

      const result = await photoCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatePayload },
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Photo not found" });
      }

      res.send(result);
    });
    // DELETE photo
    app.delete("/photos/:id", verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid photo id" });
      }

      const result = await photoCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Photo not found" });
      }

      res.send(result);
    });
    ////////////////////////  PACKAGE RELATED API ////////////////////////////////////////////
    //POST
    app.post("/packages", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const packageData = req.body;

        const newPackage = {
          ...packageData,
          price: Number(packageData.price),
          photoCount: Number(packageData.photoCount),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await packagesCollection.insertOne(newPackage);

        res.status(201).send(result);
      } catch (error) {
        console.error("Failed to create package:", error);

        res.status(500).send({
          message: "Failed to create package",
        });
      }
    });
    //GET
    app.get("/packages", async (req, res) => {
      try {
        const packages = await packagesCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();

        res.send(packages);
      } catch (error) {
        console.error("Failed to fetch packages:", error);

        res.status(500).send({
          message: "Failed to fetch packages",
        });
      }
    });
    // GET package by ID/ Details
    app.get("/packages/:id", async (req, res) => {
      try {
        const packageId = req.params.id;
        const query = { _id: new ObjectId(packageId) };
        const result = await packagesCollection.findOne(query);

        if (!result) {
          return res.status(404).send({
            message: "Package not found",
          });
        }
        res.send(result);
      } catch (error) {
        console.error("Failed to fetch package:", error);

        res.status(500).send({
          message: "Failed to fetch package",
        });
      }
    });

    // PUT update packages
    app.put("/packages/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        // Check valid MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            message: "Invalid package ID",
          });
        }

        const packageData = req.body;

        const updatePackage = {
          name: packageData.name?.trim() || "",
          price: Number(packageData.price),
          duration: packageData.duration?.trim() || "",
          photoCount: Number(packageData.photoCount),
          description: packageData.description?.trim() || "",
          coverImage: packageData.coverImage?.trim() || "",
          features: Array.isArray(packageData.features)
            ? packageData.features
            : [],
          featured: Boolean(packageData.featured),
          active: Boolean(packageData.active),
          updatedAt: new Date(),
        };

        const result = await packagesCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: updatePackage,
          },
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({
            message: "Package not found",
          });
        }

        res.send({
          message: "Package updated successfully",
          result,
        });
      } catch (error) {
        console.error("Failed to update package:", error);

        res.status(500).send({
          message: "Failed to update package",
        });
      }
    });
    // DELETE package
    app.delete("/packages/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        // Check valid MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            message: "Invalid package ID",
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

        res.send({
          message: "Package deleted successfully",
          result,
        });
      } catch (error) {
        console.error("Failed to delete package:", error);

        res.status(500).send({
          message: "Failed to delete package",
        });
      }
    });
    ////////////////////////  BOOKING RELATED API ////////////////////////////////////////////
    app.post("/bookings", verifyToken, async (req, res) => {
      try {
        const bookingData = req.body;

        const newBooking = {
          ...bookingData,

          userId: req.user.userId,

          status: "pending",

          createdAt: new Date(),
        };

        const result = await bookingCollection.insertOne(newBooking);

        res.status(201).send(result);
      } catch (error) {
        console.error("Failed to create booking:", error);

        res.status(500).send({
          message: "Failed to create booking",
        });
      }
    });
    //GET bookings for the logged-in user
    app.get("/bookings", verifyToken, async (req, res) => {
      try {
        const userId = req.user.userId;
        const bookings = await bookingCollection.find({ userId }).toArray();
        res.send(bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        res.status(500).send({
          message: "Failed to fetch bookings",
        });
      }
    });
    //GET all bookings for admin
    app.get("/admin/bookings", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const bookings = await bookingCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        res.send(bookings);
      } catch (error) {
        console.error("Failed to fetch admin bookings:", error);

        res.status(500).send({
          message: "Failed to fetch admin bookings",
        });
      }
    });
    // Update booking status - Admin only
    // Confirm Booking
    app.patch(
      "/admin/bookings/:id/confirm",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;

          if (!ObjectId.isValid(id)) {
            return res.status(400).send({
              success: false,
              message: "Invalid booking ID",
            });
          }

          const result = await bookingCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "confirmed",
                updatedAt: new Date(),
              },
            },
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({
              success: false,
              message: "Booking not found",
            });
          }

          res.send({
            success: true,
            message: "Booking confirmed successfully",
          });
        } catch (error) {
          console.error("Failed to confirm booking:", error);

          res.status(500).send({
            success: false,
            message: "Failed to confirm booking",
          });
        }
      },
    );
    // CANCEL BOOKING
    app.patch(
      "/admin/bookings/:id/cancel",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;

          if (!ObjectId.isValid(id)) {
            return res.status(400).send({
              success: false,
              message: "Invalid booking ID",
            });
          }

          const result = await bookingCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "cancelled",
                updatedAt: new Date(),
              },
            },
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({
              success: false,
              message: "Booking not found",
            });
          }

          res.send({
            success: true,
            message: "Booking cancelled successfully",
          });
        } catch (error) {
          console.error("Failed to cancel booking:", error);

          res.status(500).send({
            success: false,
            message: "Failed to cancel booking",
          });
        }
      },
    );
    //Delete booking - Admin only
    app.delete(
      "/admin/bookings/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const { id } = req.params;

        const result = await bookingCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({
            message: "Booking not found",
          });
        }

        res.send({
          message: "Booking deleted successfully",
        });
      },
    );
    //
    //////////////////////////  REVIEW RELATED API ////////////////////////////////////////////
    //POST review
    app.post("/reviews", verifyToken, async (req, res) => {
      try {
        const { packageId, packageName, rating, comment } = req.body;

        // Logged-in user
        const userId = req.user.userId;

        // User collection to get user details
        const user = await userCollection.findOne({
          _id: new ObjectId(userId),
        });

        if (!user) {
          return res.status(404).send({
            message: "User not found",
          });
        }

        const newReview = {
          packageId,
          packageName,

          userId,
          userName: user.name,
          userPhoto: user.profilePhoto || user.photo || "",

          rating: Number(rating),
          comment,

          createdAt: new Date(),
          status: "pending",
        };

        const result = await reviewCollection.insertOne(newReview);

        res.status(201).send({
          success: true,
          message: "Review submitted successfully",
          review: {
            _id: result.insertedId,
            ...newReview,
          },
        });
      } catch (error) {
        console.error("Failed to create review:", error);

        res.status(500).send({
          message: "Failed to create review",
        });
      }
    });
    // GET reviews for a specific package
    app.get("/reviews/package/:packageId", async (req, res) => {
      try {
        const { packageId } = req.params;

        const reviews = await reviewCollection
          .find({
            packageId,
            status: "approved",
          })
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).send(reviews);
      } catch (error) {
        console.error("Failed to fetch package reviews:", error);

        res.status(500).send({
          message: "Failed to fetch package reviews",
        });
      }
    });
    // GET all reviews - Admin only
    app.get("/admin/reviews", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const reviews = await reviewCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).send(reviews);
      } catch (error) {
        console.error("Failed to fetch admin reviews:", error);

        res.status(500).send({
          message: "Failed to fetch reviews",
        });
      }
    });
    //Apporeve review - Admin only
    app.patch(
      "/admin/reviews/:id/approve",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;

          const result = await reviewCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "approved",
                approvedAt: new Date(),
              },
            },
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({
              message: "Review not found",
            });
          }

          res.status(200).send({
            message: "Review approved successfully",
          });
        } catch (error) {
          console.error("Failed to approve review:", error);

          res.status(500).send({
            message: "Failed to approve review",
          });
        }
      },
    );
    //Reject review - Admin only
    app.patch(
      "/admin/reviews/:id/reject",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;

          const result = await reviewCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "rejected",
                rejectedAt: new Date(),
              },
            },
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({
              message: "Review not found",
            });
          }

          res.status(200).send({
            message: "Review rejected successfully",
          });
        } catch (error) {
          console.error("Failed to reject review:", error);

          res.status(500).send({
            message: "Failed to reject review",
          });
        }
      },
    );
    //Delete Review - Admin only
    app.delete(
      "/admin/reviews/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;
          const result = await reviewCollection.deleteOne({
            _id: new ObjectId(id),
          });

          if (result.deletedCount === 0) {
            return res.status(404).send({
              message: "Review not found",
            });
          }

          res.status(200).send({
            message: "Review deleted successfully",
          });
        } catch (error) {
          console.error("Failed to delete review:", error);

          res.status(500).send({
            message: "Failed to delete review",
          });
        }
      },
    );
    //My Reviews - GET reviews for the logged-in user
    app.get("/reviews/my", verifyToken, async (req, res) => {
      try {
        const reviews = await reviewCollection
          .find({
            userId: req.user.userId,
          })
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).send(reviews);
      } catch (error) {
        console.error("Failed to fetch my reviews:", error);

        res.status(500).send({
          message: "Failed to fetch your reviews",
        });
      }
    });
    //Update my review - PATCH
    app.patch("/reviews/:id", verifyToken, async (req, res) => {
      try {
        const reviewId = req.params.id;
        const { rating, comment } = req.body;

        const review = await reviewCollection.findOne({
          _id: new ObjectId(reviewId),
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
            comment: comment.trim(),

            // Edited review আবার admin approval-এর জন্য Pending
            status: "pending",

            updatedAt: new Date(),
          },
        };

        const result = await reviewCollection.updateOne(
          {
            _id: new ObjectId(reviewId),
            userId: req.user.userId,
          },
          updateDoc,
        );

        if (result.modifiedCount === 0) {
          return res.status(400).send({
            message: "Review was not updated",
          });
        }

        res.status(200).send({
          message: "Review updated successfully",
        });
      } catch (error) {
        console.error("Failed to update review:", error);

        res.status(500).send({
          message: "Failed to update review",
        });
      }
    });
    //DELETE my review - DELETE
    app.delete("/reviews/:id", verifyToken, async (req, res) => {
      try {
        const reviewId = req.params.id;

        const result = await reviewCollection.deleteOne({
          _id: new ObjectId(reviewId),
          userId: req.user.userId,
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({
            message: "Review not found or you are not authorized to delete it",
          });
        }

        res.status(200).send({
          message: "Review deleted successfully",
        });
      } catch (error) {
        console.error("Failed to delete review:", error);

        res.status(500).send({
          message: "Failed to delete review",
        });
      }
    });

    //////////////FULL AUTHENTICATION EMAIL, PASSWORD AND GOOGLE CLOUD LOGIN REGISTRATION//////////////////////////
    //POST Register
    app.post("/register", async (req, res) => {
      try {
        const { name, email, password, profilePhoto } = req.body;

        // Check required fields
        if (!name || !email || !password) {
          return res.status(400).send({
            message: "All fields are required",
          });
        }

        // Check existing user
        const existingUser = await userCollection.findOne({ email });

        if (existingUser) {
          return res.status(409).send({
            message: "Email already exists",
          });
        }

        // Hash password
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

        res.status(201).send({
          message: "Registration successful",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.log(error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });

    //POST Login
    // LOGIN API
    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
          return res.status(400).send({
            message: "Email and password are required",
          });
        }

        // Find user by email
        const user = await userCollection.findOne({ email });

        if (!user) {
          return res.status(401).send({
            message: "Invalid email or password",
          });
        }

        // Compare password with hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          return res.status(401).send({
            message: "Invalid email or password",
          });
        }

        // Create JWT token
        const token = jwt.sign(
          {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        // Store JWT in HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // localhost development
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send user information to frontend
        res.status(200).send({
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
        console.log(error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
    // GET CURRENT USER
    app.get("/me", verifyToken, async (req, res) => {
      try {
        const user = await userCollection.findOne(
          { _id: new ObjectId(req.user.userId) },
          {
            projection: {
              password: 0,
            },
          },
        );

        if (!user) {
          return res.status(404).send({
            message: "User not found",
          });
        }

        res.send({
          user,
        });
      } catch (error) {
        console.log(error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
    // Logout API
    app.post("/logout", (req, res) => {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.send({
        message: "Logout successful",
      });
    });
    ////
    // ================= GOOGLE AUTH =================
    app.get(
      "/auth/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      }),
    );
    app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        session: false,
        failureRedirect: "http://localhost:5173/login",
      }),
      async (req, res) => {
        try {
          const token = jwt.sign(
            {
              userId: req.user._id.toString(),
              email: req.user.email,
              role: req.user.role,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            },
          );

          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          res.redirect("http://localhost:5173/");
        } catch (error) {
          console.error("Google callback error:", error);

          res.redirect("http://localhost:5173/login");
        }
      },
    );

    //////////////////////////////////////////////////////////////////////////////////////////////

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
