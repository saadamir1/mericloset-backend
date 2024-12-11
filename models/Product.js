const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Example: 'Navy Blue Shalwar Kameez'
    brand: { type: String, required: true, default: 'Unknown Brand' }, // Example: 'J.'
    productId: { type: String }, // Example: 'JSMK12345'
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    sizes: [{ type: String, required: true }], // Example: ['M', 'L', 'XL', 'XXL']
    fitType: { type: String, required: true }, // Example: 'Regular Fit'
    colors: [{ type: String, required: true }], // Example: ['Navy Blue', 'Cream', 'Black']
    material: { type: String }, // Example: 'Cotton Lawn'
    price: { type: Number, required: true }, // Example: 3500.00
    measurements: {
        chest: { type: Number },
        waist: { type: Number },
        length: { type: Number },
        shoulder: { type: Number },
        sleeveLength: { type: Number }
    },
    stockStatus: { type: String }, // Example: 'In Stock'
    images: [{ type: String, required: true }], // Example: ['j_shalwar_kameez1.jpg', 'j_shalwar_kameez2.jpg']
    occasion: { type: String }, // Example: 'Formal'
    description: { type: String }, // Example: 'Elegant navy blue shalwar kameez for formal occasions.'

    tags: [{ type: String }], // Product tags for content-based filtering
    popularityIndex: { type: Number, default: 0 }, // Useful for collaborative filtering

}, { timestamps: true });

// Indexing
productSchema.index({ productId: 1, brand: 1 }, { unique: true });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ title: 'text', tags: 'text' });

// Virtual field to create 'id' based on '_id'
productSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convert _id to a string
});

// Ensure virtual fields are included when converting to JSON
productSchema.set('toJSON', {
    virtuals: true
});

productSchema.pre('save', function (next) {
    if (this.isNew) {
        const brandPrefix = this.brand.slice(0, 2).toUpperCase(); // Get the first two letters of the brand
        this.productId = `${brandPrefix}_${this._id}`; // Set the productId with MongoDB auto-generated ID
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
