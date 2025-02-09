const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String, enum: ['male', 'female', 'non-binary', 'other', ''] },
    age: { type: Number, min: 0 },
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
});
const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;

