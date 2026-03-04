const Subject = require("../models/Subject");

const createSubject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied - Admins only"
      });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required"
      });
    }

    const subject = await Subject.create({
      title,
      description
    });

    return res.status(201).json({
      message: "Subject created successfully",
      subject
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    return res.status(200).json(subjects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = { createSubject, getAllSubjects };