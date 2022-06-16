const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'shop_online', 
    'root',
    'admin',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

module.exports = sequelize;
