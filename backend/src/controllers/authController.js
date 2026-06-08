import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import ApiError from "../utils/apiError.js";
import { signToken } from "../utils/jwt.js";
import User from "../models/User.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

export const register = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, role = "student" } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, "Email already registered");
    }

    const user = await User.create({ name, email, password, role });
    const token = signToken({ id: user._id, role: user.role });

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

export const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = signToken({ id: user._id, role: user.role });
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

export const profile = asyncHandler(async (req, res, next) => {
  try {
    res.json({ user: sanitizeUser(req.user) });
  } catch (error) {
    next(error);
  }
});