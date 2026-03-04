const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireEnrollment = require("../middleware/requireEnrollment");
const {
  markVideoCompleted,
  getSubjectProgress,
  getUserProgressOverview,
  updateLastWatched
} = require("../controllers/videoProgressController");

const router = express.Router();

router.get(
  "/overview",
  authenticate,
  getUserProgressOverview
);

router.post(
  "/complete",
  authenticate,
  requireEnrollment,
  markVideoCompleted
);

router.post(
  "/timestamp",
  authenticate,
  updateLastWatched
);

router.get(
  "/:subjectId",
  authenticate,
  requireEnrollment,
  getSubjectProgress
);

module.exports = router;