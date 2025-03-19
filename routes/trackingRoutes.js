const express = require('express');
const router = express.Router();
const {
    createTracking,
    getUserTracking,
    getTrackingById,
    updateTracking,
    deleteTracking
} = require('../controllers/TrackingController');

const Tracking = require('../models/Tracking'); // Import Tracking model

router.get('/', async (req, res) => {
    try {
        const trackingRecords = await Tracking.find().populate('user product');
        res.status(200).json(trackingRecords);
    } catch (error) {
        console.error('Error fetching tracking records:', error.message);
        res.status(500).json({ message: 'Server error while fetching tracking records.' });
    }
});

// Existing routes
router.post('/', createTracking); // Create a new tracking record
router.get('/user/:userId', getUserTracking); // Get all tracking records for a user
router.get('/:trackingId', getTrackingById); // Get tracking record by ID
router.put('/:trackingId', updateTracking); // Update tracking record
router.delete('/:trackingId', deleteTracking); // Delete tracking record

module.exports = router;
