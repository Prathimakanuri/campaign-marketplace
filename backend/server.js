const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import routes
const auth = require('./routes/authRoutes');
const campaign = require('./routes/campaignRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend connectivity

// Mount routes
app.use('/api/auth', auth);
app.use('/api/campaign', campaign);

// API Health Check
app.get('/', (req, res) => {
    res.send('Campaign Marketplace API is running...');
});

// Centralized error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle server shutdown on unhandled rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
