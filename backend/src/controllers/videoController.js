const Video = require("../models/Video");
const Section = require("../models/Section");

const createVideo = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied - Admins only"
      });
    }

    const { title, videoUrl, sectionId } = req.body;

    if (!title || !videoUrl || !sectionId) {
      return res.status(400).json({
        message: "Title, videoUrl and sectionId are required"
      });
    }

    const section = await Section.findByPk(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section not found"
      });
    }

    const video = await Video.create({
      title,
      videoUrl,
      sectionId
    });

    return res.status(201).json({
      message: "Video created successfully",
      video
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const getVideosBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const videos = await Video.findAll({
      where: { sectionId }
    });

    return res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { createVideo, getVideosBySection };