import mongoose from "mongoose";
import Post from "../models/Post";
import User from "../models/User";
import { getPagination } from "../utils/pagination";
export const createPost = async (
  userId: string,
  content: string,
 
) => {
  const postData = {
    user: userId,
    content: content,
   
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
    createdAt: post.createdAt,
    author: { id: post.user?._id, name: (post.user as any)?.name },
    reaction_count: post.likes?.length,
    comment_count: post.comments?.length,
    comments: post.comments,
    likes:post.likes

  }));
  const pagination = getPagination(page, limit, total);
  return { posts: postsWithCounts, pagination };
};

export const addComment = async (postId: string | undefined, userId: string | undefined, content: string) => {
  if (!postId) throw new Error("Post ID is required");
  if (!userId) throw new Error("User ID is required");
  if (!content) throw new Error("Comment content is required");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  const comment = {
    user: new mongoose.Types.ObjectId(userId),
    content,
    createdAt: new Date(),
  };

  post.comments.push(comment);
  await post.save();

  return comment;
};

export const toggleReaction = async (postId: string, userId: string, type = "like") => {
  if (type !== "like") throw new Error("Invalid reaction type");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const alreadyLiked = post.likes.some((id) => id.toString() === userObjectId.toString());

  let action: "liked" | "unliked";
  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userObjectId.toString());
    action = "unliked";
  } else {
    post.likes.push(userObjectId);
    action = "liked";
  }

  await post.save();

  return {
    postId,
    action,
    reaction_count: post.likes.length
  };
};