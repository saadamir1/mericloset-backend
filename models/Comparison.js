const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    dateCompared: { type: Date, default: Date.now }
});

const Comparison = mongoose.model('Comparison', comparisonSchema);
module.exports = Comparison;
