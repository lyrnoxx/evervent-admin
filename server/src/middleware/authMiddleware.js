const User = require("../models/User");
const env = require("../config/env");
const { verifyToken } = require("../utils/jwt");
const { sendError } = require("../utils/response");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[env.cookieName];

    if (!token) {
      return sendError(res, 401, "Authentication required");
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return sendError(res, 401, "Invalid token");
    }

    req.user = user;
    return next();
  } catch (error) {
    return sendError(res, 401, "Invalid or expired token");
  }
};

module.exports = {
  requireAuth,
};
