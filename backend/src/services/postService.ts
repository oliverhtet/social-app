import Post from "../models/Post";
import User from "../models/User";
import { getPagination } from "../utils/pagination";
export const createPost = async (
  userId: string,
  content: string,
 
) => {
  const postData = {
    user: userId,
    content: content.trim(),
   
  };

  // Create post
  const post = await Post.create(postData);

  // Optional: populate user for frontend convenience
  const populatedPost = await post.populate("user", "name email avatar profilePic");

  return populatedPost;
};

export const editPost = async (postId: string, userId: string, title?: string, content?: string, image?: string) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.user.toString() !== userId) throw new Error("Not authorized");
  post.title = title || post.title;
  post.content = content || post.content;
  if (image !== undefined) {
    post.image = image;
  }
  await post.save();
  return post;
};

export const getMyPosts = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Post.countDocuments({ user: userId });
  return { posts, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getAllPosts = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const posts = await Post.find().populate({ path: "user", select: "name" }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  const total = await Post.countDocuments();
  const postsWithCounts = posts.map(post => ({
    id: post._id,
    title: post.title,
    content: post.content,
    image: post.image,
    created_at: post.createdAt,
    author: { id: post.user?._id, name: (post.user as any)?.name },
    reaction_count: post.likes?.length,
    comment_count: post.comments?.length
  }));
  const pagination = getPagination(page, limit, total);
  return { posts: postsWithCounts, pagination };
};

export const addComment = async (postId: string, userId: string, content: string) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  const mongoose = require("mongoose");
  const comment = {
    user: mongoose.Types.ObjectId(userId),
    content,
    createdAt: new Date()
  };
  post.comments.push(comment);
  await post.save();
  return comment;
};

export const toggleReaction = async (postId: string, userId: string, type: string) => {
  if (type !== "like") throw new Error("Invalid reaction type");
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");
  const mongoose = require("mongoose");
  const userObjectId = mongoose.Types.ObjectId(userId);
  const userIndex = post.likes.indexOf(userObjectId);
  let action;
  if (userIndex > -1) {
    post.likes.splice(userIndex, 1);
    action = "unliked";
  } else {
    post.likes.push(require("mongoose").Types.ObjectId(userId));
    action = "liked";
  }
  await post.save();
  return { action, reaction_count: post.likes.length };
};
