const mongoose = require('mongoose');

const closetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Closet name (e.g., "Winter Wardrobe")
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        dateAdded: { type: Date, default: Date.now },
        customNotes: String
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Closet = mongoose.model('Closet', closetSchema);
module.exports = Closet;
