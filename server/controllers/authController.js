const authService = require('../services/authService');

// Helper to set cookies securely
const setCookies = (res, accessToken, refreshToken) => {
  // Use secure: true in production (HTTPS)
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 5 * 60 * 1000 // 5 minutes
  });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    setCookies(res, accessToken, refreshToken);
    
    // Send user info (without token) for frontend state
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const newAccessToken = authService.refreshAccessToken(refreshToken);
    setCookies(res, newAccessToken); // Only update access token, keep old refresh token

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Simplified register method (typically restricted or used for participants)
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await authService.registerUser(email, password, role || 'participant');
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { login, refresh, logout, register };
