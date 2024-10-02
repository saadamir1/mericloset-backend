const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/index');

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

require('dotenv/config');
const api = process.env.API_URL;

const PORT = process.env.PORT || 5170;

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log("Database connection successful!"))
    .catch((err) => console.log(err));

// Use the routes with the base API path
app.use(api, routes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
