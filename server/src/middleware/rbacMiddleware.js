const { sendError } = require("../utils/response");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, "Forbidden");
    }

    return next();
  };
};

const authorizeSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, "Authentication required");
  }

  const isAdmin = req.user.role === "Admin";
  const isSelf = String(req.user._id) === String(req.params.id);

  if (!isAdmin && !isSelf) {
    return sendError(res, 403, "Forbidden");
  }

  return next();
};

module.exports = {
  authorizeRoles,
  authorizeSelfOrAdmin,
};
