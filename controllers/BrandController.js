const Brand = require('../models/Brand');

// Get all brands
const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({ message: 'Error fetching brands' });
    }
};

// Get brand by ID
const getBrandById = async (req, res) => {
    const { brandId } = req.params;
    try {
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (error) {
        console.error('Error fetching brand:', error);
        res.status(500).json({ message: 'Error fetching brand' });
    }
};

module.exports = {
    getAllBrands,
    getBrandById
};
