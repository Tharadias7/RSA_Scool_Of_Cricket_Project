const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Uniform = sequelize.define('Uniform', {
    stockId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currentStock: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
  });

  return Uniform;
};
