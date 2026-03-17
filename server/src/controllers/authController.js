const bcrypt = require("bcryptjs");
const User = require("../models/User");
const env = require("../config/env");
const { signToken, cookieOptions } = require("../utils/jwt");
const { sendError, sendSuccess } = require("../utils/response");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "name, email and password are required");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 409, "Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "User",
    });

    const token = signToken({ userId: user._id, role: user.role });
    res.cookie(env.cookieName, token, cookieOptions);

    return sendSuccess(res, 201, "Registration successful", {
      user: user.toSafeObject(),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return sendError(res, 401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return sendError(res, 401, "Invalid credentials");
    }

    const token = signToken({ userId: user._id, role: user.role });
    res.cookie(env.cookieName, token, cookieOptions);

    return sendSuccess(res, 200, "Login successful", {
      user: user.toSafeObject(),
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  return sendSuccess(res, 200, "Current user", {
    user: req.user.toSafeObject(),
  });
};

const logout = async (req, res) => {
  res.clearCookie(env.cookieName, { ...cookieOptions, maxAge: undefined });
  return sendSuccess(res, 200, "Logged out");
};

module.exports = {
  register,
  login,
  me,
  logout,
};
