const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Section = require("./Section");

const Video = sequelize.define(
  "Video",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    outcomes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "videos",
    timestamps: true
  }
);

Section.hasMany(Video, {
  foreignKey: "sectionId",
  onDelete: "CASCADE"
});

Video.belongsTo(Section, {
  foreignKey: "sectionId"
});

module.exports = Video;