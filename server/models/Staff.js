const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Staff = sequelize.define(
    "Staff",
    {
      employee_no: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_no: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  return Staff;
};
