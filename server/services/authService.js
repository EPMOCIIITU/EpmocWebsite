const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5m' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return {
    user: { id: user._id, email: user.email, role: user.role },
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  };
};

const registerUser = async (email, password, role, extendedData = {}) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { name, rollNo, branch, year } = extendedData;

  const user = await User.create({ 
    email, 
    password: hashedPassword, 
    role,
    name: name || '',
    rollNo: rollNo || '',
    branch: branch || '',
    year: year || ''
  });
  
  return { id: user._id, email: user.email, role: user.role };
};

const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    return generateAccessToken(decoded.id);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  loginUser,
  registerUser,
  refreshAccessToken
};
