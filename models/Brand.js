const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    logo: String,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    popularityIndex: { type: Number, default: 0 },
    rating: Number
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
