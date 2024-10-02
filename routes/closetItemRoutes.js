const express = require('express');
const {
    addItemToCloset,
    removeItemFromCloset,
    getClosetItems,
} = require('../controllers/ClosetItemController');

const router = express.Router();

// Closet Item routes
router.post('/:closetId/items', addItemToCloset); // Add item to closet
router.delete('/:closetId/items/:itemId', removeItemFromCloset); // Remove item from closet
router.get('/:closetId/items', getClosetItems); // Get items in closet

module.exports = router;
