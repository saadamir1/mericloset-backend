const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Schema for product items
const productSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: Number,
  quantity: Number,
});

// Define schema for CashOnDelivery orders (supporting both single & multiple items)
const codSchema = new mongoose.Schema({
  items: [productSchema], // now supports multiple wishlist items
  shipping: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
  },
  contact: {
    email: String,
    phone: String,
  },
  paymentMethod: {
    type: String,
    default: "cod",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create model
const CashOnDelivery = mongoose.model('CashOnDelivery', codSchema);

// For normal checkout (single item)
router.post('/cash-order', async (req, res) => {
  try {
    const order = new CashOnDelivery({
      items: [req.body.order], // wrap single item as array
      shipping: req.body.shipping,
      contact: req.body.contact,
      userId: req.body.userId || null,
    });
    await order.save();
    res.status(201).json({ message: 'COD order saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save COD order' });
  }
});

// For wishlist checkout (multiple items)
router.post('/wishlist-cash-order', async (req, res) => {
  try {
    const { items, shipping, contact, userId } = req.body;

    const order = new CashOnDelivery({
      items,
      shipping,
      contact,
      userId: userId || null,
    });

    await order.save();
    res.status(201).json({ message: 'Wishlist COD order saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save wishlist COD order' });
  }
});

module.exports = router;
