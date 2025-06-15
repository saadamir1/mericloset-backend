const express = require("express");
const router = express.Router();
const FeedbackProduct = require("../models/FeedbackProduct");

// ✅ Debug log to confirm route is mounted
console.log("📩 feedbackProductsRoutes mounted");

// POST: Submit product review
router.post("/", async (req, res) => {
  try {
    const { userId, productId, name, email, rating, review } = req.body;

    if (!userId || !productId || !rating || !review) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const feedback = new FeedbackProduct({
      userId,
      productId,
      name,
      email,
      rating,
      review,
    });

    await feedback.save();
    res.status(201).json({ message: "Review saved successfully" });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
