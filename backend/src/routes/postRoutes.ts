import express from "express";
import { createPost, editPost, getMyPosts, getAllPosts, addComment, toggleReaction } from "../controllers/postController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Create Post
router.post("/", authenticateToken, createPost);

// Edit Post
router.put("/:id", authenticateToken, editPost);

// Get My Posts
router.get("/my-posts", authenticateToken, getMyPosts);

// Get All Posts (Newsfeed)
router.get("/", getAllPosts);

// Add Comment
router.post("/:id/comments", authenticateToken, addComment);

// Toggle Reaction
router.post("/:id/reaction", authenticateToken, toggleReaction);

export default router;
