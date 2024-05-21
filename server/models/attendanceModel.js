const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const Attendance = sequelize.define('Attendance', {
      playerId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true,
    },
    attendanceStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    timestamps: false,
  });
  
  return Attendance;
};
