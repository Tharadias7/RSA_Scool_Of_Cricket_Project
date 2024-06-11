const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User",{
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
      },
      employee_no: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return User;
};
