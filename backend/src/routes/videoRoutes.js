const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireEnrollment = require("../middleware/requireEnrollment");
const resolveSectionSubject = require("../middleware/resolveSectionSubject");
const { createVideo, getVideosBySection } = require("../controllers/videoController");

const router = express.Router();

router.post("/", authenticate, createVideo);

router.get(
  "/:sectionId",
  authenticate,
  resolveSectionSubject,
  requireEnrollment,
  getVideosBySection
);

module.exports = router;