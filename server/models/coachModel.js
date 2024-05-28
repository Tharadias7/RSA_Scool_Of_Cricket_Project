const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Coach = sequelize.define('Coach', {
    employee_no: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    qualifications: {
      type: DataTypes.STRING,
    },
    assigned_team: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
  });

  return Coach;
};
