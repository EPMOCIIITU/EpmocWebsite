const Event = require('../models/Event');
const googleService = require('../services/googleService');

// @desc    Create a new event (Command Center)
// @route   POST /api/events
// @access  Private (Core, Head)
const createEvent = async (req, res) => {
  try {
    const { title, date, requiresTeam, minTeamSize, maxTeamSize, coverImage } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const eventYear = new Date(date).getFullYear().toString();

    // 1. Automatically generate Google Drive Folder & Google Sheet
    // This will return mock IDs if .env Google credentials are not set yet
    const { driveFolderId, googleSheetId } = await googleService.createEventWorkspace(title, eventYear);

    // 2. Save event to Database
    const event = await Event.create({
      title,
      date,
      requiresTeam: requiresTeam || false,
      minTeamSize: minTeamSize || 1,
      maxTeamSize: maxTeamSize || 1,
      coverImage: coverImage || '',
      googleSheetId,
      driveFolderId
    });

    res.status(201).json({
      message: 'Event created successfully along with Google Workspace',
      event
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents
};
