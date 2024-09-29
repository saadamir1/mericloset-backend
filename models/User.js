const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    measurements: [{
        type: mongoose.Schema.Types.Mixed, // You can define specific measurement details
    }],
    preferences: {
        style: { type: String },
        sustainability: { type: Boolean },
        size: { type: String },
        color: { type: String },
        favoriteBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],
        fitPreference: { type: String }
    },
    closet: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        dateAdded: { type: Date, default: Date.now },
        customNotes: String
    }],
    lookbooks: [{
        name: { type: String },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        dateCreated: { type: Date, default: Date.now }
    }],
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    personalizedRecommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    comparisonLists: [{
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        dateCompared: { type: Date, default: Date.now }
    }],
    isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
