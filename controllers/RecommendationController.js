const Recommendation = require('../models/Recommendation');

// Generate recommendations for a user
const generateRecommendations = async (req, res) => {
    const { userId } = req.params;
    try {
        //  recommendation logic will be implemented later
        const recommendations = await Recommendation.find({ user: userId }).populate('product');
        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ message: 'Error generating recommendations' });
    }
};

module.exports = {
    generateRecommendations
};
