import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDb from "./config/connectDB.js";
import path from "path";
import { fileURLToPath } from "url"; // ✅ Added for ES module compatibility
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import carRoute from "./routes/carRoute.js";
import userRoute from "./routes/userRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import reservationRoute from "./routes/reservationRoute.js";
import stripeRoute from "./routes/stripeRoute.js";
import Stripe from "stripe";

config();
connectDb();

// ✅ Fix: Replaces `__dirname` with ES module-friendly alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const stripe = Stripe(process.env.STRIPE_SECRET_TEST);
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ Fix applied here

// Routes
app.use("/api/user", userRoute);
app.use("/api/cars", carRoute);
app.use("/api/reservation", reservationRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/stripe", stripeRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});