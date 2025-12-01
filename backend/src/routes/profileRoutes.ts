import express from "express";
import { getProfile } from "../controllers/profileController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();
router.get("/", authenticateToken, getProfile);

export default router;
