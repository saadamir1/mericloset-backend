const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// @desc Add a product to favorites
// @route POST /api/favorites/add
// @access Private
// exports.addFavorite = async (req, res) => {
//     try {
//         const { productId } = req.body;
//         const userId = req.user._id;

//         // Check if the product already exists in favorites
//         const existingFavorite = await Favorite.findOne({ user: userId, product: productId });

//         if (existingFavorite) {
//             return res.status(400).json({ message: 'Product is already in favorites' });
//         }

//         // Add product to favorites
//         const favorite = new Favorite({ user: userId, product: productId });
//         await favorite.save();

//         res.status(201).json({ message: 'Added to favorites', favorite });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


exports.addFavorite = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // ✅ **Check if Product is Already in Wishlist**
        let favorite = await Favorite.findOne({ product: productId });

        if (favorite) {
            // ✅ If already in wishlist, return the existing favorite (No error)
            return res.status(200).json({ message: "Already in favorites", favorite });
        }

        // ✅ **Add Product to Wishlist if Not Already Exists**
        favorite = new Favorite({ product: productId });
        await favorite.save();

        res.status(201).json({ message: "Added to favorites", favorite });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc Remove a product from favorites
// @route DELETE /api/favorites/remove/:productId
// @access Private

exports.removeFavorite = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // ✅ **Remove product from wishlist (No user filtering for now)**
        const favorite = await Favorite.findOneAndDelete({ product: productId });

        if (!favorite) {
            return res.status(404).json({ message: "Product not found in favorites" });
        }

        res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc Get all favorite products of a user
// @route GET /api/favorites/user
// @access Private
// exports.getUserFavorites = async (req, res) => {
//     try {
//         const userId = req.user._id;

//         const favorites = await Favorite.find({ user: userId }).populate('product');

//         res.status(200).json(favorites);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

exports.getUserFavorites = async (req, res) => {
    try {
        let favorites;

        // 🔴 Fix: Check if req.user exists before using _id
        if (req.user && req.user._id) {
            const userId = req.user._id;
            favorites = await Favorite.find({ user: userId }).populate('product');
        } else {
            // 🔴 Fix: If no user is provided, return all wishlist items (for testing)
            favorites = await Favorite.find().populate('product');
        }

        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


