const express = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const brandRoutes = require('./brandRoutes');
const closetRoutes = require('./closetRoutes');
const closetItemRoutes = require('./closetItemRoutes');
const trackingRoutes = require('./trackingRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const uploadRoutes = require('./uploadRoutes');
const categoryRoutes = require('./categoryRoutes');
const adminRoutes = require('./adminRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const chatbotRoutes = require('./chatbotroutes');
const imageUploadRoutes = require('./imageUploadRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/brands', brandRoutes);
router.use('/closets', closetRoutes);
router.use('/closet-items', closetItemRoutes);
router.use('/tracking', trackingRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/chat', chatbotRoutes);
router.use('/images', imageUploadRoutes);

module.exports = router;