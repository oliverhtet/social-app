import { Request, Response, NextFunction } from "express";
import { getUserProfile } from "../services/userService";
import { successResponse, errorResponse } from "../utils/response";
import { AuthenticatedRequest } from "../types";
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
console.log(req.userId);
 
  try {
    if (!req.userId) {
      return errorResponse(res, "Unauthorized", 401);
    }
    const data = await getUserProfile(req.userId);
    console.log(data);
    return successResponse(res, "Profile retrieved successfully", data);
  } catch (error) {
    console.error(error);
    const errMsg = (error as Error).message;

    if (errMsg === "User not found") {
      return errorResponse(res, errMsg, 404);
    }
    return errorResponse(res, "Server error", 500);
  }
};
