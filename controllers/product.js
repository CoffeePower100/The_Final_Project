const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');

const auth = require('./auth.js'); 

//CRUD -> CREATE
// Create a new product with: its
// category's Id number, its name and its price:
router.post('/createProduct', auth, (request, response) => {
    const {categoryId, productName, productPrice} = request.body;
    
    // check if given category's id is valid:
    Category.findByPk(categoryId)
    .then(category => {
        // if category with given Id number doesn't exist:
        if (null == category)
        {
            return response.status(200).json({
                message: "entered category's Id isn't for existing category"
            });
        }
        else
        {
            Product.create({
                categoryId: categoryId,
                productName: productName,
                productPrice: productPrice 
            })
            .then(createdProduct => {
                return response.status(200).json({
                    product: createdProduct 
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

//CRUD -> READ ALL
// Get all products of table "product":
router.get('/getAllProducts', auth, (request, response) => {
    Product.findAll()
    .then(products => {
        return response.status(200).json({
            products: products
        });
    })
    .catch(err => {
        return response.status(500).json({
            message: err
        });
    })
})

//CRUD -> READ ONE BY PK
// Get a specific product by its Id number:
router.get('/getProduct/:productId', auth, (request, response) => {
    const productId = request.params.productId;
    Product.findByPk(productId)
    .then(product => {
        // if product with given Id number not found:
        if (null == product)
        {
            return response.status(200).json({
                message: "product with given Id doesn't exist"
            });
        }
        else
        {
            return response.status(200).json({
                product: product
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
// Get one specific product / multiple products with given key words:
router.get('/getProductsByValue/:searchKeyWords', auth, (request, response) => {
    const searchKeyWords = request.params.searchKeyWords;
    Product.findAll({where: {productName: searchKeyWords}})
    .then( products => {
        // if product with given key words in its name
        // doesn't exist:
        if (0 == products)
        {
            return response.status(200).json({
                message: "product with given key-words doesn't exist"
            });
        }
        else
        {
            return response.status(200).json({
                products: products
            });
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

//CRUD -> READ ONE / MANY BY VALUE:
// Get all products with given category's Id:
router.get("/getProductsByCategory/:categoryId", auth, (request, response) => {
    const categoryId = request.params.categoryId;
    Product.findAll({where: {categoryId: categoryId}})
    .then( products => {
        // if product with given category's Id number
        // doesn't exist:
        if (0 == products)
        {
            return response.status(200).json({
                message: "product with given key-words doesn't exist"
            });
        }
        else
        {
            return response.status(200).json({
                products: products
            });
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

//CRUD -> UPDATE EXISTING PRODUCT BY PK
// Update a specific product by its Id number:
router.put('/updateProduct/:productId', auth, (request, response) => {
    const productId = request.params.productId;
    Product.findByPk(productId)
    .then(product => {
        // if product with given Id number not found:
        if (null == product)
        {
            return response.status(200).json({
                message: "product with given Id doesn't exist"
            });
        }
        else
        {
            const {categoryId, productName, productPrice} = request.body;
            
            // check if given category's id is valid:
            Category.findByPk(categoryId)
            .then(category => {
                // if category with given Id number doesn't exist:
                if (null == category)
                {
                    return response.status(200).json({
                        message: "entered category's Id isn't for existing category"
                    });
                }
                else
                {
                    product.categoryId = categoryId;
                    product.productName = productName;
                    product.productPrice = productPrice;
                    return product.save()
                    .then(productUpdated => {
                        return response.status(200).json({
                            product: productUpdated
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
        }
    })
    .catch(err => {
        return response.status(500).json({
            error: err
        });
    })
})

//CRUD -> DELETE PRODUCT BY PK
// Delete a specific product by its Id number:
router.delete('/deleteProduct/:productId', auth, (request, response) => {
    const productId = request.params.productId;
    Product.findByPk(productId)
    .then(product => {
        // if product with given Id number not found: 
        if (null == product)
        {
            return response.status(200).json({
                message: "product with given Id doesn't exist"
            });
        }
        else
        {
            return product.destroy()
            .then(productRemoved => {
                return response.status(200).json({
                    product: productRemoved
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