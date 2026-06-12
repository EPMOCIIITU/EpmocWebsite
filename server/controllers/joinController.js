const JoinRequest = require('../models/JoinRequest');

const submitJoinRequest = async (req, res) => {
  try {
    const { contactNumber, requestMessage } = req.body;
    
    if (!contactNumber || !requestMessage) {
      return res.status(400).json({ message: 'Contact number and message are required' });
    }

    const newRequest = await JoinRequest.create({
      userId: req.user._id,
      contactNumber, 
      requestMessage
    });

    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJoinRequests = async (req, res) => {
  try {
    // Populate user info so core can see who requested
    const requests = await JoinRequest.find().populate('userId', 'name email rollNo branch year').sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitJoinRequest, getJoinRequests };
