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

// Get all closets by user ID
const getClosetsByUserId = async (req, res) => {
    const { userId } = req.params; // Get userId from request parameters
    try {
        const closets = await Closet.find({ user: userId }).populate('closetItems'); // Fetch all closets for the user and populate closetItems
        if (!closets || closets.length === 0) {
            return res.status(404).json({ message: 'No closets found for this user' });
        }
        res.status(200).json(closets); // Return the found closets
    } catch (error) {
        console.error('Error fetching closets by user ID:', error);
        res.status(500).json({ message: 'Error fetching closets' });
    }
};

// Update closet
const updateCloset = async (req, res) => {
    const { closetId } = req.params;
    const updates = req.body; // Get updates from request body

    try {
        const closet = await Closet.findById(closetId);
        if (!closet) {
            return res.status(404).json({ message: 'Closet not found' });
        }

        Object.assign(closet, updates); // Update closet fields with new values
        await closet.save();

        res.status(200).json({ message: 'Closet updated successfully', closet });
    } catch (error) {
        console.error('Error updating closet:', error);
        res.status(500).json({ message: 'Error updating closet' });
    }
};

// Delete closet
const deleteCloset = async (req, res) => {
    const { closetId } = req.params;

    try {
        const closet = await Closet.findByIdAndDelete(closetId);
        if (!closet) {
            return res.status(404).json({ message: 'Closet not found' });
        }
        res.status(200).json({ message: 'Closet deleted successfully' });
    } catch (error) {
        console.error('Error deleting closet:', error);
        res.status(500).json({ message: 'Error deleting closet' });
    }
};

module.exports = {
    createCloset,
    getUserCloset,
    getClosetsByUserId,
    updateCloset,
    deleteCloset
};
