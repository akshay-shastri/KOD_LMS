const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireEnrollment = require("../middleware/requireEnrollment");
const { createSection, getSectionsBySubject } = require("../controllers/sectionController");

const router = express.Router();

router.post("/", authenticate, createSection);

router.get(
  "/:subjectId",
  authenticate,
  requireEnrollment,
  getSectionsBySubject
);

module.exports = router;