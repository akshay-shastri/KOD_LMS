const Enrollment = require("../models/Enrollment");
const Subject = require("../models/Subject");

const enrollInSubject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectId } = req.body;

    if (!subjectId) {
      return res.status(400).json({
        message: "subjectId is required"
      });
    }

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: { userId, subjectId }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Already enrolled in this subject"
      });
    }

    const enrollment = await Enrollment.create({
      userId,
      subjectId
    });

    return res.status(201).json({
      message: "Enrolled successfully",
      enrollment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [
        {
          model: Subject,
          attributes: ["id", "title", "description"]
        }
      ]
    });

    return res.status(200).json(enrollments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { enrollInSubject, getMyEnrollments };