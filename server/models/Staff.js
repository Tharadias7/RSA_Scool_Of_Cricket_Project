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
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Default to true for new records
      },
    },
    {
      timestamps: false,
    }
  );
  return Staff;
};
