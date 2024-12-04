const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recommendedProducts: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        score: { type: Number }, // Relevance score (based on content-based or collaborative filtering)
        reason: { type: String }, // E.g., "based on your browsing history", "based on similar users"
        filteringType: {
            type: String,
            enum: ['content', 'collaborative'],
            required: true,
        },
        recommendationMethod: {
            type: String,
            enum: ['manual', 'algorithmic'],
            default: 'algorithmic'
        }
    }],
    recommendationDate: { type: Date, default: Date.now },
    recommendationType: {
        type: String,
        enum: ['personalized', 'popular', 'trending', 'collaborative', 'content'],
        required: true,
    },
    expirationDate: { type: Date }, // When the recommendation should expire or be refreshed
    source: { type: String } // E.g., "algorithm", "user's browsing history"
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation;
