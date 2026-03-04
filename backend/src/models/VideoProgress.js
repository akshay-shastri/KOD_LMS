const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");
const Video = require("./Video");

const VideoProgress = sequelize.define(
  "VideoProgress",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastWatched: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: "video_progress",
    timestamps: true
  }
);

User.belongsToMany(Video, {
  through: VideoProgress,
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Video.belongsToMany(User, {
  through: VideoProgress,
  foreignKey: "videoId",
  onDelete: "CASCADE"
});

VideoProgress.belongsTo(User, {
  foreignKey: "userId"
});

VideoProgress.belongsTo(Video, {
  foreignKey: "videoId"
});

module.exports = VideoProgress;