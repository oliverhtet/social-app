import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/index";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.userId = decoded.id; // 🔥 Now TypeScript supports this
    console.log("Authenticated user ID:", req.userId);
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
