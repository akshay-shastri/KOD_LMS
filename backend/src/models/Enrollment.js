const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");
const Subject = require("./Subject");

const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  },
  {
    tableName: "enrollments",
    timestamps: true
  }
);

/* Many-to-Many Relationship */
User.belongsToMany(Subject, {
  through: Enrollment,
  foreignKey: "userId",
  onDelete: "CASCADE"
});

Subject.belongsToMany(User, {
  through: Enrollment,
  foreignKey: "subjectId",
  onDelete: "CASCADE"
});

/* Direct Associations (Required for include) */
Enrollment.belongsTo(User, {
  foreignKey: "userId"
});

Enrollment.belongsTo(Subject, {
  foreignKey: "subjectId"
});

module.exports = Enrollment;