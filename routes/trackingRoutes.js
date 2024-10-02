const express = require('express');
const router = express.Router();
const {
    createTracking,
    getUserTracking,
    getTrackingById,
    updateTracking,
    deleteTracking
} = require('../controllers/trackingController');

// Tracking routes
router.post('/', createTracking); // Create a new tracking record
router.get('/user/:userId', getUserTracking); // Get all tracking records for a user
router.get('/:trackingId', getTrackingById); // Get tracking record by ID
router.put('/:trackingId', updateTracking); // Update tracking record
router.delete('/:trackingId', deleteTracking); // Delete tracking record

module.exports = router;
