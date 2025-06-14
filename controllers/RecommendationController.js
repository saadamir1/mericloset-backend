const Recommendation = require('../models/Recommendation');

// Create a new recommendation
const createRecommendation = async (req, res) => {
    const { userId, recommendedProducts } = req.body;

    try {
        const recommendation = new Recommendation({ user: userId, recommendedProducts });
        await recommendation.save();
        res.status(201).json(recommendation);
    } catch (error) {
        console.error('Error creating recommendation:', error);
        res.status(500).json({ message: 'Error creating recommendation' });
    }
};

// Get paginated recommendations for a user
const getUserRecommendations = async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const recommendation = await Recommendation.findOne({ user: userId });

        if (!recommendation) {
            return res.status(404).json({ message: 'No recommendations found for this user.' });
        }

        const uniqueSortedIds = [...new Set(recommendation.recommendedProducts.map(id => id.toString()).sort())];
        const total = uniqueSortedIds.length;
        const slicedProductIds = uniqueSortedIds.slice(skip, skip + limit);

        console.log("== BACKEND PAGINATION DEBUG ==");
        console.log("User ID:", userId);
        console.log("Page:", page);
        console.log("Limit:", limit);
        console.log("Skip:", skip);
        console.log("Total unique products:", total);
        console.log("Sliced Product IDs for this page:", slicedProductIds);
        console.log("================================");

        const products = await Product.find({ _id: { $in: slicedProductIds } });
        const orderedProducts = slicedProductIds.map(
          id => products.find(p => p._id.toString() === id)
        ).filter(Boolean);

        res.status(200).json({
            products: orderedProducts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

// Get a specific recommendation by ID
const getRecommendationById = async (req, res) => {
    const { recommendationId } = req.params;

    try {
        const recommendation = await Recommendation.findById(recommendationId).populate('recommendedProducts');
        if (!recommendation) {
            return res.status(404).json({ message: 'Recommendation not found' });
        }
        res.status(200).json(recommendation);
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        res.status(500).json({ message: 'Error fetching recommendation' });
    }
};

// Update a recommendation
const updateRecommendation = async (req, res) => {
    const { recommendationId } = req.params;
    const { recommendedProducts } = req.body;

    try {
        const updatedRecommendation = await Recommendation.findByIdAndUpdate(
            recommendationId,
            { recommendedProducts },
            { new: true }
        );

        if (!updatedRecommendation) {
            return res.status(404).json({ message: 'Recommendation not found' });
        }
        res.status(200).json(updatedRecommendation);
    } catch (error) {
        console.error('Error updating recommendation:', error);
        res.status(500).json({ message: 'Error updating recommendation' });
    }
};

// Delete a recommendation
const deleteRecommendation = async (req, res) => {
    const { recommendationId } = req.params;

    try {
        const deletedRecommendation = await Recommendation.findByIdAndDelete(recommendationId);
        if (!deletedRecommendation) {
            return res.status(404).json({ message: 'Recommendation not found' });
        }
        res.status(200).json({ message: 'Recommendation deleted successfully' });
    } catch (error) {
        console.error('Error deleting recommendation:', error);
        res.status(500).json({ message: 'Error deleting recommendation' });
    }
};

module.exports = {
    createRecommendation,
    getUserRecommendations,
    getRecommendationById,
    updateRecommendation,
    deleteRecommendation
};
