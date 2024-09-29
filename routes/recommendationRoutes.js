const express = require('express');
const {
    getPersonalizedRecommendations,
} = require('../controllers/RecommendationController');

const router = express.Router();

// Recommendation routes
router.get('/:userId', getPersonalizedRecommendations); // Get personalized recommendations for user

module.exports = router;
