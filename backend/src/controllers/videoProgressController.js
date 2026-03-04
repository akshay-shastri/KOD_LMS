const VideoProgress = require("../models/VideoProgress");
const Video = require("../models/Video");
const Section = require("../models/Section");
const Enrollment = require("../models/Enrollment");

const markVideoCompleted = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ message: "videoId is required" });
    }

    const video = await Video.findByPk(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    let progress = await VideoProgress.findOne({
      where: { userId, videoId }
    });

    if (progress) {
      progress.completed = true;
      progress.lastWatched = progress.lastWatched || 0;
      await progress.save();
    } else {
      progress = await VideoProgress.create({
        userId,
        videoId,
        completed: true,
        lastWatched: 0
      });
    }

    return res.status(200).json({
      message: "Video marked as completed",
      progress
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ------------------------------
   NEW: Save Last Watched Timestamp
---------------------------------*/
const updateLastWatched = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId, seconds } = req.body;

    if (!videoId || typeof seconds !== "number") {
      return res.status(400).json({ message: "videoId and seconds required" });
    }

    let progress = await VideoProgress.findOne({
      where: { userId, videoId }
    });

    if (progress) {
      // Only update if newer timestamp
      if (seconds > progress.lastWatched) {
        progress.lastWatched = Math.floor(seconds);
        await progress.save();
      }
    } else {
      progress = await VideoProgress.create({
        userId,
        videoId,
        completed: false,
        lastWatched: Math.floor(seconds)
      });
    }

    return res.status(200).json({
      message: "Timestamp saved"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getSubjectProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectId } = req.params;

    const sections = await Section.findAll({
      where: { subjectId },
      include: [{ model: Video }],
      order: [
        ["createdAt", "ASC"],
        [Video, "createdAt", "ASC"]
      ]
    });

    const orderedVideos = [];

    for (const section of sections) {
      for (const video of section.Videos) {
        orderedVideos.push({
          id: video.id,
          title: video.title,
          sectionId: section.id
        });
      }
    }

    const totalVideos = orderedVideos.length;

    if (totalVideos === 0) {
      return res.status(200).json({
        totalVideos: 0,
        completedVideos: 0,
        percentage: 0,
        completedVideoIds: [],
        nextVideo: null,
        lastWatchedMap: {}
      });
    }

    const allProgress = await VideoProgress.findAll({
      where: { userId }
    });

    const completedVideoIds = allProgress
      .filter(p => p.completed)
      .map(p => p.videoId);

    const lastWatchedMap = {};
    allProgress.forEach(p => {
      lastWatchedMap[p.videoId] = p.lastWatched;
    });

    const completedVideos = completedVideoIds.filter(id =>
      orderedVideos.some(v => v.id === id)
    ).length;

    const percentage = Math.round(
      (completedVideos / totalVideos) * 100
    );

    let nextVideo = null;

    for (const video of orderedVideos) {
      if (!completedVideoIds.includes(video.id)) {
        nextVideo = video;
        break;
      }
    }

    return res.status(200).json({
      totalVideos,
      completedVideos,
      percentage,
      completedVideoIds,
      nextVideo,
      lastWatchedMap
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Overview endpoint (unchanged logic)
const getUserProgressOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { userId }
    });

    const subjectIds = enrollments.map(e => e.subjectId);

    const overview = {};

    for (const subjectId of subjectIds) {

      const sections = await Section.findAll({
        where: { subjectId },
        include: [{ model: Video }]
      });

      const allVideoIds = [];

      for (const section of sections) {
        for (const video of section.Videos) {
          allVideoIds.push(video.id);
        }
      }

      const totalVideos = allVideoIds.length;

      const completed = await VideoProgress.findAll({
        where: {
          userId,
          videoId: allVideoIds,
          completed: true
        }
      });

      const completedCount = completed.length;

      const percentage = totalVideos === 0
        ? 0
        : Math.round((completedCount / totalVideos) * 100);

      overview[subjectId] = {
        totalVideos,
        completedVideos: completedCount,
        percentage
      };
    }

    return res.status(200).json(overview);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  markVideoCompleted,
  updateLastWatched,
  getSubjectProgress,
  getUserProgressOverview
};