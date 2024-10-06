const express = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const brandRoutes = require('./brandRoutes');
const closetRoutes = require('./closetRoutes');
const closetItemRoutes = require('./closetItemRoutes');
const trackingRoutes = require('./trackingRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const uploadRoutes = require('./uploadRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/brands', brandRoutes);
router.use('/closets', closetRoutes);
router.use('/closet-items', closetItemRoutes);
router.use('/tracking', trackingRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
