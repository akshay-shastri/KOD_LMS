const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Subject = sequelize.define(
  "Subject",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: "subjects",
    timestamps: true
  }
);

module.exports = Subject;