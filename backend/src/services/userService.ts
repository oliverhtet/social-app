import User from "../models/User";
import Post from "../models/Post";
import mongoose from "mongoose";

export const getUserProfile = async (userId: string) => {
  // Ensure userId is ObjectId
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Fetch user
  const user = await User.findById(userId).lean();
  if (!user) return null;

  // Count posts
  const postCount = await Post.countDocuments({ user: userObjectId });

  // Count total likes (reactions) across all posts
  const posts = await Post.find({ user: userObjectId }).select("likes comments").lean();
  const reactionCount = posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
  const commentCount = posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0);

  // Return formatted user profile
  return {
    id: user._id,
    name: user.name,
    createdAt: user.createdAt,
    email: user.email,
    profilePic: user.profilePic,
    postCount,
    reactionCount,
    commentCount,
  };
};
