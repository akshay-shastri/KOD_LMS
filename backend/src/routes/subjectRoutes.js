const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { createSubject, getAllSubjects } = require("../controllers/subjectController");

const router = express.Router();

router.post("/", authenticate, createSubject);
router.get("/", getAllSubjects);

module.exports = router;