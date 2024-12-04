const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
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
