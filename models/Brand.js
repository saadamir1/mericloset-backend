const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    logoUrl: { type: String }, // Brand logo image
    website: { type: String }, // Brand's official website
    createdAt: { type: Date, default: Date.now },
    popularityIndex: { type: Number, default: 0 },
    slug: { type: String, required: true, unique: true }, // Add slug field
});

// Virtual field to ensure compatibility with frontend expectations
brandSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

brandSchema.set('toJSON', { virtuals: true });

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;
