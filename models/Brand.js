const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    logoUrl: { type: String }, // Brand logo image
    website: { type: String }, // Brand's official website
    createdAt: { type: Date, default: Date.now },
    popularityIndex: { type: Number, default: 0 },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
