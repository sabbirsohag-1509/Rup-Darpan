import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import env from "./env.js";

const uri = `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@mycluster.eyaxb6h.mongodb.net/?retryWrites=true&w=majority&appName=myCluster`;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const db = client.db("rup-darpon");

// Collections
export const photoCollection = db.collection("photos");
export const userCollection = db.collection("users");
export const packagesCollection = db.collection("packages");
export const bookingCollection = db.collection("bookings");
export const reviewCollection = db.collection("reviews");
export const loginActivityCollection = db.collection("loginActivities");
export const videoCollection = db.collection("videos");
export const heroImagesCollection = db.collection("heroImages");
export const photoLikes = db.collection("photoLikes");
export const notificationsCollection = db.collection("notifications");

// Safety helpers for ObjectId handling
export const isValidObjectId = (id) => {
  if (!id) return false;
  return ObjectId.isValid(id) && String(new ObjectId(id)) === String(id);
};

export const toObjectId = (id) => {
  if (id instanceof ObjectId) return id;
  if (!isValidObjectId(id)) {
    throw new Error(`Invalid ObjectId format: ${id}`);
  }
  return new ObjectId(id);
};

// Initialize MongoDB indexes safely
export const initIndexes = async () => {
  try {
    await photoLikes.createIndex(
      { photoId: 1, visitorId: 1 },
      { unique: true },
    );
    await notificationsCollection.createIndex({
      recipientId: 1,
      createdAt: -1,
    });
    await notificationsCollection.createIndex({
      recipientId: 1,
      isRead: 1,
    });
    console.log("✅ MongoDB indexes initialized successfully.");
  } catch (error) {
    console.error("❌ MongoDB index initialization error:", error.message);
  }
};

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ Connected successfully to MongoDB server.");
    await initIndexes();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

export { ObjectId };
export default db;
