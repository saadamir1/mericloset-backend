const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    images: [{ type: String }],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    price: Number,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    sizesAvailable: [String],
    colorsAvailable: [String],
    popularityIndex: { type: Number, default: 0 },
    tags: [String],
    dateCreated: { type: Date, default: Date.now },
    isEthical: Boolean,
    ratings: Number
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
