const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))



require('dotenv/config');
const api = process.env.API_URL;

const PORT = process.env.PORT || 5170;

mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log("Database connection successful!"))
    .catch((err) => console.log(err))

const productRoutes = require('./routes/productRoutes');
app.use(api, productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
