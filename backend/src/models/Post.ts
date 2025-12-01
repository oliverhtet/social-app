
import mongoose, { Document } from "mongoose";

export interface IComment {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  image?: string;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String },
  content: { type: String, required: true },
  image: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model<IPost>("Post", postSchema);
