const Sequelize = require('sequelize');
const database = require('../utilis/database');

// creates products table:
const Product = database.define('product', {
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    productName: Sequelize.STRING,
    productPrice: Sequelize.INTEGER    
})

module.exports = Product;