const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../controllers/ProductController');

const router = express.Router();

// Product routes
router.post('/', createProduct); // Create a new product
router.get('/', getAllProducts); // Get all products
router.get('/:productId', getProductById); // Get product by ID
router.put('/:productId', updateProduct); // Update product
router.delete('/:productId', deleteProduct); // Delete product

module.exports = router;
