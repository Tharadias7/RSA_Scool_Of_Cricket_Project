const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lendings = sequelize.define('Lendings', {
    issueId: {
      type: DataTypes.INTEGER,  
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    stockId: {
      type: DataTypes.INTEGER,  
      allowNull: false,
    },
    employee_no: {
      type: DataTypes.STRING,
      allowNull: false,
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
