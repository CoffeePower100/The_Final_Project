const express = require('express');
const router = express.Router();
const Category = require('../models/category');

const auth = require('./auth.js'); 

//CRUD -> CREATE
// Create a new category with given name and description:
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
// Get all categories of table "category":
router.get('/getAllCategories', auth, (request, response) => {
    Category.findAll()
    .then(categories => {
        return response.status(200).json({
            categories: categories
        });
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        });
    })
})

//CRUD -> READ ONE BY PK
// Get a specific category by its Id number:
router.get('/getCategory/:categoryId', auth, (request, response) => {
    const categoryId = request.params.categoryId;
    Category.findByPk(categoryId)
    .then(category => {
        // if category with given Id number not found:
        if (null == category)
        {
            return response.status(200).json({
                message: "category with given Id doesn't exist"
            });
        }
        else
        {
            return response.status(200).json({
                category: category
            });
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})


//CRUD -> READ ONE / MANY BY VALUE
// Get one specific category / multiple categories with given key words:
router.get('/getCategoriesByValue/:searchKeyWords', auth, (request, response) => {
    const searchKeyWords = request.params.searchKeyWords;
    Category.findAll({where: {categoryName: searchKeyWords}})
    .then(categories => {
        // if category with given key words in its name
        // doesn't exist:
        if (0 == categories)
        {
            return response.status(200).json({
                message: "category with given key-words doesn't exist"
            });
        }
        else
        {
            return response.status(200).json({
                categories: categories
            });
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

//CRUD -> UPDATE EXISTING CATEGORY BY PK
// Update a specific category by its Id number:
router.put('/updateCategory/:categoryId', auth, (request, response) => {
    const categoryId = request.params.categoryId;
    Category.findByPk(categoryId)
    .then(category => {
        // if category with given Id number not found:
        if (null == category)
        {
            return response.status(200).json({
                message: "category with given Id doesn't exist"
            });
        }
        else
        {
            const {categoryName, categoryDesc} = request.body;
            category.categoryName = categoryName;
            category.categoryDesc = categoryDesc;
            return category.save()
            .then(categoryUpdated => {
                return response.status(200).json({
                    category: categoryUpdated
                });
            })
            .catch(err => {
                return response.status(500).json({
                    error: err
                });
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

//CRUD -> DELETE CATEGORY BY PK
// Delete a specific category by its Id number:
router.delete('/deleteCategory/:categoryId', auth, (request, response) => {
    const categoryId = request.params.categoryId;
    Category.findByPk(categoryId)
    .then(category => {
        // if category with given Id number not found: 
        if (null == category)
        {
            return response.status(200).json({
                message: "category with given Id doesn't exist"
            });
        }
        else
        {
            return category.destroy()
            .then(categoryRemoved => {
                return response.status(200).json({
                    category: categoryRemoved
                });
            })
            .catch(err => {
                return response.status(500).json({
                    error: err
                });
            })
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

module.exports = router;
