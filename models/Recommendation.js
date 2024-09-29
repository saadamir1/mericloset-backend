const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recommendedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    recommendationDate: { type: Date, default: Date.now }
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;
