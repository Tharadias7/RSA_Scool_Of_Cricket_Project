const { Sequelize } = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
    const Staff = Sequelize.define('Staff', {
        employee_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        designation: {
            type: DataTypes.STRING,
            allowNull: false
        },  

    });

    return Staff;

};
