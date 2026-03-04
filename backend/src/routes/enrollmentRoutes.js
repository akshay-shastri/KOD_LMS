const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { enrollInSubject, getMyEnrollments } = require("../controllers/enrollmentController");

const router = express.Router();

router.post("/", authenticate, enrollInSubject);
router.get("/me", authenticate, getMyEnrollments);

module.exports = router;