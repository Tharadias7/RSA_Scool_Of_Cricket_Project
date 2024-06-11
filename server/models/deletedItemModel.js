const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const DeletedItem = sequelize.define('DeletedItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    stockId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });

  return DeletedItem;
};
