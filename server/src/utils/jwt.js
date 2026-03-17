const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signToken = (payload) => {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

const verifyToken = (token) => {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.verify(token, env.jwtSecret);
};

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

module.exports = {
  signToken,
  verifyToken,
  cookieOptions,
};
