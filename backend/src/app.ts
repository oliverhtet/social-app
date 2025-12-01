import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import postRoutes from "./routes/postRoutes";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Something went wrong!" });
});

export default app;
