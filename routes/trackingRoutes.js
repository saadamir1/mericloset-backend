const express = require('express');
const {
    createTrackingEntry,
    getTrackingByUserId,
    deleteTrackingEntry,
} = require('../controllers/TrackingController');

const router = express.Router();

// Tracking routes
router.post('/', createTrackingEntry); // Create a new tracking entry
router.get('/:userId', getTrackingByUserId); // Get tracking entries by user ID
router.delete('/:trackingId', deleteTrackingEntry); // Delete tracking entry

module.exports = router;
