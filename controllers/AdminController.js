const Brand = require('../models/Brand');
const User = require('../models/User');
const Product = require('../models/Product');
const multer = require('multer');
const xlsx = require('xlsx');

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

exports.uploadProductSheet = async (req, res) => {
    //console.log('Upload endpoint hit');
    //console.log('Request file:', req.file); // Log the uploaded file info

    try {
        const file = req.file; // Access the uploaded file
        if (!file) {
            console.error('No file uploaded');
            return res.status(400).send('No file uploaded.');
        }
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        //console.log('Parsed JSON Data (First 5 entries):', JSON.stringify(jsonData.slice(0, 5), null, 2));

        // Map JSON data to products
        const products = jsonData.map((item) => ({
            title: item.title || '',
            //productId: item.productID || '',
            category: item.category || '',
            gender: item.gender || '',
            sizes: (item.sizes && typeof item.sizes === 'string') ? item.sizes.split(',') : [],
            fitType: item.fitType || '',
            colors: (item.colors && typeof item.colors === 'string') ? item.colors.split(',') : [],
            price: item.price ? parseFloat(item.price) : 0,
            description: item.description || '',
            brand: item.brand && item.brand.trim() ? item.brand : 'Unknown Brand',
            images: (item.images && typeof item.images === 'string') ? [item.images] : [],
        }));

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


