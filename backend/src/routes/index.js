import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import photoRoutes from "./photo.routes.js";
import videoRoutes from "./video.routes.js";
import heroImageRoutes from "./heroImage.routes.js";
import packageRoutes from "./package.routes.js";
import bookingRoutes from "./booking.routes.js";
import reviewRoutes from "./review.routes.js";
import notificationRoutes from "./notification.routes.js";
import paymentRoutes from "./payment.routes.js";

const rootRouter = Router();

// Health check & test routes
rootRouter.get("/", (req, res) => {
  res.send("Hello World! CRUD is working fine");
});

rootRouter.get("/test-route", (req, res) => {
  res.send("TEST ROUTE WORKING");
});

// Domain routers
rootRouter.use(authRoutes);
rootRouter.use(userRoutes);
rootRouter.use(photoRoutes);
rootRouter.use(videoRoutes);
rootRouter.use(heroImageRoutes);
rootRouter.use(packageRoutes);
rootRouter.use(bookingRoutes);
rootRouter.use(reviewRoutes);
rootRouter.use(notificationRoutes);
rootRouter.use(paymentRoutes);

export default rootRouter;
