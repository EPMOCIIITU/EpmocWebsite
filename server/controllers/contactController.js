const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// Set up Nodemailer transporter (Fallback config if env vars are missing)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred service
  auth: {
    user: process.env.EMAIL_USER || 'epmoc.placeholder@gmail.com',
    pass: process.env.EMAIL_PASS || 'placeholder_app_password',
  },
});

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { senderId, messageData } = req.body;

    if (!senderId || !messageData) {
      return res.status(400).json({ message: 'Sender ID and Message Data are required' });
    }

    // 1. Save to Database
    const newMessage = await Message.create({ senderId, messageData });

    // 2. Forward via Email (non-blocking)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'epmoc@iiitu.ac.in', // Official email
        subject: `[EPMOC Website] New Contact Transmission from ${senderId}`,
        text: `SENDER_ID: ${senderId}\n\nMESSAGE_DATA:\n${messageData}\n\n---\nSystem Auto-Forward`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error('Email forwarding failed:', error);
      });
    } else {
      console.log('Skipping email forward: SMTP credentials missing in .env');
    }

    res.status(201).json({ message: 'Transmission successful', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Transmission failed', error: error.message });
  }
};

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private (Core, Head)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error: error.message });
  }
};

// @desc    Mark a message as read
// @route   PUT /api/contact/:id/read
// @access  Private (Core, Head)
const markMessageRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.isRead = true;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status', error: error.message });
  }
};

module.exports = {
  submitContactMessage,
  getMessages,
  markMessageRead
};
