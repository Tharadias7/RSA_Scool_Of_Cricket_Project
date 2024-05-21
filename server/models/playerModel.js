const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Player = sequelize.define("Player", {
    playerId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contact_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    joined_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  return Player;
};
