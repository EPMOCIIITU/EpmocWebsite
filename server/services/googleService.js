const { google } = require('googleapis');

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
    // 1. Create the Year/Event Folder in Drive
    // (Assuming a ROOT_DRIVE_FOLDER_ID is set in .env where the service account has access)
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

    // 2. Create the Google Sheet inside that newly created folder
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

module.exports = {
  createEventWorkspace
};
