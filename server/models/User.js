const { Sequelize } = require("sequelize");
module.exports = (Sequelize, DataTypes) => {    
    const User = Sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        employee_no: {
            type: DataTypes.INTEGER,
        },

        
    });

    return User;
  
};