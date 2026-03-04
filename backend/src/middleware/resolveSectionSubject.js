const { Section } = require("../models");

const resolveSectionSubject = async (req, res, next) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findByPk(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section not found"
      });
    }

    req.params.subjectId = section.subjectId;

    next();
  } catch (error) {
    console.error("Section resolve failed:", error);
    return res.status(500).json({
      message: "Server error resolving section"
    });
  }
};

module.exports = resolveSectionSubject;