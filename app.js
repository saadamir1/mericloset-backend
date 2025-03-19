require('dotenv/config');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/index');
const authJwt = require('./helpers/jwt');
const errorhandler = require('./helpers/error-handler');

// Use environment variables
const corsOrigin = process.env.CORS_ORIGIN;
const api = process.env.API_URL;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: corsOrigin }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
// app.use(authJwt());
app.use(errorhandler);

// Other middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => console.log("Database connection successful!"))
  .catch((err) => console.log(err));

// Routes
app.use(api, routes);

// Error handler (should be last middleware)
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('🎉 MeriCloset backend is live and connected!');
  });


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
