const Product = require('../models/Product');

// Create a new product
const createProduct = async (req, res) => {
    const productData = req.body;

    try {
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

// Get all products with pagination
const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 74;
    const skip = (page - 1) * limit;

    try {
        const totalCount = await Product.countDocuments().catch(err => {
            console.error("Count operation failed:", err);
            throw new Error("Count operation timed out");
        });
        const products = await Product.find().skip(skip).limit(limit);
        res.status(200).json({
            count: totalCount,
            next: totalCount > page * limit ? `/api/v1/products?page=${page + 1}&limit=${limit}` : null,
            results: products,
        });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ message: "Error fetching products" });
    }
};



// Get product by ID
const getProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};

// Update product by ID
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const updateData = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
