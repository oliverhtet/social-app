import mongoose from "mongoose";
import env from "./env";
const connectDB = async () => {
  try {
    await mongoose.connect(env.dbUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
