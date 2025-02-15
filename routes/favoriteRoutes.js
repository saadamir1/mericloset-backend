const express = require('express');
const { addFavorite, removeFavorite, getUserFavorites } = require('../controllers/favoriteController');

const router = express.Router();

router.post('/add', addFavorite);
router.delete('/remove/:productId/:userId', removeFavorite);
router.get('/user/:userId', getUserFavorites);

module.exports = router;
