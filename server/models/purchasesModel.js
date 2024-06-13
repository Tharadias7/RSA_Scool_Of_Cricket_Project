const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Purchases = sequelize.define('Purchases', {
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      playerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  }, {
    timestamps: false,
    tableName: 'purchases',
  });

  return Purchases;
};
