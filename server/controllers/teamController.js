const Team = require('../models/Team');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { autoSyncEvent } = require('../services/syncService');
// Custom invite code generator to avoid crypto dependencies
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Create a new team for an event
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { eventId, name } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!eventId || !name) {
      return res.status(400).json({ message: 'Event ID and Team Name are required' });
    }

    // 1. Check if event exists and requires a team
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!event.requiresTeam) return res.status(400).json({ message: 'This event does not allow teams' });

    // 2. Check if user is already registered for this event (Compound Index protection)
    const existingReg = await Registration.findOne({ eventId, userId });
    if (existingReg) {
      return res.status(400).json({ message: 'You are already registered or part of a team for this event' });
    }

    // 3. Generate a unique 6-character invite code
    const inviteCode = generateInviteCode();

    // 4. Create the Team
    const team = await Team.create({
      name,
      leaderId: userId,
      members: [userId], // Leader is inherently the first member
      inviteCode,
      eventId
    });

    // 5. Create the Registration to lock the user's participation
    await Registration.create({
      eventId,
      userId,
      teamId: team._id,
      customData: { roleInTeam: 'Leader' }
    });

    res.status(201).json({
      message: 'Team created successfully',
      team
    });

    // Fire-and-forget: auto-sync to Google Sheet in background
    autoSyncEvent(eventId);

  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error: error.message });
  }
};

// @desc    Join an existing team using an invite code
// @route   POST /api/teams/join
// @access  Private
const joinTeam = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    if (!inviteCode) return res.status(400).json({ message: 'Invite code is required' });

    // 1. Find the team
    const team = await Team.findOne({ inviteCode });
    if (!team) return res.status(404).json({ message: 'Invalid invite code' });

    // 2. Find the event to check size limits
    const event = await Event.findById(team.eventId);
    if (!event) return res.status(404).json({ message: 'Associated event not found' });

    // 3. Check if team is full
    if (team.members.length >= event.maxTeamSize) {
      return res.status(400).json({ message: 'Team has reached its maximum capacity' });
    }

    // 4. Check if user is already in THIS team or another team for the same event
    const existingReg = await Registration.findOne({ eventId: event._id, userId });
    if (existingReg) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // 5. Add user to team members
    team.members.push(userId);
    await team.save();

    // 6. Create Registration for the new member
    await Registration.create({
      eventId: event._id,
      userId,
      teamId: team._id,
      customData: { roleInTeam: 'Member' }
    });

    res.status(200).json({
      message: 'Successfully joined the team',
      team
    });

    // Fire-and-forget: auto-sync to Google Sheet in background
    autoSyncEvent(event._id);

  } catch (error) {
    res.status(500).json({ message: 'Error joining team', error: error.message });
  }
};

module.exports = {
  createTeam,
  joinTeam
};
