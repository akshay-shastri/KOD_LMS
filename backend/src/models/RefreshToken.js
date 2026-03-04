const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: "refresh_tokens",
    timestamps: true
  }
);

User.hasMany(RefreshToken, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

RefreshToken.belongsTo(User, {
  foreignKey: "userId"
});

module.exports = RefreshToken;