const express = require('express');
const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} = require('../controllers/BrandController');

const router = express.Router();

// Brand routes
router.post('/', createBrand); // Create a new brand
router.get('/', getAllBrands); // Get all brands
router.get('/:brandId', getBrandById); // Get brand by ID
router.put('/:brandId', updateBrand); // Update brand
router.delete('/:brandId', deleteBrand); // Delete brand

module.exports = router;
