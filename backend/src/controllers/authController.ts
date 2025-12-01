
import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, profilePic } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ status: "error", message: "All fields required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ status: "error", message: "Password must be at least 8 characters long" });
    }
    const data = await registerUser(name, email, password, profilePic, new Date());
    return res.json({ status: "success", message: "User registered", data });
  } catch (error) {
    return res.status(500).json({ status: "error", message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    return res.json({ status: "success", message: "Login successful", data });
  } catch (error) {
    return res.status(401).json({ status: "error", message: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {

  return res.json({ status: "success", message: "Logout successful" });
};
