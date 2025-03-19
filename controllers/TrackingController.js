const Tracking = require('../models/Tracking');


// Create a new tracking record
const createTracking = async (req, res) => {
    const { userId, productId, actionType } = req.body;

    try {
        const tracking = new Tracking({ user: userId, product: productId, actions: [{ actionType }] });
        await tracking.save();
        res.status(201).json(tracking);
    } catch (error) {
        console.error('Error creating tracking record:', error);
        res.status(500).json({ message: 'Error creating tracking record' });
    }
};

// Get all tracking records for a user
const getUserTracking = async (req, res) => {
    const { userId } = req.params;

    try {
        const trackingRecords = await Tracking.find({ user: userId }).populate('product');
        res.status(200).json(trackingRecords);
    } catch (error) {
        console.error('Error fetching tracking records:', error);
        res.status(500).json({ message: 'Error fetching tracking records' });
    }
};

// Get a specific tracking record by ID
const getTrackingById = async (req, res) => {
    const { trackingId } = req.params;

    try {
        const tracking = await Tracking.findById(trackingId).populate('product');
        if (!tracking) {
            return res.status(404).json({ message: 'Tracking record not found' });
        }
        res.status(200).json(tracking);
    } catch (error) {
        console.error('Error fetching tracking record:', error);
        res.status(500).json({ message: 'Error fetching tracking record' });
    }
};

// Update a tracking record
const updateTracking = async (req, res) => {
    const { trackingId } = req.params;
    const { actionType, isFavorite } = req.body;

    try {
        const updatedTracking = await Tracking.findByIdAndUpdate(
            trackingId,
            {
                isFavorite,
                $push: { actions: { actionType } }
            },
            { new: true }
        );

        if (!updatedTracking) {
            return res.status(404).json({ message: 'Tracking record not found' });
        }
        res.status(200).json(updatedTracking);
    } catch (error) {
        console.error('Error updating tracking record:', error);
        res.status(500).json({ message: 'Error updating tracking record' });
    }
};


// Delete a tracking record
const deleteTracking = async (req, res) => {
    const { trackingId } = req.params;

    try {
        const deletedTracking = await Tracking.findByIdAndDelete(trackingId);
        if (!deletedTracking) {
            return res.status(404).json({ message: 'Tracking record not found' });
        }
        res.status(200).json({ message: 'Tracking record deleted successfully' });
    } catch (error) {
        console.error('Error deleting tracking record:', error);
        res.status(500).json({ message: 'Error deleting tracking record' });
    }
};

module.exports = {
    createTracking,
    getUserTracking,
    getTrackingById,
    updateTracking,
    deleteTracking
};
