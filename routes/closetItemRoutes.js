const express = require('express');
const {
    addItemToCloset,
    removeItemFromCloset,
    getItemsInCloset,
} = require('../controllers/ClosetItemController');

const router = express.Router();

// Closet Item routes
router.post('/:closetId/items', addItemToCloset); // Add item to closet
router.delete('/:closetId/items/:itemId', removeItemFromCloset); // Remove item from closet
router.get('/:closetId/items', getItemsInCloset); // Get items in closet

module.exports = router;
