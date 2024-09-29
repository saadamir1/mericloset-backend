const ClosetItem = require('../models/ClosetItem');

// Add item to closet
const addItemToCloset = async (req, res) => {
    const { closetId, productId, customNotes } = req.body;
    try {
        const closetItem = new ClosetItem({ closet: closetId, product: productId, customNotes });
        await closetItem.save();
        res.status(201).json(closetItem);
    } catch (error) {
        console.error('Error adding item to closet:', error);
        res.status(500).json({ message: 'Error adding item to closet' });
    }
};

// Get items in closet
const getClosetItems = async (req, res) => {
    const { closetId } = req.params;
    try {
        const items = await ClosetItem.find({ closet: closetId }).populate('product');
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching closet items:', error);
        res.status(500).json({ message: 'Error fetching closet items' });
    }
};

module.exports = {
    addItemToCloset,
    getClosetItems
};
