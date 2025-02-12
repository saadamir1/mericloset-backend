const express = require('express');
const { addFavorite, removeFavorite, getUserFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Add product to favorites
router.post('/add', addFavorite);

// Remove product from favorites
router.delete('/remove/:productId', removeFavorite);

// Get all user favorites
router.get('/user', getUserFavorites);

module.exports = router;
