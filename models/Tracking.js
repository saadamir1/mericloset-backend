const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    viewedAt: { type: Date, default: Date.now },
    isFavorite: { type: Boolean, default: false },
    actions: [{
        actionType: { type: String, enum: ['viewed', 'favorited', 'shared'], required: true },
        timestamp: { type: Date, default: Date.now }
    }]
});

const Tracking = mongoose.model('Tracking', trackingSchema);
module.exports = Tracking;
