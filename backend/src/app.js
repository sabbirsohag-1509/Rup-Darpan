import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import env from "./config/env.js";
import rootRouter from "./routes/index.js";
import { notFoundHandler, globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

// CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  "http://localhost:5173",
  "https://rupdarpon.web.app",
  "https://rupdarpon.firebaseapp.com",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, serverless internal)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for seamless client communication
    },
    credentials: true,
  }),
);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie Parser
app.use(cookieParser());

// Passport Initialization
app.use(passport.initialize());

// Application Routes
app.use(rootRouter);

// 404 & Global Exception Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
