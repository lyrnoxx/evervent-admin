const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendError, sendSuccess } = require("../utils/response");

const sanitizeUserList = (users) => users.map((user) => user.toSafeObject());

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "User" } = req.body;

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
      role,
    });

    return sendSuccess(res, 201, "User created", { user: user.toSafeObject() });
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Users fetched", { users: sanitizeUserList(users) });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, "User fetched", { user: user.toSafeObject() });
  } catch (error) {
    return next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id).select("+password");
    if (!targetUser) {
      return sendError(res, 404, "User not found");
    }

    const isAdmin = req.user.role === "Admin";
    const allowedSelfFields = ["name", "password"];
    const allowedAdminFields = ["name", "email", "role", "password"];
    const allowedFields = isAdmin ? allowedAdminFields : allowedSelfFields;

    Object.keys(req.body).forEach((field) => {
      if (!allowedFields.includes(field)) {
        return;
      }

      if (field === "email") {
        targetUser.email = String(req.body.email).toLowerCase();
        return;
      }

      if (field === "role") {
        targetUser.role = req.body.role;
        return;
      }

      if (field === "name") {
        targetUser.name = req.body.name;
      }
    });

    if (req.body.password && allowedFields.includes("password")) {
      targetUser.password = await bcrypt.hash(req.body.password, 10);
    }

    await targetUser.save();

    return sendSuccess(res, 200, "User updated", {
      user: targetUser.toSafeObject(),
    });
  } catch (error) {
    return next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return sendError(res, 404, "User not found");
    }

    return sendSuccess(res, 200, "User deleted");
  } catch (error) {
    return next(error);
  }
};

const getMyProfile = async (req, res) => {
  return sendSuccess(res, 200, "Profile fetched", {
    user: req.user.toSafeObject(),
  });
};

const updateMyProfile = async (req, res, next) => {
  try {
    const updates = {};

    if (typeof req.body.name === "string" && req.body.name.trim()) {
      updates.name = req.body.name.trim();
    }

    if (typeof req.body.password === "string" && req.body.password.length >= 6) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, 200, "Profile updated", {
      user: updated.toSafeObject(),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getMyProfile,
  updateMyProfile,
};
