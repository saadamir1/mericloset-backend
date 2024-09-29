const Closet = require('../models/Closet');

// Create a new closet
const createCloset = async (req, res) => {
    const { userId } = req.body;
    try {
        const closet = new Closet({ user: userId });
        await closet.save();
        res.status(201).json(closet);
    } catch (error) {
        console.error('Error creating closet:', error);
        res.status(500).json({ message: 'Error creating closet' });
    }
};

// Get user's closet
const getUserCloset = async (req, res) => {
    const { userId } = req.params;
    try {
        const closet = await Closet.findOne({ user: userId }).populate('closetItems');
        if (!closet) {
            return res.status(404).json({ message: 'Closet not found' });
        }
        res.status(200).json(closet);
    } catch (error) {
        console.error('Error fetching user closet:', error);
        res.status(500).json({ message: 'Error fetching user closet' });
    }
};

module.exports = {
    createCloset,
    getUserCloset
};
