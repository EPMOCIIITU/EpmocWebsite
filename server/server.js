// 1. Load environment variables from the parent (root) directory .env file
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

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
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// 8. Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'EPMOC API Docs'
}));

// 7. Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
