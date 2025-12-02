import { Request, Response } from "express";
import { createPost as createPostService, editPost as editPostService, getMyPosts as getMyPostsService, getAllPosts as getAllPostsService, addComment as addCommentService, toggleReaction as toggleReactionsService } from "../services/postService";
import { successResponse, errorResponse } from "../utils/response";
import Post from "../models/Post";
import { AuthenticatedRequest } from "../types";
import { ObjectId } from "mongoose";

// Create Post
export const createPost = async (cusreq: AuthenticatedRequest, res: Response) => {
  
  try {
    const { content } = cusreq.body;
    const userId = cusreq?.userId as string;
    const post = await createPostService(userId , content);
    return successResponse(res, "Post created successfully", post, 201);
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Server error");
  }
};

// Edit Post
export const editPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;
    const post = await Post.findById(id);
    if (!post) return errorResponse(res, "Post not found", 404);
    if (post.user.toString() !== (req as any).userId) {
      return errorResponse(res, "Not authorized", 403);
    }
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image !== undefined ? image : post.image;
    await post.save();
    return successResponse(res, "Post updated successfully", post);
  } catch (error) {
    return errorResponse(res, "Server error");
  }
};

// Get My Posts
export const getMyPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await getMyPostsService((req as any).userId, page, limit);
    successResponse(res, "Posts retrieved successfully", {
      posts: data.posts,
      pagination: { page: data.page, limit: data.limit, total: data.total, pages: data.pages }
    });
  } catch (error) {
    errorResponse(res, "Server error");
  }
};

// Get All Posts (Newsfeed)
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await getAllPostsService(page, limit);
    successResponse(res, "Posts retrieved successfully", {
      posts: data.posts,
      pagination: data.pagination
    });
  } catch (error) {
    console.error(error);
    errorResponse(res, "Server error");
  }
};

// Add Comment
export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.userId;
    if (!postId) {
      return errorResponse(res, "Post id is required", 400);
    }
    if (!content) {
      return errorResponse(res, "Content is required", 400);
    }
    if (!userId){
      return errorResponse(res,'User Not Found');
    }
    const comment = await addCommentService(postId, userId, content);
     return successResponse(res, "Comment added successfully", comment, 201);
  } catch (error) {
    console.log(error);
    if ((error as Error).message === "Post not found") {
      return errorResponse(res, (error as Error).message, 404);
    } else {

      return errorResponse(res, "Server error");
    }
  }
};

// Toggle Reaction (Like/Unlike)
export const toggleReaction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params; // post id
    const { type } = req.body;
    const userId = req.userId; // set by auth middleware

    if (!userId) return errorResponse(res, "Unauthorized", 401);
     if (!id) {
      return errorResponse(res, "Post ID is required", 400);
    }
    const data = await toggleReactionsService(id , userId, type);
    return successResponse(res, "Reaction updated successfully", data);
  } catch (error) {
    console.log(error);
    if ((error as Error).message === "Post not found") {
     return errorResponse(res, (error as Error).message, 404);
    } else if ((error as Error).message === "Invalid reaction type") {
      return errorResponse(res, (error as Error).message, 400);
    } else {
      return errorResponse(res, "Server error");
    }
  }
};
