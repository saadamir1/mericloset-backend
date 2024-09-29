const express = require('express');
const {
    createCloset,
    getClosetsByUserId,
    updateCloset,
    deleteCloset,
} = require('../controllers/ClosetController');

const router = express.Router();

// Closet routes
router.post('/', createCloset); // Create a new closet
router.get('/:userId', getClosetsByUserId); // Get closets by user ID
router.put('/:closetId', updateCloset); // Update closet
router.delete('/:closetId', deleteCloset); // Delete closet

module.exports = router;
