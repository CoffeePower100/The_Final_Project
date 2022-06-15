const express = require('express');
const Sequelize = require('sequelize');
const database = require('../utilis/database');

// creates category table:
const Category = database.define('category', {
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    categoryName: Sequelize.STRING,
    categoryDesc: Sequelize.STRING    
})

module.exports = Category;