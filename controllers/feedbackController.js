// controllers/FeedbackController.js

const Feedback = require('../models/FeedBack');

// Create and save feedback to MongoDB
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    // Basic validation
    if (!name || !email || !message || !rating) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newFeedback = new Feedback({
      name,
      email,
      message,
      rating,
    });

    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// Optional: Fetch all feedbacks (for admin)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};
