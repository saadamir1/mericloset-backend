require('dotenv/config');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/index');
const authJwt = require('./helpers/jwt')
const errorhandler = require('./helpers/error-handler')
const corsOrigin = process.env.CORS_ORIGIN

// Middleware
app.use(cors({ origin: corsOrigin })); // only allow API requests from our frontend's specific port
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorhandler);

// Other middlewares for handling form submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = process.env.API_URL;
const PORT = process.env.PORT;

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




