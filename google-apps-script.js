/**
 * ============================================================
 * SHOW GIFTS — Google Apps Script for Form Submissions
 * ============================================================
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a new Google Sheet (or use existing one)
 *    - Go to: https://sheets.google.com
 *    - Create a new spreadsheet
 *    - Name it something like "Show Gifts Form Submissions"
 *
 * 2. Create column headers in the first row:
 *    A: Timestamp
 *    B: Name
 *    C: Company
 *    D: Email
 *    E: Phone
 *    F: Service
 *    G: Message
 *
 * 3. Create a Google Apps Script:
 *    - In your Google Sheet, go to: Extensions > Apps Script
 *    - Delete any existing code and paste THIS entire file
 *    - IMPORTANT: Update the SHEET_ID variable below with your actual Google Sheet ID
 *      (Find it in your sheet's URL: docs.google.com/spreadsheets/d/{SHEET_ID}/edit)
 *
 * 4. Deploy as a Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Select "Web app"
 *    - Execute as: Your email address
 *    - Who has access: Anyone
 *    - Click "Deploy"
 *    - Copy the deployment URL (looks like: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec)
 *
 * 5. Update your website:
 *    - In script.js, replace 'GOOGLE_SCRIPT_ID' with the ID from the deployment URL
 *    - The ID is the part between /s/ and /exec
 *
 * ============================================================
 */

// =========== CONFIGURATION ===========
// Replace this with your actual Google Sheet ID
const SHEET_ID = '1YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Form Submissions'; // Sheet tab name

// =========== MAIN HANDLER ===========
function doPost(e) {
  try {
    // Get form data from the request
    const params = e.parameter;

    // Prepare row data
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowData = [
      timestamp,
      params.name || '',
      params.company || '',
      params.email || '',
      params.phone || '',
      params.service || '',
      params.message || ''
    ];

    // Get the spreadsheet and sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    const formSheet = sheet.getSheetByName(SHEET_NAME) || sheet.getActiveSheet();

    // Append the row to the sheet
    formSheet.appendRow(rowData);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Form submission received successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// =========== LOGGING FUNCTION ===========
// Optional: For debugging in Apps Script logs
function testFormSubmission() {
  const testData = {
    parameter: {
      name: 'Test User',
      company: 'Test Company',
      email: 'test@example.com',
      phone: '+91 98765 43210',
      service: 'Welcome Kits',
      message: 'This is a test submission'
    }
  };

  const result = doPost(testData);
  Logger.log('Test result: ' + result.getContent());
}

/**
 * Notes:
 * - The timestamp will be in IST (India Standard Time)
 * - All form fields are optional, but Name and Email are required by frontend validation
 * - The script automatically creates a new row with each submission
 * - If the sheet tab specified doesn't exist, it will use the active sheet
 * - Submissions are logged with a server-side timestamp for accuracy
 */
