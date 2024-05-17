const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
    const Attendance = sequelize.define('Attendance', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        playerId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        week1: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        week2: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        week3: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        week4: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      }, {
        timestamps: false
      });
  return Attendance;
};
