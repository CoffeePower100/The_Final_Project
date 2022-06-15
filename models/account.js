const Sequelize = require('sequelize');
const database = require('../utilis/database');

// creates account table:
const Account = database.define('account', {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING, 
    pass: Sequelize.STRING,
    verifyPassCode: Sequelize.INTEGER,
    updatePassCode: Sequelize.INTEGER,
    isApproved: Sequelize.BOOLEAN
})

module.exports = Account;
