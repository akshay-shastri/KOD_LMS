const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Subject = require("./Subject");

const Section = sequelize.define(
  "Section",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "sections",
    timestamps: true
  }
);

Subject.hasMany(Section, {
  foreignKey: "subjectId",
  onDelete: "CASCADE"
});

Section.belongsTo(Subject, {
  foreignKey: "subjectId"
});

module.exports = Section;