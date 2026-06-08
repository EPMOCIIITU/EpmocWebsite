const Registration = require('../models/Registration');
const Event = require('../models/Event');
const googleService = require('./googleService');

/**
 * Auto-syncs all registration data for an event to its Google Sheet.
 * Called automatically after every registration/team join.
 * Runs in background (fire-and-forget) so it doesn't block the API response.
 * @param {String} eventId 
 */
const autoSyncEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) return;

    const registrations = await Registration.find({ eventId })
      .populate('userId', 'email')
      .populate({
        path: 'teamId',
        populate: { path: 'members leaderId', select: 'email' }
      })
      .sort({ createdAt: 1 });

    if (registrations.length === 0) return;

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
        
        if (reg.mediaUrls && reg.mediaUrls.length > 0) {
          teamEntry.mediaUrls.push(...reg.mediaUrls);
        }

        const isLeader = reg.teamId.leaderId && 
          reg.teamId.leaderId._id.toString() === reg.userId._id.toString();
        
        if (isLeader) {
          teamEntry.leader = reg.userId.email;
        } else {
          teamEntry.members.push(reg.userId.email);
        }
      }

      const maxMembers = event.maxTeamSize - 1;
      const headers = ['Timestamp', 'Team Name', 'Invite Code', 'Leader Email'];
      for (let i = 1; i <= maxMembers; i++) {
        headers.push(`Member ${i} Email`);
      }
      headers.push('Logo/Media URL');

      const dataRows = [];
      for (const [, team] of teamMap) {
        const row = [
          new Date().toISOString(),
          team.teamName,
          team.inviteCode,
          team.leader || 'N/A'
        ];
        for (let i = 0; i < maxMembers; i++) {
          row.push(team.members[i] || '');
        }
        row.push(team.mediaUrls.join(', ') || '');
        dataRows.push(row);
      }

      flattenedRows = [headers, ...dataRows];

    } else {
      // --- INDIVIDUAL EVENT ---
      const headers = ['Timestamp', 'User Email', 'Custom Data', 'Media URL'];
      const dataRows = registrations.map(reg => [
        reg.createdAt ? new Date(reg.createdAt).toISOString() : '',
        reg.userId?.email || 'N/A',
        JSON.stringify(reg.customData || {}),
        (reg.mediaUrls || []).join(', ')
      ]);

      flattenedRows = [headers, ...dataRows];
    }

    await googleService.syncDataToSheet(event.googleSheetId, flattenedRows);
    console.log(`✅ Auto-synced ${flattenedRows.length - 1} rows to sheet for event: ${event.title}`);

  } catch (error) {
    // Silent fail — auto-sync should never crash the main flow
    console.error(`⚠️ Auto-sync failed for event ${eventId}:`, error.message);
  }
};

module.exports = { autoSyncEvent };
