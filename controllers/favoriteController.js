const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// @desc Add a product to favorites
// @route POST /api/favorites/add
// @access Private
exports.addFavorite = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        if (!productId || !userId) {
            return res.status(400).json({ message: "Product ID and User ID are required" });
        }

        const existingFavorite = await Favorite.findOne({ user: userId, product: productId });

        if (existingFavorite) {
            return res.status(200).json({ message: "Already in favorites", favorite: existingFavorite });
        }

        const favorite = new Favorite({ user: userId, product: productId });
        await favorite.save();

        res.status(201).json({ message: "Added to favorites", favorite });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Remove a product from favorites
// @route DELETE /api/favorites/remove/:productId/:userId
// @access Private
exports.removeFavorite = async (req, res) => {
    try {
        const { productId, userId } = req.params;

        if (!productId || !userId) {
            return res.status(400).json({ message: "Product ID and User ID are required" });
        }

        const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });

        if (!favorite) {
            return res.status(404).json({ message: "Product not found in favorites" });
        }

        res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get all favorite products of a user
// @route GET /api/favorites/user/:userId
// @access Private
exports.getUserFavorites = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const favorites = await Favorite.find({ user: userId }).populate("product");
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
