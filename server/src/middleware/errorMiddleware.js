const { sendError } = require("../utils/response");

const notFoundHandler = (req, res) => {
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (res.headersSent) {
    return next(err);
  }

  return sendError(res, statusCode, message);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
