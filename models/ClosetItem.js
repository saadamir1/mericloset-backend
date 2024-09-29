const mongoose = require('mongoose');

const closetItemSchema = new mongoose.Schema({
    closet: { type: mongoose.Schema.Types.ObjectId, ref: 'Closet', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    dateAdded: { type: Date, default: Date.now },
    customNotes: { type: String, default: '' },
    tags: [{ type: String }], // Optional tags for categorization
    quantity: { type: Number, default: 1 } // To allow for tracking multiple quantities of the same item
});

const ClosetItem = mongoose.model('ClosetItem', closetItemSchema);
module.exports = ClosetItem;
