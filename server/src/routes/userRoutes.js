const express = require("express");
const {
  createUser,
  deleteUserById,
  getMyProfile,
  getUserById,
  getUsers,
  updateMyProfile,
  updateUserById,
} = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware");
const { authorizeRoles, authorizeSelfOrAdmin } = require("../middleware/rbacMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/me/profile", getMyProfile);
router.put("/me/profile", updateMyProfile);

router.post("/", authorizeRoles("Admin"), createUser);
router.get("/", getUsers);
router.get("/:id", authorizeSelfOrAdmin, getUserById);
router.put("/:id", authorizeSelfOrAdmin, updateUserById);
router.delete("/:id", authorizeRoles("Admin"), deleteUserById);

module.exports = router;
