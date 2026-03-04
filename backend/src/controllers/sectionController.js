const Section = require("../models/Section");
const Subject = require("../models/Subject");

const createSection = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied - Admins only"
      });
    }

    const { title, subjectId } = req.body;

    if (!title || !subjectId) {
      return res.status(400).json({
        message: "Title and subjectId are required"
      });
    }

    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    const section = await Section.create({
      title,
      subjectId
    });

    return res.status(201).json({
      message: "Section created successfully",
      section
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const getSectionsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const sections = await Section.findAll({
      where: { subjectId }
    });

    return res.status(200).json(sections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { createSection, getSectionsBySubject };