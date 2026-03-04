const { Enrollment } = require("../models");
const Video = require("../models/Video");
const Section = require("../models/Section");

const requireEnrollment = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized - No token provided"
      });
    }

    const userId = req.user.id;
    let subjectId = req.params.subjectId || req.body.subjectId;

    // If videoId is provided, fetch subjectId from video
    if (!subjectId && req.body.videoId) {
      const video = await Video.findByPk(req.body.videoId, {
        include: [{ model: Section }]
      });

      if (video && video.Section) {
        subjectId = video.Section.subjectId;
      }
    }

    if (!subjectId) {
      return res.status(400).json({
        message: "Subject ID required"
      });
    }

    const enrollment = await Enrollment.findOne({
      where: {
        userId,
        subjectId
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Access denied. Not enrolled in this course."
      });
    }

    next();
  } catch (error) {
    console.error("Enrollment check failed:", error);
    return res.status(500).json({
      message: "Server error during enrollment validation"
    });
  }
};

module.exports = requireEnrollment;