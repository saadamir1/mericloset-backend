const mongoose = require('mongoose'); // ✅ Required for ObjectId conversion
const Tracking = require('../models/Tracking');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new tracking record
const createTracking = async (req, res) => {
  const { userId, productId, actionType, sessionId, device } = req.body;

  try {
    const tracking = new Tracking({
      user: userId,
      product: productId,
      actions: [{ actionType }],
      sessionId,
      device,
    });

    await tracking.save();
    res.status(201).json(tracking);
  } catch (error) {
    console.error('Error creating tracking record:', error.message, error.stack);
    res.status(500).json({ message: 'Error creating tracking record' });
  }
};

// Get all tracking records for a user
const getUserTracking = async (req, res) => {
  const { userId } = req.params;

  try {
    const trackingRecords = await Tracking.find({ user: userId }).populate('product');
    res.status(200).json(trackingRecords);
  } catch (error) {
    console.error('Error fetching tracking records:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching tracking records' });
  }
};

// Get a specific tracking record by ID
const getTrackingById = async (req, res) => {
  const { trackingId } = req.params;

  try {
    const tracking = await Tracking.findById(trackingId).populate('product');
    if (!tracking) {
      return res.status(404).json({ message: 'Tracking record not found' });
    }
    res.status(200).json(tracking);
  } catch (error) {
    console.error('Error fetching tracking record:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching tracking record' });
  }
};

// Update a tracking record
const updateTracking = async (req, res) => {
  const { trackingId } = req.params;
  const { actionType, isFavorite } = req.body;

  try {
    const updatedTracking = await Tracking.findByIdAndUpdate(
      trackingId,
      {
        isFavorite,
        $push: { actions: { actionType } },
      },
      { new: true }
    );

    if (!updatedTracking) {
      return res.status(404).json({ message: 'Tracking record not found' });
    }
    res.status(200).json(updatedTracking);
  } catch (error) {
    console.error('Error updating tracking record:', error.message, error.stack);
    res.status(500).json({ message: 'Error updating tracking record' });
  }
};

// Delete a tracking record
const deleteTracking = async (req, res) => {
  const { trackingId } = req.params;

  try {
    const deletedTracking = await Tracking.findByIdAndDelete(trackingId);
    if (!deletedTracking) {
      return res.status(404).json({ message: 'Tracking record not found' });
    }
    res.status(200).json({ message: 'Tracking record deleted successfully' });
  } catch (error) {
    console.error('Error deleting tracking record:', error.message, error.stack);
    res.status(500).json({ message: 'Error deleting tracking record' });
  }
};

// Collaborative Filtering: Find Similar Users
const getSimilarUsers = async (userId) => {
  try {
    const userTracking = await Tracking.find({ user: userId });
    const userProductIds = userTracking.map(record => record.product.toString());

    if (!userProductIds.length) return [];

    const similarUsers = await Tracking.aggregate([
      { $match: { product: { $in: userProductIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return similarUsers;
  } catch (error) {
    console.error('Error finding similar users:', error.message, error.stack);
    throw error;
  }
};

// Recommend Products Based on Similar Users
const recommendProducts = async (userId) => {
  try {
    console.log("Fetching recommendations for userId:", userId);

    const user = await User.findById(userId);
    console.log("User found:", user);

    if (!user || user.role !== 'customer') {
      console.warn("User is not eligible for recommendations.");
      throw new Error('Recommendations are only available for customers');
    }

    const userTracking = await Tracking.find({ user: userId });
    const userProductIds = userTracking.map(record => record.product.toString());

    if (!userProductIds.length) {
      console.log("No tracking data found for user.");
      return [];
    }

    const similarUsers = await getSimilarUsers(userId);
    const similarUserIds = similarUsers.map(user => user._id);

    if (!similarUserIds.length) {
      console.log("No similar users found.");
      return [];
    }

    const similarUserProductIds = await Tracking.aggregate([
      { $match: { user: { $in: similarUserIds } } },
      { $group: { _id: "$product", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const recommendedProductIds = similarUserProductIds
      .filter(product => !userProductIds.includes(product._id.toString()))
      .map(product => product._id);

    if (!recommendedProductIds.length) {
      console.log("No new recommended products found.");
      return [];
    }

    const recommendedProducts = await Product.find({ _id: { $in: recommendedProductIds } });
    return recommendedProducts;
  } catch (error) {
    console.error('Error recommending products:', error.message, error.stack);
    throw error;
  }
};

module.exports = {
  createTracking,
  getUserTracking,
  getTrackingById,
  updateTracking,
  deleteTracking,
  recommendProducts
};
