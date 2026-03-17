const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  cookieName: process.env.AUTH_COOKIE_NAME || "token",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  adminSeedEmail: process.env.ADMIN_SEED_EMAIL || "",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || "",
  adminSeedName: process.env.ADMIN_SEED_NAME || "System Admin",
};

module.exports = env;
