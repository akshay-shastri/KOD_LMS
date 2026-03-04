const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { register, login, changePassword, refreshAccessToken } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/change-password", authenticate, changePassword);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;