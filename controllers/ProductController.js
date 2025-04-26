const Product = require('../models/Product');

// Helper function to process image URLs into an array
const processImages = (imageData) => {
    if (typeof imageData === 'string') {
        // Remove single quotes and split by commas to get individual URLs
        return imageData
            .replace(/'/g, '')          // Remove single quotes
            .split(',')                 // Split by commas to get individual URLs
            .map(url => url.trim());    // Trim any leading/trailing whitespace from each URL
    }
    return imageData; // If imageData is already an array, return it as is
};

// Create a new product
const createProduct = async (req, res) => {
    let productData = req.body;

    // Ensure images are processed correctly if provided
    if (productData.images) {
        productData.images = processImages(productData.images);
    }

    try {
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 36;
    const skip = (page - 1) * limit;
    const { categoryID, brandID, ordering: sortOrder, minPrice, maxPrice, search } = req.query;
    console.log("Request Query Params:", req.query);

    // Build the filter object dynamically
    let filter = {};
    let originalFilter = {}; // Store original filter for later use

    if (categoryID) {
        filter.category = categoryID;
        originalFilter.category = categoryID;
    }

    if (brandID) {
        filter.brand = brandID;
        originalFilter.brand = brandID;
    }

    if (search) {
        // Create a more flexible search pattern
        const searchRegex = new RegExp(search.split(/\s+/).join('|'), 'i');
        
        // Search across multiple fields
        filter.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { brand: searchRegex },
            { tags: searchRegex }
        ];
    }

    // Adding price filters
    if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
        originalFilter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
        filter.price = { $gte: minPrice };
        originalFilter.price = { $gte: minPrice };
    } else if (maxPrice) {
        filter.price = { $lte: maxPrice };
        originalFilter.price = { $lte: maxPrice };
    }

    console.log("Filter:", filter);

    // Default sort is by relevance, handle other sorting options
    let sort = {};
    switch (sortOrder) {
        case "name":
            sort = { name: 1 }; // Sort by name A-Z
            break;
        case "-name":
            sort = { name: -1 }; // Sort by name Z-A
            break;
        case "price":
            sort = { price: 1 }; // Sort by price low to high
            break;
        case "-price":
            sort = { price: -1 }; // Sort by price high to low
            break;
        case "-added":
            sort = { addedDate: -1 }; // Sort by date added, descending
            break;
        case "-metacritic":
            sort = { popularity: -1 }; // Sort by popularity
            break;
        case "-rating":
            sort = { rating: -1 }; // Sort by average rating, descending
            break;
        default:
            sort = {}; // Default to no sorting (relevance)
            break;
    }

    console.log("Sort:", sort);

    try {
        // First, try to get filtered results
        const totalCount = await Product.countDocuments(filter);
        
        // If there are enough results, return them
        if (totalCount >= 3) { // You can adjust this minimum threshold
            const products = await Product.find(filter)
                .skip(skip)
                .limit(limit)
                .sort(sort);

            return res.status(200).json({
                count: totalCount,
                next: totalCount > page * limit ? `/api/v1/products?page=${page + 1}&limit=${limit}` : null,
                results: products,
                isDefaultResults: false
            });
        }
        
        // If not enough results, return default products
        // Keep only category and brand filters if they exist, but remove search
        console.log("Insufficient results. Showing default products...");
        
        // Use original filter (without search) or an empty filter for defaults
        const defaultFilter = Object.keys(originalFilter).length > 0 ? originalFilter : {};
        
        const defaultTotalCount = await Product.countDocuments(defaultFilter);
        const defaultProducts = await Product.find(defaultFilter)
            .skip(skip)
            .limit(limit)
            .sort({ popularity: -1 }); // Sort by popularity for defaults
        
        return res.status(200).json({
            count: defaultTotalCount,
            next: defaultTotalCount > page * limit ? `/api/v1/products?page=${page + 1}&limit=${limit}` : null,
            results: defaultProducts,
            isDefaultResults: true // Flag to indicate these are default results
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
    let updateData = req.body;

    // Ensure images are processed correctly if provided
    if (updateData.images) {
        updateData.images = processImages(updateData.images);
    }

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
