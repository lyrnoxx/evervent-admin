const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const env = require("../config/env");
const User = require("../models/User");

const seedAdmin = async () => {
  if (!env.adminSeedEmail || !env.adminSeedPassword) {
    throw new Error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required");
  }

  await connectDB();

  const existing = await User.findOne({ email: env.adminSeedEmail.toLowerCase() });
  if (existing) {
    existing.role = "Admin";
    await existing.save();
    console.log("Existing user promoted to Admin");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(env.adminSeedPassword, 10);

  await User.create({
    name: env.adminSeedName,
    email: env.adminSeedEmail.toLowerCase(),
    password: hashedPassword,
    role: "Admin",
  });

  console.log("Admin user created");
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error("Admin seed failed", error.message);
  process.exit(1);
});
