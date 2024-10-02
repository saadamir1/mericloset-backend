const express = require('express');
const router = express.Router();
const {
    createRecommendation,
    getUserRecommendations,
    getRecommendationById,
    updateRecommendation,
    deleteRecommendation
} = require('../controllers/recommendationController');

// Recommendation routes
router.post('/', createRecommendation); // Create a new recommendation
router.get('/user/:userId', getUserRecommendations); // Get all recommendations for a user
router.get('/:recommendationId', getRecommendationById); // Get recommendation by ID
router.put('/:recommendationId', updateRecommendation); // Update recommendation
router.delete('/:recommendationId', deleteRecommendation); // Delete recommendation

module.exports = router;
