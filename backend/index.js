require("dotenv").config();
const express = require("express");
const app = express();
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
// VERIFY JWT TOKEN
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized access",
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
      message: "Admin access required",
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

    // Add photo related API
    //POST
    app.post("/photos", verifyAdmin, async (req, res) => {
      const photo = req.body;
      const result = await photoCollection.insertOne(photo);
      res.status(201).json(result);
    });

    //GET
    app.get("/photos", verifyAdmin, async (req, res) => {
      const result = await photoCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      res.send(result);
    });

    ////////////////////////////////////////////////////////////////////////////////////

    // USER Authentication related API
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

    //////
    // Logout API
    // LOGOUT API
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
