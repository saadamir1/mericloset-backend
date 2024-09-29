const Tracking = require('../models/Tracking');

// Track product view
const trackProductView = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const tracking = new Tracking({ user: userId, product: productId, actions: [{ actionType: 'viewed' }] });
        await tracking.save();
        res.status(201).json(tracking);
    } catch (error) {
        console.error('Error tracking product view:', error);
        res.status(500).json({ message: 'Error tracking product view' });
    }
};

// Get tracking data for a user
const getUserTracking = async (req, res) => {
    const { userId } = req.params;
    try {
        const trackingData = await Tracking.find({ user: userId }).populate('product');
        res.status(200).json(trackingData);
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        res.status(500).json({ message: 'Error fetching tracking data' });
    }
};

module.exports = {
    trackProductView,
    getUserTracking
};
