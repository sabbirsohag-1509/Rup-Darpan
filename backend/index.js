require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UAParser = require("ua-parser-js");
const nodemailer = require("nodemailer");
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
//Device Info after login activity
const getDeviceInfo = (req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown Browser";
  const os = result.os.name || "Unknown OS";

  let deviceType = "Desktop";

  if (result.device.type === "mobile") {
    deviceType = "Mobile";
  } else if (result.device.type === "tablet") {
    deviceType = "Tablet";
  }

  return {
    device: `${os} · ${browser}`,
    deviceType,
  };
};
//Forgot Password Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
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
    const loginActivityCollection = myDB.collection("loginActivities");
    const videoCollection = myDB.collection("videos");
    const heroImagesCollection = myDB.collection("heroImages");
    const photoLikes = myDB.collection("photoLikes");
    //likes indexes
    await photoLikes.createIndex(
      { photoId: 1, visitorId: 1 },
      { unique: true },
    );
    const notificationsCollection = myDB.collection("notifications");
    //Helper function to create a notification
    const createNotification = async ({
      recipientId,
      recipientRole,
      type,
      title,
      message,
      relatedId = null,
    }) => {
      try {
        const notificationData = {
          recipientId: recipientId.toString(),
          recipientRole,
          type,
          title,
          message,
          relatedId: relatedId ? relatedId.toString() : null,
          isRead: false,
          createdAt: new Date(),
        };

        const result =
          await notificationsCollection.insertOne(notificationData);

        return {
          _id: result.insertedId,
          ...notificationData,
        };
      } catch (error) {
        console.error("Create notification error:", error);
        throw error;
      }
    };
    // Notification indexes
    await notificationsCollection.createIndex({
      recipientId: 1,
      createdAt: -1,
    });

    await notificationsCollection.createIndex({
      recipientId: 1,
      isRead: 1,
    });

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
    // Function to check if a URL is a valid Facebook video URL
    const isFacebookUrl = (url) => {
      try {
        const parsedUrl = new URL(url);

        const allowedHosts = [
          "facebook.com",
          "www.facebook.com",
          "m.facebook.com",
          "web.facebook.com",
        ];

        const hostname = parsedUrl.hostname.toLowerCase();

        if (!allowedHosts.includes(hostname)) {
          return false;
        }

        // Only allow Facebook video/reel/share video URLs
        const pathname = parsedUrl.pathname.toLowerCase();

        return (
          pathname.startsWith("/reel/") ||
          pathname.startsWith("/share/v/") ||
          pathname.startsWith("/watch") ||
          pathname.startsWith("/videos/")
        );
      } catch {
        return false;
      }
    };
    // =========================================================
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

    //My Profile - GET
    app.get("/users/me", verifyToken, async (req, res) => {
      try {
        const user = await userCollection.findOne(
          { email: req.user.email },
          {
            projection: {
              password: 0,
            },
          },
        );

        if (!user) {
          return res.status(404).send({
            message: "User not found.",
          });
        }

        res.send(user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);

        res.status(500).send({
          message: "Failed to fetch profile.",
        });
      }
    });
    //Update my profile - PATCH

    // Update my profile
    app.patch("/users/me", verifyToken, async (req, res) => {
      try {
        const { name, phone, address, bio, profilePhoto } = req.body;

        // Check authenticated user
        if (!req.user?.email) {
          return res.status(401).send({
            message: "User email not found in token.",
          });
        }

        // Name validation
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
          {
            email: req.user.email,
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

        // Get updated user
        const updatedUser = await userCollection.findOne(
          {
            email: req.user.email,
          },
          {
            projection: {
              password: 0,
            },
          },
        );

        res.send({
          message: "Profile updated successfully.",
          user: updatedUser,
        });
      } catch (error) {
        console.error("Failed to update profile:", error);

        res.status(500).send({
          message: "Failed to update profile.",
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
    //GET photo for Admin management with pagination support: ?page=1&limit=5
    app.get("/photos", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;

        const total = await photoCollection.countDocuments();

        const featuredCount = await photoCollection.countDocuments({
          featured: true,
        });

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
          featuredCount,
        });
      } catch (error) {
        console.error("Get photos error:", error);

        res.status(500).send({
          message: "Failed to fetch photos",
        });
      }
    });
    //GET for Featured Photo
    app.get("/featured-photos", async (req, res) => {
      try {
        const featuredPhotos = await photoCollection
          .find({ featured: true })
          .sort({ createdAt: -1 })
          .limit(8)
          .toArray();

        res.send(featuredPhotos);
      } catch (error) {
        console.error("Featured photos error:", error);

        res.status(500).send({
          message: "Failed to fetch featured photos",
        });
      }
    });
    //GET for All Photos for Gallery
    app.get("/all-photos", async (req, res) => {
      try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(
          Math.max(parseInt(req.query.limit) || 12, 1),
          50,
        );

        const skip = (page - 1) * limit;

        const total = await photoCollection.countDocuments();

        const photos = await photoCollection
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        res.status(200).send({
          photos,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        });
      } catch (error) {
        console.error("Get photos error:", error);

        res.status(500).send({
          message: "Failed to fetch photos",
        });
      }
    });
    // Put update photo
    app.put("/photos/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            message: "Invalid photo id",
          });
        }

        const photoId = new ObjectId(id);
        const photoData = req.body;

        const currentPhoto = await photoCollection.findOne({
          _id: photoId,
        });

        if (!currentPhoto) {
          return res.status(404).send({
            message: "Photo not found",
          });
        }

        // ============================================
        // FEATURED LIMIT CHECK
        // ============================================

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

        // ============================================
        // UPDATE
        // ============================================

        const updatePayload = {
          ...photoData,
          updatedAt: new Date(),
        };

        const result = await photoCollection.updateOne(
          {
            _id: photoId,
          },
          {
            $set: updatePayload,
          },
        );

        res.send({
          success: true,
          message: "Photo updated successfully.",
          result,
        });
      } catch (error) {
        console.error("Update photo error:", error);

        res.status(500).send({
          message: "Failed to update photo.",
        });
      }
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
    ////////////////////////   VIDEO RELATED API ///////////////////////////////////////
    // POST - Add Video
    app.post("/videos", verifyToken, verifyAdmin, async (req, res) => {
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

        // =========================================================
        // VALIDATION
        // =========================================================

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

        // =========================================================
        // CLEAN VALUES
        // =========================================================

        const cleanTitle = title.trim();
        const cleanVideoUrl = videoUrl.trim();
        const cleanThumbnailUrl = thumbnailUrl.trim();
        const cleanCategory = category?.trim() || "";
        const cleanDescription = description?.trim() || "";

        // =========================================================
        // FACEBOOK URL VALIDATION
        // =========================================================

        if (!isFacebookUrl(cleanVideoUrl)) {
          return res.status(400).send({
            success: false,
            message: "Only Facebook video URLs are allowed.",
          });
        }

        // =========================================================
        // THUMBNAIL URL VALIDATION
        // =========================================================

        try {
          const thumbnail = new URL(cleanThumbnailUrl);

          if (!["http:", "https:"].includes(thumbnail.protocol)) {
            return res.status(400).send({
              success: false,
              message: "Invalid thumbnail URL.",
            });
          }
        } catch {
          return res.status(400).send({
            success: false,
            message: "Invalid thumbnail URL.",
          });
        }

        // =========================================================
        // FEATURED LIMIT
        // =========================================================

        const wantsFeatured = Boolean(featured);

        if (wantsFeatured) {
          const featuredCount = await videoCollection.countDocuments({
            featured: true,
          });

          if (featuredCount >= 8) {
            return res.status(400).send({
              success: false,
              message:
                "Maximum 8 featured videos are allowed. Please remove one featured video first.",
            });
          }
        }

        // =========================================================
        // CREATE VIDEO DOCUMENT
        // =========================================================

        const now = new Date();

        const videoData = {
          title: cleanTitle,

          // Facebook URL exactly as admin provided
          videoUrl: cleanVideoUrl,

          // Cloudinary thumbnail URL
          thumbnailUrl: cleanThumbnailUrl,

          category: cleanCategory,

          description: cleanDescription,

          featured: wantsFeatured,

          isPublished: Boolean(isPublished),

          createdAt: now,

          updatedAt: now,
        };

        // =========================================================
        // INSERT
        // =========================================================

        const result = await videoCollection.insertOne(videoData);

        // =========================================================
        // RESPONSE
        // =========================================================

        return res.status(201).send({
          success: true,
          message: "Video added successfully.",

          insertedId: result.insertedId,

          video: {
            _id: result.insertedId,
            ...videoData,
          },
        });
      } catch (error) {
        console.error("=================================");
        console.error("Add video error:", error);
        console.error("=================================");

        return res.status(500).send({
          success: false,
          message: error.message || "Failed to add video.",
        });
      }
    });
    //GET admin videos for management with pagination support: ?page=1&limit=5
    app.get("/videos", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;

        const totalVideos = await videoCollection.countDocuments();

        // ⭐ ALL pages-এর featured count
        const featuredCount = await videoCollection.countDocuments({
          featured: true,
        });

        const videos = await videoCollection
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        const totalPages = Math.ceil(totalVideos / limit);

        res.send({
          success: true,
          videos,
          totalVideos,
          totalPages,
          currentPage: page,
          featuredCount,
        });
      } catch (error) {
        console.error("Get videos error:", error);

        res.status(500).send({
          message: "Failed to fetch videos.",
        });
      }
    });
    //GET for Featured Videos
    app.get("/featured-videos", async (req, res) => {
      try {
        const videos = await videoCollection
          .find({
            featured: true,
            isPublished: true,
          })
          .sort({ createdAt: -1 })
          .limit(8)
          .toArray();

        res.send({
          success: true,
          videos,
        });
      } catch (error) {
        console.error("Get featured videos error:", error);

        res.status(500).send({
          message: "Failed to fetch featured videos.",
        });
      }
    });
    //GET all video for Gallery
    app.get("/all-videos", async (req, res) => {
      try {
        const videos = await videoCollection
          .find({
            isPublished: true,
          })
          .sort({ createdAt: -1 })
          .toArray();

        res.send({
          success: true,
          videos,
        });
      } catch (error) {
        console.error("Get public videos error:", error);

        res.status(500).send({
          message: "Failed to fetch public videos.",
        });
      }
    });
    //PUT admin
    app.put("/videos/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        // =======================================================
        // ID VALIDATION
        // =======================================================

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            success: false,
            message: "Invalid video id.",
          });
        }

        const videoId = new ObjectId(id);

        // =======================================================
        // FIND CURRENT VIDEO
        // =======================================================

        const currentVideo = await videoCollection.findOne({
          _id: videoId,
        });

        if (!currentVideo) {
          return res.status(404).send({
            success: false,
            message: "Video not found.",
          });
        }

        // =======================================================
        // REQUEST DATA
        // =======================================================

        const {
          title,
          videoUrl,
          category,
          description,
          featured,
          isPublished,
        } = req.body;

        // =======================================================
        // BASIC VALIDATION
        // =======================================================

        if (typeof title !== "string" || !title.trim()) {
          return res.status(400).send({
            success: false,
            message: "Video title is required.",
          });
        }

        if (typeof videoUrl !== "string" || !videoUrl.trim()) {
          return res.status(400).send({
            success: false,
            message: "Facebook video URL is required.",
          });
        }

        // =======================================================
        // FACEBOOK URL VALIDATION
        // =======================================================

        if (!isFacebookUrl(videoUrl.trim())) {
          return res.status(400).send({
            success: false,
            message: "Only Facebook video URLs are allowed.",
          });
        }

        // =======================================================
        // FEATURED VALUE
        // =======================================================

        const wantsFeatured = Boolean(featured);

        const isCurrentlyFeatured = Boolean(currentVideo.featured);

        const tryingToAddFeatured = wantsFeatured && !isCurrentlyFeatured;

        // =======================================================
        // MAX 8 FEATURED VIDEOS
        // =======================================================

        if (tryingToAddFeatured) {
          const featuredCount = await videoCollection.countDocuments({
            featured: true,
          });

          if (featuredCount >= 8) {
            return res.status(400).send({
              success: false,
              message:
                "Maximum 8 featured videos are allowed. Please remove one featured video first.",
            });
          }
        }

        // =======================================================
        // UPDATE PAYLOAD
        // =======================================================

        const updatePayload = {
          title: title.trim(),

          // Save Facebook URL directly
          videoUrl: videoUrl.trim(),

          category: typeof category === "string" ? category.trim() : "",

          description:
            typeof description === "string" ? description.trim() : "",

          featured: wantsFeatured,

          isPublished: Boolean(isPublished),

          updatedAt: new Date(),
        };

        // =======================================================
        // UPDATE DATABASE
        // =======================================================

        const result = await videoCollection.updateOne(
          {
            _id: videoId,
          },
          {
            $set: updatePayload,
          },
        );

        // =======================================================
        // RESPONSE
        // =======================================================

        return res.send({
          success: true,
          message: "Video updated successfully.",

          result,

          video: {
            _id: videoId,
            ...updatePayload,
          },
        });
      } catch (error) {
        // =======================================================
        // ERROR
        // =======================================================

        console.error("=================================");
        console.error("UPDATE VIDEO ERROR");
        console.error(error);
        console.error("=================================");

        return res.status(500).send({
          success: false,
          message: "Failed to update video.",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }
    });
    //PATCH admin - Toggle Featured
    app.patch(
      "/videos/:id/featured",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;
          const { featured } = req.body;

          // ID validation
          if (!ObjectId.isValid(id)) {
            return res.status(400).send({
              message: "Invalid video id.",
            });
          }

          // Featured value validation
          if (typeof featured !== "boolean") {
            return res.status(400).send({
              message: "Featured value must be true or false.",
            });
          }

          const videoId = new ObjectId(id);

          // Find video
          const video = await videoCollection.findOne({
            _id: videoId,
          });

          if (!video) {
            return res.status(404).send({
              message: "Video not found.",
            });
          }

          // Adding to featured
          if (featured === true && !video.featured) {
            const featuredCount = await videoCollection.countDocuments({
              featured: true,
            });

            if (featuredCount >= 8) {
              return res.status(400).send({
                message:
                  "Maximum 8 featured videos are allowed. Please remove one featured video first.",
              });
            }
          }

          // Update featured status only
          await videoCollection.updateOne(
            {
              _id: videoId,
            },
            {
              $set: {
                featured,
                updatedAt: new Date(),
              },
            },
          );

          res.send({
            success: true,
            message: featured
              ? "Added to Featured Videos."
              : "Removed from Featured Videos.",
          });
        } catch (error) {
          console.error("Featured toggle error:", error);

          res.status(500).send({
            message: "Failed to update featured status.",
          });
        }
      },
    );
    //DELETE admin
    app.delete("/videos/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            message: "Invalid video id",
          });
        }

        const videoId = new ObjectId(id);

        const video = await videoCollection.findOne({
          _id: videoId,
        });

        if (!video) {
          return res.status(404).send({
            message: "Video not found",
          });
        }

        const result = await videoCollection.deleteOne({
          _id: videoId,
        });

        res.send({
          success: true,
          message: "Video deleted successfully.",
          result,
        });
      } catch (error) {
        console.error("Delete video error:", error);

        res.status(500).send({
          message: "Failed to delete video.",
        });
      }
    });
    ////////////////////////   HERO IMAGE RELATED API ///////////////////////////////////////
    // POST
    app.post("/hero-images", async (req, res) => {
      try {
        const { title, image, publicId, altText, displayOrder, isActive } =
          req.body;

        // Required validation
        if (!image) {
          return res.status(400).send({
            message: "Hero image is required.",
          });
        }

        // Maximum 8 hero images
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
        res.status(201).send({
          success: true,
          message: "Hero image added successfully.",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Add hero image error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to add hero image.",
        });
      }
    });
    //GET
    app.get("/hero-images", async (req, res) => {
      try {
        const heroImages = await heroImagesCollection
          .find({})
          .sort({ displayOrder: 1, createdAt: -1 })
          .toArray();

        res.status(200).send({
          success: true,
          message: "Hero images fetched successfully.",
          data: heroImages,
        });
      } catch (error) {
        console.error("Get hero images error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to fetch hero images.",
        });
      }
    });
    //PUT
    app.put("/hero-images/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const { title, image, publicId, altText, displayOrder, isActive } =
          req.body;

        if (!image) {
          return res.status(400).send({
            success: false,
            message: "Hero image is required.",
          });
        }

        const updateData = {
          title: title?.trim() || "",
          image: image.trim(),
          publicId: publicId?.trim() || "",
          altText: altText?.trim() || title?.trim() || "Rup Darpon Hero Image",
          displayOrder: Number(displayOrder) || 1,
          isActive: isActive !== false,
          updatedAt: new Date(),
        };

        const result = await heroImagesCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: updateData,
          },
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "Hero image not found.",
          });
        }

        res.status(200).send({
          success: true,
          message: "Hero image updated successfully.",
        });
      } catch (error) {
        console.error("Update hero image error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to update hero image.",
        });
      }
    });
    //DELETE
    app.delete("/hero-images/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const result = await heroImagesCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "Hero image not found.",
          });
        }

        res.status(200).send({
          success: true,
          message: "Hero image deleted successfully.",
        });
      } catch (error) {
        console.error("Delete hero image error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to delete hero image.",
        });
      }
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

        // Get logged-in user
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

          createdAt: new Date(),
        };

        const result = await bookingCollection.insertOne(newBooking);

        // ============================================
        // CREATE ADMIN NOTIFICATIONS
        // ============================================

        const admins = await userCollection
          .find({
            role: "admin",
          })
          .project({
            _id: 1,
            name: 1,
          })
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

        // ============================================
        // CREATE USER NOTIFICATION
        // ============================================

        await createNotification({
          recipientId: new ObjectId(req.user.userId),
          recipientRole: "user",
          type: "booking",
          title: "Booking Submitted",
          message:
            "Your booking request has been submitted successfully and is waiting for confirmation.",
          relatedId: result.insertedId,
        });

        // ============================================
        // RESPONSE
        // ============================================

        res.status(201).send({
          success: true,
          message: "Booking created successfully.",
          insertedId: result.insertedId,
        });
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

          // ============================================
          // FIND BOOKING
          // ============================================

          const booking = await bookingCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!booking) {
            return res.status(404).send({
              success: false,
              message: "Booking not found",
            });
          }

          // ============================================
          // UPDATE BOOKING STATUS
          // ============================================

          const result = await bookingCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "confirmed",
                updatedAt: new Date(),
              },
            },
          );

          // ============================================
          // CREATE USER NOTIFICATION
          // ============================================

          await createNotification({
            recipientId: new ObjectId(booking.userId),
            recipientRole: "user",
            type: "booking",
            title: "Booking Confirmed",
            message: "Your booking has been confirmed successfully.",
            relatedId: new ObjectId(id),
          });

          // ============================================
          // RESPONSE
          // ============================================

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

          // ============================================
          // FIND BOOKING
          // ============================================

          const booking = await bookingCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!booking) {
            return res.status(404).send({
              success: false,
              message: "Booking not found",
            });
          }

          // ============================================
          // UPDATE BOOKING STATUS
          // ============================================

          const result = await bookingCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "cancelled",
                updatedAt: new Date(),
              },
            },
          );

          // ============================================
          // CREATE USER NOTIFICATION
          // ============================================

          await createNotification({
            recipientId: new ObjectId(booking.userId),
            recipientRole: "user",
            type: "booking",
            title: "Booking Cancelled",
            message: "Your booking has been cancelled by the administrator.",
            relatedId: new ObjectId(id),
          });

          // ============================================
          // RESPONSE
          // ============================================

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

        const userId = req.user.userId;

        // ============================================
        // GET USER
        // ============================================

        const user = await userCollection.findOne({
          _id: new ObjectId(userId),
        });

        if (!user) {
          return res.status(404).send({
            message: "User not found",
          });
        }

        // ============================================
        // CREATE REVIEW
        // ============================================

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

        // ============================================
        // INSERT REVIEW
        // ============================================

        const result = await reviewCollection.insertOne(newReview);

        // ============================================
        // CREATE ADMIN NOTIFICATIONS
        // ============================================

        const admins = await userCollection
          .find({
            role: "admin",
          })
          .project({
            _id: 1,
            name: 1,
          })
          .toArray();

        await Promise.all(
          admins.map((admin) =>
            createNotification({
              recipientId: admin._id,
              recipientRole: "admin",
              type: "review",
              title: "New Review Submitted",
              message: `${user.name} submitted a review for ${
                packageName || "a package"
              }.`,
              relatedId: result.insertedId,
            }),
          ),
        );

        // ============================================
        // CREATE USER NOTIFICATION
        // ============================================

        await createNotification({
          recipientId: new ObjectId(userId),
          recipientRole: "user",
          type: "review",
          title: "Review Submitted",
          message: `Your review for ${
            packageName || "the package"
          } has been submitted successfully and is waiting for approval.`,
          relatedId: result.insertedId,
        });

        // ============================================
        // RESPONSE
        // ============================================

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
    // Approve review - Admin only
    app.patch(
      "/admin/reviews/:id/approve",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;

          if (!ObjectId.isValid(id)) {
            return res.status(400).send({
              success: false,
              message: "Invalid review ID",
            });
          }

          // Get review first
          const review = await reviewCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!review) {
            return res.status(404).send({
              success: false,
              message: "Review not found",
            });
          }

          // Approve review
          const result = await reviewCollection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "approved",
                approvedAt: new Date(),
              },
            },
          );

          if (result.modifiedCount === 0) {
            return res.status(400).send({
              success: false,
              message: "Review was not approved",
            });
          }

          // ============================================
          // CREATE USER NOTIFICATION
          // ============================================

          await createNotification({
            recipientId: new ObjectId(review.userId),
            recipientRole: "user",
            type: "review",
            title: "Review Published",
            message: `Your review for ${
              review.packageName || "the package"
            } has been approved and published.`,
            relatedId: review._id,
          });

          res.status(200).send({
            success: true,
            message: "Review approved successfully",
          });
        } catch (error) {
          console.error("Failed to approve review:", error);

          res.status(500).send({
            success: false,
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

          if (!ObjectId.isValid(id)) {
            return res.status(400).send({
              success: false,
              message: "Invalid review ID",
            });
          }

          // Get review first
          const review = await reviewCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!review) {
            return res.status(404).send({
              success: false,
              message: "Review not found",
            });
          }

          // Reject review
          const result = await reviewCollection.updateOne(
            {
              _id: new ObjectId(id),
            },
            {
              $set: {
                status: "rejected",
                rejectedAt: new Date(),
              },
            },
          );

          if (result.matchedCount === 0) {
            return res.status(404).send({
              success: false,
              message: "Review not found",
            });
          }

          // ============================================
          // CREATE USER NOTIFICATION
          // ============================================

          await createNotification({
            recipientId: new ObjectId(review.userId),
            recipientRole: "user",
            type: "review",
            title: "Review Rejected",
            message: `Your review for ${
              review.packageName || "the package"
            } has been rejected.`,
            relatedId: review._id,
          });

          res.status(200).send({
            success: true,
            message: "Review rejected successfully",
          });
        } catch (error) {
          console.error("Failed to reject review:", error);

          res.status(500).send({
            success: false,
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

          if (!ObjectId.isValid(id)) {
            return res.status(400).send({
              success: false,
              message: "Invalid review ID",
            });
          }

          // Get review first
          const review = await reviewCollection.findOne({
            _id: new ObjectId(id),
          });

          if (!review) {
            return res.status(404).send({
              success: false,
              message: "Review not found",
            });
          }

          // Delete review
          const result = await reviewCollection.deleteOne({
            _id: new ObjectId(id),
          });

          if (result.deletedCount === 0) {
            return res.status(404).send({
              success: false,
              message: "Review not found",
            });
          }

          // ============================================
          // CREATE USER NOTIFICATION
          // ============================================

          await createNotification({
            recipientId: new ObjectId(review.userId),
            recipientRole: "user",
            type: "review",
            title: "Review Deleted",
            message: `Your review for ${
              review.packageName || "the package"
            } has been deleted by the administrator.`,
            relatedId: review._id,
          });

          res.status(200).send({
            success: true,
            message: "Review deleted successfully",
          });
        } catch (error) {
          console.error("Failed to delete review:", error);

          res.status(500).send({
            success: false,
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

            // Edited review
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

    // =================== LIKES RELATED API =====================
    //POST
    app.post("/photos/:id/like", async (req, res) => {
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

        // Already liked → Unlike
        if (existingLike) {
          await photoLikes.deleteOne({
            _id: existingLike._id,
          });

          const likes = await photoLikes.countDocuments({
            photoId: id,
          });

          return res.send({
            liked: false,
            likes,
          });
        }

        // New like
        await photoLikes.insertOne({
          photoId: id,
          visitorId,
          createdAt: new Date(),
        });

        const likes = await photoLikes.countDocuments({
          photoId: id,
        });

        res.send({
          liked: true,
          likes,
        });
      } catch (error) {
        console.error("Photo like error:", error);

        res.status(500).send({
          message: "Failed to like photo",
        });
      }
    });
    //GET
    app.get("/photos/:id/like/:visitorId", async (req, res) => {
      try {
        const { id, visitorId } = req.params;

        if (!visitorId) {
          return res.status(400).send({
            message: "visitorId is required",
          });
        }

        const existingLike = await photoLikes.findOne({
          photoId: id,
          visitorId,
        });

        const likes = await photoLikes.countDocuments({
          photoId: id,
        });

        res.send({
          liked: !!existingLike,
          likes,
        });
      } catch (error) {
        console.error("Get photo like status error:", error);

        res.status(500).send({
          message: "Failed to get photo like status",
        });
      }
    });
    //////////////////////// NOTIFICATION IMAGE RELATED API /////////////////////////////////
    //POST
    app.post("/notifications", verifyToken, async (req, res) => {
      try {
        const { recipientId, recipientRole, type, title, message, relatedId } =
          req.body;

        // VALIDATION

        if (!recipientId) {
          return res.status(400).send({
            success: false,
            message: "Recipient ID is required.",
          });
        }

        if (!title?.trim()) {
          return res.status(400).send({
            success: false,
            message: "Notification title is required.",
          });
        }

        if (!message?.trim()) {
          return res.status(400).send({
            success: false,
            message: "Notification message is required.",
          });
        }
        // CREATE NOTIFICATION
        const newNotification = {
          recipientId: recipientId.toString(),

          recipientRole: recipientRole === "admin" ? "admin" : "user",

          type: type?.trim() || "general",

          title: title.trim(),

          message: message.trim(),

          relatedId: relatedId?.toString() || null,

          isRead: false,

          createdAt: new Date(),
        };

        const result = await notificationsCollection.insertOne(newNotification);

        res.status(201).send({
          success: true,
          message: "Notification created successfully.",

          notification: {
            _id: result.insertedId,
            ...newNotification,
          },
        });
      } catch (error) {
        console.error("Create notification error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to create notification.",
        });
      }
    });
    //GET
    app.get("/notifications", verifyToken, async (req, res) => {
      try {
        const userId = req.user.userId;

        const notifications = await notificationsCollection
          .find({
            recipientId: userId,
          })
          .sort({
            createdAt: -1,
          })
          .limit(50)
          .toArray();

        res.status(200).send({
          success: true,
          notifications,
        });
      } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to fetch notifications.",
        });
      }
    });
    // GET UNREAD NOTIFICATION COUNT
    app.get("/notifications/unread-count", verifyToken, async (req, res) => {
      try {
        const userId = req.user.userId;

        const unreadCount = await notificationsCollection.countDocuments({
          recipientId: userId,
          isRead: false,
        });

        res.status(200).send({
          success: true,
          unreadCount,
        });
      } catch (error) {
        console.error("Get unread notification count error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to fetch unread notification count.",
        });
      }
    });
    // MARK SINGLE NOTIFICATION AS READ
    app.patch("/notifications/:id/read", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            success: false,
            message: "Invalid notification ID.",
          });
        }

        const result = await notificationsCollection.updateOne(
          {
            _id: new ObjectId(id),
            recipientId: req.user.userId,
          },
          {
            $set: {
              isRead: true,
              readAt: new Date(),
            },
          },
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "Notification not found or you are not authorized.",
          });
        }

        res.status(200).send({
          success: true,
          message: "Notification marked as read.",
        });
      } catch (error) {
        console.error("Mark notification as read error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to mark notification as read.",
        });
      }
    });
    // MARK ALL NOTIFICATIONS AS READ
    app.patch("/notifications/read-all", verifyToken, async (req, res) => {
      try {
        const userId = req.user.userId;

        const result = await notificationsCollection.updateMany(
          {
            recipientId: userId,
            isRead: false,
          },
          {
            $set: {
              isRead: true,
              readAt: new Date(),
            },
          },
        );

        res.status(200).send({
          success: true,
          message: "All notifications marked as read.",
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        console.error("Mark all notifications as read error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to mark all notifications as read.",
        });
      }
    });
    // DELETE NOTIFICATION
    app.delete("/notifications/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({
            success: false,
            message: "Invalid notification ID.",
          });
        }

        const result = await notificationsCollection.deleteOne({
          _id: new ObjectId(id),
          recipientId: req.user.userId,
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({
            success: false,
            message: "Notification not found or you are not authorized.",
          });
        }

        res.status(200).send({
          success: true,
          message: "Notification deleted successfully.",
        });
      } catch (error) {
        console.error("Delete notification error:", error);

        res.status(500).send({
          success: false,
          message: "Failed to delete notification.",
        });
      }
    });

    ////////////FULL AUTHENTICATION EMAIL, PASSWORD AND GOOGLE CLOUD LOGIN REGISTRATION//////////
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

        // Create user
        const result = await userCollection.insertOne(newUser);

        // ============================================
        // CREATE ADMIN NOTIFICATIONS
        // ============================================

        const admins = await userCollection
          .find({
            role: "admin",
          })
          .project({
            _id: 1,
            name: 1,
          })
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

        // Response
        res.status(201).send({
          success: true,
          message: "Registration successful",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("Registration error:", error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
    // LOGIN API
    app.post("/login", async (req, res) => {
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

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          return res.status(401).send({
            message: "Invalid email or password",
          });
        }

        // =========================
        // LOGIN DEVICE INFORMATION
        // =========================

        const userAgent = req.headers["user-agent"] || "Unknown";

        // Simple device detection
        let device = "Desktop";

        if (/mobile/i.test(userAgent)) {
          device = "Mobile";
        } else if (/tablet|ipad/i.test(userAgent)) {
          device = "Tablet";
        }

        // Browser detection
        let browser = "Unknown Browser";

        if (/edg/i.test(userAgent)) {
          browser = "Microsoft Edge";
        } else if (/chrome/i.test(userAgent)) {
          browser = "Google Chrome";
        } else if (/firefox/i.test(userAgent)) {
          browser = "Mozilla Firefox";
        } else if (/safari/i.test(userAgent)) {
          browser = "Safari";
        }

        // OS detection
        let os = "Unknown OS";

        if (/windows/i.test(userAgent)) {
          os = "Windows";
        } else if (/android/i.test(userAgent)) {
          os = "Android";
        } else if (/iphone|ipad|ios/i.test(userAgent)) {
          os = "iOS";
        } else if (/macintosh|mac os/i.test(userAgent)) {
          os = "macOS";
        } else if (/linux/i.test(userAgent)) {
          os = "Linux";
        }

        // Get IP address
        const ip =
          req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.socket.remoteAddress ||
          "Unknown IP";

        // =========================
        // SAVE LOGIN ACTIVITY
        // =========================

        await loginActivityCollection.insertOne({
          userId: user._id.toString(),
          email: user.email,

          loginMethod: "email",

          device,
          browser,
          os,
          ip,

          userAgent,

          loginAt: new Date(),
        });

        // =========================
        // CREATE JWT
        // =========================

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

        // =========================
        // COOKIE
        // =========================

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // =========================
        // RESPONSE
        // =========================

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
        console.error("Login error:", error);

        res.status(500).send({
          message: "Internal Server Error",
        });
      }
    });
    //Forgot Password API
    app.post("/users/forgot-password", async (req, res) => {
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
            message:
              "If an account exists with this email, a password reset link has been sent.",
          });
        }

        // Generate random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token before storing in DB
        const hashedToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");

        // Token expires in 15 minutes
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

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
          from: `"Rup Darpon Team" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Reset Your Password",
          html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Password Reset Request</h2>

          <p>Hello ${user.name || "there"},</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password for your account:
          </p>

          <a
            href="${resetLink}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#570df8;
              color:white;
              text-decoration:none;
              border-radius:8px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:20px;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you didn't request a password reset, you can safely ignore
            this email.
          </p>
        </div>
      `,
        });

        return res.status(200).send({
          message:
            "If an account exists with this email, a password reset link has been sent.",
        });
      } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).send({
          message: "Failed to process password reset request.",
        });
      }
    });
    // Reset Password API
    app.patch("/users/reset-password/:token", async (req, res) => {
      try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
          return res.status(400).send({
            message: "Token and new password are required.",
          });
        }

        if (newPassword.length < 8) {
          return res.status(400).send({
            message: "Password must be at least 8 characters.",
          });
        }

        const hashedToken = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");

        const user = await userCollection.findOne({
          resetPasswordToken: hashedToken,
          resetPasswordExpires: {
            $gt: new Date(),
          },
        });

        if (!user) {
          return res.status(400).send({
            message: "Reset link is invalid or has expired.",
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
            $unset: {
              resetPasswordToken: "",
              resetPasswordExpires: "",
            },
          },
        );

        return res.status(200).send({
          message: "Password reset successfully.",
        });
      } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).send({
          message: "Failed to reset password.",
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
          // Get device information
          const deviceInfo = getDeviceInfo(req);

          // Get IP address
          const ip =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress;

          // SAVE GOOGLE LOGIN ACTIVITY
          await loginActivityCollection.insertOne({
            userId: req.user._id.toString(),
            email: req.user.email,

            loginMethod: "google",

            loginAt: new Date(),

            device: deviceInfo.device,
            deviceType: deviceInfo.deviceType,

            ip,
          });

          // Create JWT
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

          // Store JWT in cookie
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          // Redirect to frontend
          res.redirect("http://localhost:5173/");
        } catch (error) {
          console.error("Google callback error:", error);

          res.redirect("http://localhost:5173/login");
        }
      },
    );
    // ================= CHANGE PASSWORD =================
    app.patch("/users/change-password", verifyToken, async (req, res) => {
      console.log("change password endpoint hit");
      try {
        console.log("REQ.USER:", req.user);
        console.log("USER ID:", req.user?.userId);
        console.log("USER ID TYPE:", typeof req.user?.userId);
        console.log("========== CHANGE PASSWORD ==========");
        console.log("REQ.USER:", req.user);
        console.log("BODY:", {
          currentPassword: req.body.currentPassword ? "provided" : "missing",
          newPassword: req.body.newPassword ? "provided" : "missing",
        });

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
          console.log("❌ Missing password");
          return res.status(400).send({
            message: "Current password and new password are required.",
          });
        }

        if (newPassword.length < 8) {
          console.log("❌ New password too short");
          return res.status(400).send({
            message: "New password must be at least 8 characters.",
          });
        }

        if (!req.user?.userId) {
          console.log("❌ userId missing from token");

          return res.status(401).send({
            message: "User authentication information is missing.",
          });
        }

        if (!ObjectId.isValid(req.user.userId)) {
          console.log("❌ Invalid ObjectId:", req.user.userId);

          return res.status(400).send({
            message: "Invalid user ID.",
          });
        }

        const user = await userCollection.findOne({
          _id: new ObjectId(req.user.userId),
        });

        console.log("FOUND USER:", user ? user._id : "NOT FOUND");

        if (!user) {
          return res.status(404).send({
            message: "User not found.",
          });
        }

        console.log("HAS PASSWORD:", !!user.password);

        if (!user.password) {
          return res.status(400).send({
            message: "Password change is not available for Google accounts.",
          });
        }

        const isCurrentPasswordCorrect = await bcrypt.compare(
          currentPassword,
          user.password,
        );

        console.log("CURRENT PASSWORD CORRECT:", isCurrentPasswordCorrect);

        if (!isCurrentPasswordCorrect) {
          return res.status(401).send({
            message: "Current password is incorrect.",
          });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userCollection.updateOne(
          {
            _id: user._id,
          },
          {
            $set: {
              password: hashedPassword,
              updatedAt: new Date(),
            },
          },
        );

        console.log("✅ PASSWORD CHANGED");

        return res.status(200).send({
          message: "Password changed successfully.",
        });
      } catch (error) {
        console.error("❌ Change password error:", error);

        return res.status(500).send({
          message: "Failed to change password.",
        });
      }
    });
    // ================== LOGIN ACTIVITY =================
    app.get("/users/login-activity", verifyToken, async (req, res) => {
      try {
        const activities = await loginActivityCollection
          .find({
            userId: req.user.userId,
          })
          .sort({ loginAt: -1 })
          .limit(20)
          .toArray();

        res.send(activities);
      } catch (error) {
        console.error("Failed to fetch login activity:", error);

        res.status(500).send({
          message: "Failed to fetch login activity.",
        });
      }
    });

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
