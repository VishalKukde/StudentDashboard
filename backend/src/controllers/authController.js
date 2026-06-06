const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const { signToken } = require("../utils/jwt");
const { createRecord, findOne } = require("../store");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "student" } = req.body;
  const existing = await findOne("users", (user) => user.email === email);

  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createRecord("users", { name, email, password: hashedPassword, role });
  const token = signToken({ id: user._id, role: user.role });

  res.status(201).json({ token, user: sanitizeUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await findOne("users", (entry) => entry.email === email);

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken({ id: user._id, role: user.role });
  res.json({ token, user: sanitizeUser(user) });
});

const profile = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

module.exports = { register, login, profile };