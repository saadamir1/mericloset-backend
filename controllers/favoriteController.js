const Favorite = require('../models/Favorite');
const Product = require('../models/Product');


exports.addFavorite = async (req, res) => {
  const { productId, userId } = req.body;

  if (!productId || !userId) {
    return res.status(400).json({ message: "Product ID and User ID are required" });
  }

  try {
    
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingFavorite = await Favorite.findOne({ user: userId, product: productId });
    if (existingFavorite) {
      return res.status(200).json({ message: "Already in favorites", favorite: existingFavorite });
    }

    const favorite = new Favorite({ user: userId, product: productId });
    await favorite.save();

    return res.status(201).json({ message: "Added to favorites", favorite });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.removeFavorite = async (req, res) => {
  const { productId, userId } = req.params;

  if (!productId || !userId) {
    return res.status(400).json({ message: "Product ID and User ID are required" });
  }

  try {
    const removed = await Favorite.findOneAndDelete({ user: userId, product: productId });

    if (!removed) {
      return res.status(404).json({ message: "Product not found in favorites" });
    }

    return res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const favorites = await Favorite.find({ user: userId }).populate("product");

    return res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
