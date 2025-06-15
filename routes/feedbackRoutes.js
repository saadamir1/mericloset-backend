// routes/feedbackRoutes.js

const express = require("express");
const router = express.Router();
const Feedback = require("../models/FeedBack");

// POST /api/v1/feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    if (!name || !email || !message || !rating) {
      return res.status(400).json({
        success: false,
        error: "All fields (name, email, message, rating) are required.",
      });
    }

    const feedback = new Feedback({ name, email, message, rating });
    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("Error saving feedback:", error.message);
    res.status(500).json({ success: false, error: "Internal server error. Please try again later." });
  }
});

module.exports = router;
