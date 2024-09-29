const mongoose = require('mongoose');

const lookbookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: Date, default: Date.now },
    description: String
});

const Lookbook = mongoose.model('Lookbook', lookbookSchema);
module.exports = Lookbook;
