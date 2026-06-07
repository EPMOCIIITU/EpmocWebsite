const Registration = require('../models/Registration');

// @desc    Get all registrations for a specific event
// @route   GET /api/registrations/:eventId
// @access  Private (Core, Head)
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch registrations and populate user and team details
    const registrations = await Registration.find({ eventId })
      .populate('userId', 'email role')
      .populate({
        path: 'teamId',
        select: 'name inviteCode leaderId members',
        populate: { path: 'members leaderId', select: 'email' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
};

module.exports = {
  getEventRegistrations
};
