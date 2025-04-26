const express = require('express');
const router = express.Router();
const {
    createTracking,
    getUserTracking,
    getTrackingById,
    updateTracking,
    deleteTracking,
    recommendProducts
} = require('../controllers/TrackingController');

const Tracking = require('../models/Tracking');

// Get all tracking records
router.get('/', async (req, res) => {
    try {
        const trackingRecords = await Tracking.find().populate('user product');
        res.status(200).json(trackingRecords);
    } catch (error) {
        console.error('Error fetching tracking records:', error.message);
        res.status(500).json({ message: 'Server error while fetching tracking records.' });
    }
});

// Create a new tracking record
router.post('/', createTracking);

// Get tracking records for a specific user
router.get('/user/:userId', getUserTracking);

// Get a specific tracking record
router.get('/:trackingId', getTrackingById);

// Update a tracking record
router.put('/:trackingId', updateTracking);

// Delete a tracking record
router.delete('/:trackingId', deleteTracking);

// Get product recommendations
router.get('/recommendations/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const recommendedProducts = await recommendProducts(userId);
        res.status(200).json(recommendedProducts);
    } catch (error) {
        console.error('Error fetching recommendations:', error.message);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
});

module.exports = router;
