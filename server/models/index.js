'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    console.log(`Loading model file: ${file}`); // Debug log
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log(`Associating model: ${modelName}`); // Debug log
    db[modelName].associate(db);
  }
});

console.log('Models loaded:', Object.keys(db)); // Debug log

// Define associations between models

db.Player.belongsToMany(db.Uniform, { through: db.Purchases, foreignKey: 'playerId', otherKey: 'stockId' });
db.Uniform.belongsToMany(db.Player, { through: db.Purchases, foreignKey: 'stockId', otherKey: 'playerId' });

db.Uniform.belongsToMany(db.Purchases, { through: 'UniformPurchases', as: "purchases", foreignKey: 'stockId' });
db.Purchases.belongsToMany(db.Uniform, { through: 'UniformPurchases', as: "uniforms", foreignKey: 'transactionId' });

db.Equipment.hasMany(db.Lendings, { foreignKey: 'stockId' });
db.Lendings.belongsTo(db.Equipment, { foreignKey: 'stockId' });

db.Coach.hasMany(db.Lendings, { foreignKey: 'employee_no' });
db.Lendings.belongsTo(db.Coach, { foreignKey: 'employee_no' });

db.Coach.hasMany(db.Player, { foreignKey: 'employee_no' });
db.Player.belongsTo(db.Coach, { foreignKey: 'employee_no' });

db.Player.hasMany(db.Attendance, { foreignKey: 'playerId' });
db.Attendance.belongsTo(db.Player, { foreignKey: 'playerId' });

db.Player.hasMany(db.Payment, { foreignKey: 'playerId' });
db.Payment.belongsTo(db.Player, { foreignKey: 'playerId' });

db.Staff.hasOne(db.User, { foreignKey: 'employee_no', as: 'user' });
db.User.belongsTo(db.Staff, { foreignKey: 'employee_no', as: 'staff' });

db.Staff.hasOne(db.Coach, { foreignKey: 'employee_no'});
db.Coach.belongsTo(db.Staff, { foreignKey: 'employee_no'});

db.DeletedItem.belongsTo(db.Equipment, { foreignKey: 'stockId' });
db.Equipment.hasMany(db.DeletedItem, { foreignKey: 'stockId' });


db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

