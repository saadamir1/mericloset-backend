const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Product = require('../models/Product');

const router = express.Router();
const upload = multer({ dest: 'upload/' }); // Directory to save uploaded files

// Endpoint to upload Excel file and insert data into MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
    console.log('Upload endpoint hit');
    console.log('Request file:', req.file); // Log the uploaded file info

    try {
        const file = req.file;
        if (!file) {
            console.error('No file uploaded');
            return res.status(400).send('No file uploaded.');
        }

        console.log(`Processing file: ${file.path}`);
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Log the first 5 entries of the parsed JSON data for testing
        console.log('Parsed JSON Data (First 5 entries):', JSON.stringify(jsonData.slice(0, 5), null, 2));

        // Map JSON data to products
        const products = jsonData.map((item) => ({
            title: item.title || '', // Default to empty string if title is undefined
            productId: item.productID || '', // Default to empty string if productID is undefined
            category: item.category || '', // Default to empty string if category is undefined
            gender: item.gender || '', // Default to empty string if gender is undefined
            sizes: (item.sizes && typeof item.sizes === 'string') ? item.sizes.split(',') : [], // Split sizes if valid
            fitType: item.fitType || '', // Default to empty string if fitType is undefined
            colors: (item.colors && typeof item.colors === 'string') ? item.colors.split(',') : [], // Split colors if valid
            price: item.price ? parseFloat(item.price) : 0, // Convert price to float; default to 0 if undefined
            description: item.description || '', // Default to empty string if description is undefined
            brand: item.brand && item.brand.trim() ? item.brand : 'Unknown Brand', // Default to 'Unknown Brand' if brand is empty or undefined
            images: (item.images && typeof item.images === 'string') ? [item.images] : [], // Prevent errors if images is undefined
        }));

        // Log the first 5 mapped products for testing
        console.log('Mapped Products (First 5 entries):', JSON.stringify(products.slice(0, 5), null, 2));

        await Product.insertMany(products);
        res.status(200).send('Products successfully imported.');
    } catch (error) {
        console.error('Error during file processing:', error);
        res.status(500).send('Error importing products.');
    }
});

module.exports = router;
