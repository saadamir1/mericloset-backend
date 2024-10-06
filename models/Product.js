const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Example: 'Navy Blue Shalwar Kameez'
    brand: { type: String, required: true, default: 'Unknown Brand' }, // Example: 'J.'
    productId: { type: String, required: true }, // Example: 'JSMK12345'
    category: { type: String, required: true }, // Example: 'Shalwar Kameez'
    gender: { type: String, required: true, enum: ['Mens', 'Womens', 'Kids'] }, // Example: 'Mens'
    sizes: [{ type: String, required: true }], // Example: ['M', 'L', 'XL', 'XXL']
    fitType: { type: String, required: true }, // Example: 'Regular Fit'
    colors: [{ type: String, required: true }], // Example: ['Navy Blue', 'Cream', 'Black']
    material: { type: String }, // Example: 'Cotton Lawn'
    price: { type: Number, required: true }, // Example: 3500.00
    measurements: {
        chest: { type: Number }, // Example: 42
        waist: { type: Number }, // Example: 36
        length: { type: Number }, // Example: 40
        shoulder: { type: Number }, // Example: 17
        sleeveLength: { type: Number } // Example: 24
    },
    stockStatus: { type: String }, // Example: 'In Stock'
    images: [{ type: String, required: true }], // Example: ['j_shalwar_kameez1.jpg', 'j_shalwar_kameez2.jpg']
    productUrl: { type: String }, // Example: 'http://example.com/product/JSMK12345'
    occasion: { type: String }, // Example: 'Formal'
    description: { type: String }, // Example: 'Elegant navy blue shalwar kameez for formal occasions.'
    scrapedAt: { type: Date, default: Date.now },
    type: { type: String, required: true, enum: ['Cloth', 'Shawl', 'Other'], default: 'Cloth' } // Example: 'Cloth'
}, { timestamps: true });

productSchema.index({ productId: 1, brand: 1 }, { unique: true });
productSchema.index({ category: 1, gender: 1, price: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
