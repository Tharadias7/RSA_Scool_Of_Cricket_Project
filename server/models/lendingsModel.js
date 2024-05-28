const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lendings = sequelize.define('Lendings', {
    stockId: {
      type: DataTypes.INTEGER,  // Should match the type of stockId in Equipment
      allowNull: false,
      primaryKey: true,
    },
    employee_no: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    issuedAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    collectedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    issuedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'lendings',
  });

  return Lendings;
};
