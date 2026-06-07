// 1. Load environment variables from the parent (root) directory .env file
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// 2. Connect to MongoDB Atlas
connectDB();

// 3. Initialize Express application
const app = express();

// 4. Global Middlewares
app.use(helmet()); // Security headers
app.use(express.json()); // Parse incoming JSON payloads
app.use(cookieParser()); // Parse cookies (for HttpOnly tokens)

// 5. CORS Configuration
// Allow HttpOnly cookies to be sent/received. Configured dynamically from .env
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// 6. Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running successfully!' });
});

// We will mount our routes here 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));

// 7. Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
