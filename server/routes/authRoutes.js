const express = require('express');
const router = express.Router();
const { login, refresh, logout, register } = require('../controllers/authController');

// Define rate limiting specifically for auth routes to prevent brute-force attacks
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { message: 'Too many login attempts, please try again later.' }
});

router.post('/login', loginLimiter, login);
router.post('/register', register); // You can protect this later if needed
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
