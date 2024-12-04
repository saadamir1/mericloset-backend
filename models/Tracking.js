const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    viewedAt: { type: Date, default: Date.now },
    isFavorite: { type: Boolean, default: false },
    actions: [{
        actionType: { type: String, enum: ['viewed', 'favorited', 'shared'], required: true }, //'added_to_cart', 'purchased' hasn't edded yet
        timestamp: { type: Date, default: Date.now }
    }],
    sessionId: { type: String }, // To track the session in which the user viewed the product
    device: { type: String, enum: ['mobile', 'web', 'tablet'], default: 'web' }, // Track device/platform
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] // Track categories for content-based filtering
});

const Tracking = mongoose.model('Tracking', trackingSchema);
module.exports = Tracking;
