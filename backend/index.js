import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import env from "./src/config/env.js";

const port = env.PORT || 5000;

// Catch unhandled rejections to prevent silent termination
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
});

// Bootstrap server and database connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server is running smoothly on port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
};

startServer();

export default app;
