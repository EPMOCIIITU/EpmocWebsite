const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Team = require('../models/Team');
const googleService = require('../services/googleService');
const { autoSyncEvent } = require('../services/syncService');

// @desc    Get all registrations for a specific event
// @route   GET /api/registrations/:eventId
// @access  Private (Core, Head)
const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

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

// @desc    Create a new registration (individual event, no team)
// @route   POST /api/registrations
// @access  Private
const createRegistration = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId, customData } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // 2. If event requires team, reject individual registration
    if (event.requiresTeam) {
      return res.status(400).json({ 
        message: 'This event requires a team. Please create or join a team first.' 
      });
    }

    // 3. Check if user already registered
    const existingReg = await Registration.findOne({ eventId, userId });
    if (existingReg) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    // 4. Handle file upload if present
    let mediaUrl = null;
    if (req.file) {
      const fileName = `${Date.now()}_${req.file.originalname}`;
      mediaUrl = await googleService.uploadFileToDrive(
        req.file.buffer,
        req.file.mimetype,
        fileName,
        event.driveFolderId
      );
    }

    // 5. Parse customData if it's a JSON string (from multipart/form-data)
    let parsedCustomData = {};
    if (customData) {
      try {
        parsedCustomData = typeof customData === 'string' ? JSON.parse(customData) : customData;
      } catch (e) {
        parsedCustomData = { rawData: customData };
      }
    }

    // 6. Create Registration
    const registration = await Registration.create({
      eventId,
      userId,
      customData: parsedCustomData,
      mediaUrls: mediaUrl ? [mediaUrl] : []
    });

    res.status(201).json({
      message: 'Registration successful',
      registration
    });

    // Fire-and-forget: auto-sync to Google Sheet in background
    autoSyncEvent(eventId);

  } catch (error) {
    res.status(500).json({ message: 'Error creating registration', error: error.message });
  }
};

// @desc    Sync all event registrations to Google Sheet (Option B: On-demand)
// @route   POST /api/registrations/:eventId/sync
// @access  Private (Core, Head)
const syncToSheet = async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Get the event (for sheet ID and team info)
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // 2. Get all registrations with populated data
    const registrations = await Registration.find({ eventId })
      .populate('userId', 'email')
      .populate({
        path: 'teamId',
        populate: { path: 'members leaderId', select: 'email' }
      })
      .sort({ createdAt: 1 });

    if (registrations.length === 0) {
      return res.status(400).json({ message: 'No registrations to sync' });
    }

    // 3. Flatten data into rows
    let flattenedRows;

    if (event.requiresTeam) {
      // --- TEAM EVENT: Group by team, flatten into Leader + Members ---
      const teamMap = new Map();
      
      for (const reg of registrations) {
        if (!reg.teamId) continue;
        const teamId = reg.teamId._id.toString();
        
        if (!teamMap.has(teamId)) {
          teamMap.set(teamId, {
            teamName: reg.teamId.name || 'Unnamed',
            inviteCode: reg.teamId.inviteCode || '',
            leader: null,
            members: [],
            customData: reg.customData || {},
            mediaUrls: []
          });
        }

        const teamEntry = teamMap.get(teamId);
        
        // Collect all media URLs
        if (reg.mediaUrls && reg.mediaUrls.length > 0) {
          teamEntry.mediaUrls.push(...reg.mediaUrls);
        }

        // Determine if this user is the leader or a member
        const isLeader = reg.teamId.leaderId && 
          reg.teamId.leaderId._id.toString() === reg.userId._id.toString();
        
        if (isLeader) {
          teamEntry.leader = reg.userId.email;
        } else {
          teamEntry.members.push(reg.userId.email);
        }
      }

      // Build header row dynamically based on max team size
      const maxMembers = event.maxTeamSize - 1; // minus leader
      const headers = ['Timestamp', 'Team Name', 'Invite Code', 'Leader Email'];
      for (let i = 1; i <= maxMembers; i++) {
        headers.push(`Member ${i} Email`);
      }
      headers.push('Logo/Media URL');

      // Build data rows
      const dataRows = [];
      for (const [, team] of teamMap) {
        const row = [
          new Date().toISOString(),
          team.teamName,
          team.inviteCode,
          team.leader || 'N/A'
        ];
        // Fill member slots
        for (let i = 0; i < maxMembers; i++) {
          row.push(team.members[i] || '');
        }
        row.push(team.mediaUrls.join(', ') || '');
        dataRows.push(row);
      }

      flattenedRows = [headers, ...dataRows];

    } else {
      // --- INDIVIDUAL EVENT: One row per registration ---
      const headers = ['Timestamp', 'User Email', 'Custom Data', 'Media URL'];
      const dataRows = registrations.map(reg => [
        reg.createdAt ? new Date(reg.createdAt).toISOString() : '',
        reg.userId?.email || 'N/A',
        JSON.stringify(reg.customData || {}),
        (reg.mediaUrls || []).join(', ')
      ]);

      flattenedRows = [headers, ...dataRows];
    }

    // 4. Sync to Google Sheet
    const result = await googleService.syncDataToSheet(event.googleSheetId, flattenedRows);

    res.status(200).json({
      message: 'Data synced to Google Sheet successfully',
      ...result
    });

  } catch (error) {
    res.status(500).json({ message: 'Error syncing to sheet', error: error.message });
  }
};

module.exports = {
  getEventRegistrations,
  createRegistration,
  syncToSheet
};
