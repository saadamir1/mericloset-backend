const mongoose = require('mongoose');

const closetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        dateAdded: { type: Date, default: Date.now },
        customNotes: String
    }],
    dateCreated: { type: Date, default: Date.now }
});

const Closet = mongoose.model('Closet', closetSchema);
module.exports = Closet;
