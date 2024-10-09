const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    measurements: {
        height: { type: Number },
        weight: { type: Number },
        chest: { type: Number },
        waist: { type: Number },
    },
    preferences: {
        style: { type: String },
        sustainability: { type: Boolean },
        size: { type: String },
        color: { type: String },
        favoriteBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }],
        fitPreference: { type: String }
    },
    lookbooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lookbook' }],
    closets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Closet' }],
    comparisonLists: [{
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        dateCompared: { type: Date, default: Date.now }
    }],
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'other'] },
    age: { type: Number, min: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});

// Virtual field to create 'id' based on '_id'
userSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convert _id to a string
});

// Ensure virtual fields are included when converting to JSON
userSchema.set('toJSON', {
    virtuals: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
