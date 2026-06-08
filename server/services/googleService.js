const { google } = require('googleapis');
const { Readable } = require('stream');

const getAuthClient = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    console.warn('⚠️ Google Service Account credentials missing in .env. Skipping actual Google API calls.');
    return null;
  }

  return new google.auth.JWT(
    email,
    null,
    privateKey.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
  );
};

/**
 * Creates a folder in Google Drive and a Google Sheet inside it.
 * @param {String} eventName 
 * @param {String} year 
 * @returns {Object} { driveFolderId, googleSheetId }
 */
const createEventWorkspace = async (eventName, year) => {
  const auth = getAuthClient();
  
  // If no credentials, return mock IDs so the DB can still save the event
  if (!auth) {
    return {
      driveFolderId: `mock_drive_folder_${Date.now()}`,
      googleSheetId: `mock_sheet_id_${Date.now()}`
    };
  }

  const drive = google.drive({ version: 'v3', auth });
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const rootFolderId = process.env.GOOGLE_ROOT_FOLDER_ID;
    let parents = [];
    if (rootFolderId) parents.push(rootFolderId);

    const folderMetadata = {
      name: `${year} - ${eventName}`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parents
    };

    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });
    const driveFolderId = folder.data.id;

    const sheetMetadata = {
      properties: {
        title: `${eventName} Registrations`,
      }
    };
    
    const spreadsheet = await sheets.spreadsheets.create({
      resource: sheetMetadata,
      fields: 'spreadsheetId'
    });
    const googleSheetId = spreadsheet.data.spreadsheetId;

    // Move the sheet into the folder
    await drive.files.update({
      fileId: googleSheetId,
      addParents: driveFolderId,
      fields: 'id, parents'
    });

    return { driveFolderId, googleSheetId };

  } catch (error) {
    console.error('Error creating Google Workspace:', error);
    throw new Error('Failed to create Google Drive Folder or Sheet');
  }
};

/**
 * Uploads a file buffer to a specific Google Drive folder.
 * @param {Buffer} fileBuffer - The file data from multer
 * @param {String} mimeType - e.g. 'image/png'
 * @param {String} fileName - e.g. 'team_logo.png'
 * @param {String} folderId - The Google Drive folder ID
 * @returns {String} Public URL of the uploaded file
 */
const uploadFileToDrive = async (fileBuffer, mimeType, fileName, folderId) => {
  const auth = getAuthClient();

  if (!auth) {
    // Return a mock URL when credentials aren't set
    return `https://drive.google.com/mock/${fileName}_${Date.now()}`;
  }

  const drive = google.drive({ version: 'v3', auth });

  try {
    // Convert buffer to readable stream for Google API
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId]
      },
      media: {
        mimeType,
        body: stream,
      },
      fields: 'id, webViewLink'
    });

    // Make the file publicly viewable
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    return response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`;

  } catch (error) {
    console.error('Error uploading file to Drive:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Syncs all registration data for an event to its Google Sheet.
 * Called on-demand by Admin from the Command Center (Option B).
 * @param {String} googleSheetId 
 * @param {Array} flattenedRows - 2D array [[header], [row1], [row2], ...]
 */
const syncDataToSheet = async (googleSheetId, flattenedRows) => {
  const auth = getAuthClient();

  if (!auth) {
    console.log('📋 [MOCK SYNC] Would have written', flattenedRows.length, 'rows to sheet:', googleSheetId);
    return { synced: true, mock: true, rowCount: flattenedRows.length };
  }

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    // Clear existing data first
    await sheets.spreadsheets.values.clear({
      spreadsheetId: googleSheetId,
      range: 'Sheet1',
    });

    // Write all rows at once
    await sheets.spreadsheets.values.update({
      spreadsheetId: googleSheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: flattenedRows
      }
    });

    return { synced: true, mock: false, rowCount: flattenedRows.length };

  } catch (error) {
    console.error('Error syncing to Google Sheet:', error);
    throw new Error('Failed to sync data to Google Sheet');
  }
};

module.exports = {
  createEventWorkspace,
  uploadFileToDrive,
  syncDataToSheet
};
