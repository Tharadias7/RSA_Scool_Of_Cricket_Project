const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lendings = sequelize.define('Lendings', {
    stockId: {
      type: DataTypes.INTEGER,  
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
    issuedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    collectedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'lendings',
  });

  return Lendings;
};
