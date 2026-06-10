const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: { type: String, default: '' },
  rollNo: { type: String, default: '' },
  branch: { type: String, default: '' },
  department: { type: String, default: '' },
  year: { type: String, default: '' },
  memberDepartments: [{
    type: String,
    enum: ['Design', 'PR', 'Public Speaking and Marketing', 'Content', 'Technical', 'Social Media', 'Coverage and Video Editing', 'volunteering', 'Decoration']
  }],
  role: {
    type: String,
    enum: ['core', 'head', 'member', 'participant'],
    default: 'participant',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
