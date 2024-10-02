const Brand = require('../models/Brand');

// Create a new brand
const createBrand = async (req, res) => {
    const { name } = req.body; // Extract brand name from request body
    try {
        const newBrand = new Brand({ name });
        await newBrand.save();
        res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
    } catch (error) {
        console.error('Error creating brand:', error);
        res.status(500).json({ message: 'Error creating brand' });
    }
};

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

// Update brand
const updateBrand = async (req, res) => {
    const { brandId } = req.params;
    const updates = req.body; // Get updates from request body

    try {
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        Object.assign(brand, updates); // Update brand fields with new values
        await brand.save();

        res.status(200).json({ message: 'Brand updated successfully', brand });
    } catch (error) {
        console.error('Error updating brand:', error);
        res.status(500).json({ message: 'Error updating brand' });
    }
};

// Delete brand
const deleteBrand = async (req, res) => {
    const { brandId } = req.params;

    try {
        const brand = await Brand.findByIdAndDelete(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error('Error deleting brand:', error);
        res.status(500).json({ message: 'Error deleting brand' });
    }
};

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand
};
