
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
