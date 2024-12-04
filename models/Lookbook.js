const mongoose = require('mongoose');

const lookbookSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    visibility: { type: String, enum: ['public', 'private'], default: 'private' },
    tags: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});

const Lookbook = mongoose.model('Lookbook', lookbookSchema);
module.exports = Lookbook;
