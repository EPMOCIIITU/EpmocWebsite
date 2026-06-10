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

    const dateObj = new Date(date);
    const eventYear = dateObj.getFullYear().toString();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const cleanTitle = title.replace(/\s+/g, '');
    const customEventId = `${cleanTitle}-${month}-${eventYear}`;

    // Ensure no two events have the same custom ID
    const existingEvent = await Event.findById(customEventId);
    if (existingEvent) {
      return res.status(400).json({ message: 'An event with this ID already exists' });
    }

    // 1. Automatically generate Google Drive Folder & Google Sheet
    // This will return mock IDs if .env Google credentials are not set yet
    const { driveFolderId, googleSheetId } = await googleService.createEventWorkspace(title, eventYear);

    // 2. Save event to Database
    const event = await Event.create({
      _id: customEventId,
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

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Core, Head)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Update fields
    const fieldsToUpdate = ['title', 'date', 'venue', 'description', 'coverImage', 'driveGalleryLink', 'requiresTeam', 'minTeamSize', 'maxTeamSize'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Core)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.deleteOne();
    res.status(200).json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
