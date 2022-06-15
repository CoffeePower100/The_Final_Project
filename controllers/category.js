const express = require('express');
const router = express.Router();
const Category = require('../models/category');

const auth = require('./auth.js'); 

//CRUD -> CREATE
router.post('/createCategory', auth, (request, response) => {
    const {categoryName, categoryDesc} = request.body;
    Category.create({
        categoryName: categoryName,
        categoryDesc: categoryDesc 
    })
    .then(category => {
        return response.status(200).json({
            category: category
        });
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

//CRUD -> READ ALL
router.get('/getAllCategories', (request, response) => {
    Category.findAll()
    .then(categories => {
        return response.status(200).json({
            message: categories
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})

//CRUD -> READ ONE BY PK
router.get('/getCategory/:categoryId', (request, response) => {
    const categoryId = request.params.categoryId;
    Category.findByPk(categoryId)
    .then(category => {
        return response.status(200).json({
            message: category
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})

//CRUD -> UPDATE EXISTING CATEGORY BY PK
router.put('/updateCategory/:categoryId', (request, response) => {
    const categoryId = request.params.categoryId;
    Category.findByPk(categoryId)
    .then(category => {
        const {categoryName, categoryDescription} = request.body;
        category.categoryName = categoryName;
        category.categoryDescription = categoryDescription;
        return category.save();
    })
    .then(category_updated => {
        return response.status(200).json({
            message: category_updated
        });
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        });
    })
})

//CRUD -> DELETE CATEGORY BY PK
router.delete('/deleteCategory/:categoryId', (request, response) => {
    const categoryId = request.params.categoryId;
    Category.findByPk(categoryId)
    .then(category => {
        return category.destroy();
    })
    .then(categoryRemoved => {
        return response.status(200).json({
            message: categoryRemoved
        })
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        })
    })
})

//CRUD -> READ ONE / MANY BY VALUE
router.get('/getCategoriesByValue/:search', (request, response) => {
    const search = request.params.search;
    Category.findAll({where: {categoryName: search}})
    .then(categories => {
        return response.status(200).json({
            message: categories
        });
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        });
    })
})

module.exports = router;