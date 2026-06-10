const https = require('https');

const getWebhookUrl = () => {
  return process.env.GOOGLE_APPS_SCRIPT_URL;
};

/**
 * Creates a folder in Google Drive and a Google Sheet inside it via Webhook.
 * @param {String} eventName 
 * @param {String} year 
 * @returns {Object} { driveFolderId, googleSheetId }
 */
const createEventWorkspace = async (eventName, year) => {
  const url = getWebhookUrl();
  const rootFolderId = process.env.GOOGLE_ROOT_FOLDER_ID;
  
  if (!url) {
    console.warn('⚠️ GOOGLE_APPS_SCRIPT_URL missing in .env. Returning mock IDs.');
    return {
      driveFolderId: `mock_drive_folder_${Date.now()}`,
      googleSheetId: `mock_sheet_id_${Date.now()}`
    };
  }

  try {
    const payload = JSON.stringify({
      action: 'create_workspace',
      eventName,
      year,
      rootFolderId
    });

    const data = await new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        // Apps Script redirects, so we must follow it if it's a 302
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https.get(res.headers.location, (redirectRes) => {
            let body = '';
            redirectRes.on('data', chunk => body += chunk);
            redirectRes.on('end', () => resolve(JSON.parse(body)));
          }).on('error', reject);
          return;
        }

        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    if (data.status !== 'success') throw new Error(data.message);

    return { 
      driveFolderId: data.driveFolderId, 
      googleSheetId: data.googleSheetId 
    };
  } catch (error) {
    console.error('Error creating Workspace via Webhook:', error);
    throw new Error('Failed to create Google Drive Folder or Sheet');
  }
};

/**
 * Uploads a file buffer to a specific Google Drive folder.
 * (Not using Webhook for large files due to payload limits, returning mock for now).
 */
const uploadFileToDrive = async (fileBuffer, mimeType, fileName, folderId) => {
  console.log('File upload currently bypasses Webhook. Mocking URL.');
  return `https://drive.google.com/mock/${fileName}_${Date.now()}`;
};

/**
 * Syncs all registration data for an event to its Google Sheet via Webhook.
 * @param {String} googleSheetId 
 * @param {Array} flattenedRows - 2D array [[header], [row1], [row2], ...]
 */
const syncDataToSheet = async (googleSheetId, flattenedRows) => {
  if (googleSheetId.startsWith('mock_')) {
    console.log('📋 [MOCK ID DETECTED] Skipping Webhook sync for mock sheet:', googleSheetId);
    return { synced: true, mock: true, rowCount: flattenedRows.length };
  }

  const url = getWebhookUrl();
  if (!url) {
    console.log('📋 [MOCK SYNC] Would have written', flattenedRows.length, 'rows to sheet:', googleSheetId);
    return { synced: true, mock: true, rowCount: flattenedRows.length };
  }

  try {
    const payload = JSON.stringify({
      action: 'sync_data',
      googleSheetId,
      rows: flattenedRows
    });

    const data = await new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https.get(res.headers.location, (redirectRes) => {
            let body = '';
            redirectRes.on('data', chunk => body += chunk);
            redirectRes.on('end', () => resolve(JSON.parse(body)));
          }).on('error', reject);
          return;
        }

        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    if (data.status !== 'success') throw new Error(data.message);

    return { synced: true, mock: false, rowCount: flattenedRows.length };
  } catch (error) {
    console.error('Error syncing to Webhook:', error);
    throw new Error('Failed to sync data to Google Sheet');
  }
};

module.exports = {
  createEventWorkspace,
  uploadFileToDrive,
  syncDataToSheet
};
