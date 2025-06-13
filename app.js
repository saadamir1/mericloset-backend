// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Custom Middleware & Helpers
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/index');
const authJwt = require('./helpers/jwt');
const errorhandler = require('./helpers/error-handler');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const stripeRoutes = require('./routes/stripeRoutes');      // ✅ Stripe checkout
const cashOrderRoutes = require('./routes/cashOrderRoutes'); // ✅ COD orders

// Environment Variables
const corsOrigin = process.env.CORS_ORIGIN || '*';
const api = process.env.API_URL || '/api/v1';
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: corsOrigin }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
// app.use(authJwt()); // Uncomment when enabling JWT auth
app.use(errorhandler);

// Serve static image uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log('✅ Database connection successful!'))
  .catch((err) => console.error('❌ Database connection failed:', err));

// Health Check Route
app.get('/', (req, res) => {
  res.send('🎉 MeriCloset backend is live and connected!');
});

// API Routes
app.use(api, routes);
app.use('/', stripeRoutes);       // Stripe Checkout
app.use('/', cashOrderRoutes);    // Cash On Delivery Order Saving

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
