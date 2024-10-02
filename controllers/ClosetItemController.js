const ClosetItem = require('../models/ClosetItem');

// Add item to closet
const addItemToCloset = async (req, res) => {
    const { closetId } = req.params; // Extract closetId from request parameters
    const { productId, customNotes } = req.body; // Extract productId and customNotes from request body
    try {
        const closetItem = new ClosetItem({ closet: closetId, product: productId, customNotes });
        await closetItem.save(); // Save the new closet item
        res.status(201).json(closetItem); // Return the created closet item
    } catch (error) {
        console.error('Error adding item to closet:', error);
        res.status(500).json({ message: 'Error adding item to closet' }); // Handle error
    }
};

// Remove item from closet
const removeItemFromCloset = async (req, res) => {
    const { closetId, itemId } = req.params; // Extract closetId and itemId from request parameters
    try {
        const closetItem = await ClosetItem.findOneAndDelete({ _id: itemId, closet: closetId }); // Find and delete the closet item
        if (!closetItem) {
            return res.status(404).json({ message: 'Item not found in closet' }); // Handle case where item doesn't exist
        }
        res.status(200).json({ message: 'Item removed from closet successfully' }); // Return success message
    } catch (error) {
        console.error('Error removing item from closet:', error);
        res.status(500).json({ message: 'Error removing item from closet' }); // Handle error
    }
};

// Get items in closet
const getClosetItems = async (req, res) => {
    const { closetId } = req.params; // Extract closetId from request parameters
    try {
        const items = await ClosetItem.find({ closet: closetId }).populate('product'); // Fetch items related to the closet and populate product details
        res.status(200).json(items); // Return the found items
    } catch (error) {
        console.error('Error fetching closet items:', error);
        res.status(500).json({ message: 'Error fetching closet items' }); // Handle error
    }
};

module.exports = {
    addItemToCloset,
    removeItemFromCloset,
    getClosetItems
};
