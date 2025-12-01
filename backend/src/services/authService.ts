import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  profilePic?: string,
  createdAt?: Date
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData: { name: string; email: string; password: string; profilePic?: string ,createdAt: Date } = { name, email, password: hashedPassword , createdAt: createdAt ?? new Date()};
  if (profilePic !== undefined) {
    userData.profilePic = profilePic;
  }
  
  const user = await User.create(userData);
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return { id: user._id, name, email, token };
};

// Login function separated to avoid redeclaration and unreachable code
export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return { id: user._id, name: user.name, email, token,createdAt: user.createdAt ,profilePic: user.profilePic};
};
