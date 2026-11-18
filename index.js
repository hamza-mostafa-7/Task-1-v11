
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const Product = require('./models/product.model.js');
const productRoutes = require('./routes/product.route.js');
const eventRoutes = require('./routes/event.route.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Hello from node tut');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });
