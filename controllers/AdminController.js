const Brand = require('../models/Brand');
const User = require('../models/User');
const Product = require('../models/Product');
const multer = require('multer');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const crypto = require('crypto');


// Create a new brand (Admin operation)
exports.createBrandAdmin = async (req, res) => {
    try {
        const brandData = req.body; // Assuming brand data is sent in the request body
        const newBrand = new Brand(brandData);
        await newBrand.save();
        return res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating brand', error: error.message });
    }
};

// Delete a brand (Admin operation)
exports.deleteBrandAdmin = async (req, res) => {
    try {
        const { brandId } = req.params;
        await Brand.findByIdAndDelete(brandId);
        return res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting brand', error: error.message });
    }
};

// Upload product sheet (Admin operation)
exports.uploadProductSheet = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            console.error('No file uploaded');
            return res.status(400).send('No file uploaded.');
        }

        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Map JSON data to products
        const products = jsonData.map((item) => {
            const brandPrefix = item.brand ? item.brand.slice(0, 2).toUpperCase() : 'XX';
            const generatedId = new ObjectId(); // Generate a new ObjectId manually
            const hash = crypto.createHash('sha256').update(generatedId.toString()).digest('hex').slice(0, 8); // Shorten hash for readability

            return {
                title: item.title || '',
                category: item.category || '',
                gender: item.gender || '',
                sizes: (item.sizes && typeof item.sizes === 'string') ? item.sizes.split(',') : [],
                fitType: item.fitType || '',
                colors: (item.colors && typeof item.colors === 'string') ? item.colors.split(',') : [],
                price: item.price ? parseFloat(item.price) : 0,
                description: item.description || '',
                brand: item.brand && item.brand.trim() ? item.brand : 'Unknown Brand',
                images: (item.images && typeof item.images === 'string') ? [item.images] : [],
                productId: `${brandPrefix}_${hash}`, // Use hash-based productId
                _id: generatedId, // Use the same generated ObjectId for MongoDB insertion
            };
        });

        // Bulk insert products
        await Product.insertMany(products);
        res.status(200).send('Products successfully imported.');
    } catch (error) {
        console.error('Error during file processing:', error);
        res.status(500).send('Error importing products.');
    }
};



// Get all users (Admin operation)
exports.getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find(); // Get all users from the database
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Delete a user (Admin operation)
exports.deleteUserAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
