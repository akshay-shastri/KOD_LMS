const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDB, sequelize } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

require("./models/User");
require("./models/Subject");
require("./models/Section");
require("./models/Video");
require("./models/Enrollment");
require("./models/VideoProgress");

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const videoRoutes = require("./routes/videoRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const videoProgressRoutes = require("./routes/videoProgressRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const app = express();

if (isProduction) {
  app.set("trust proxy", 1);
}

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", videoProgressRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "LMS Backend Running 🚀" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync();
  console.log("Database synchronized successfully 📦");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();