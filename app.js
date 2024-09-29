const express = require('express');
const app = express();

require('dotenv/config');
const api = process.env.API_URL;

const PORT = process.env.PORT || 5170;

app.get('/', (req, res) => {
    res.send('Welcome to MeriCloset Backend!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
