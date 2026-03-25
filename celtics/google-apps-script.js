// ============================================================
// CELTICS GAMES TRACKER — Google Apps Script
// ============================================================
// Paste this into Extensions → Apps Script in your Google Sheet.
// Then: Deploy → New deployment → Web app → Execute as Me → Anyone → Deploy
// Copy the URL and paste it into SHEET_URL in script.js
// ============================================================

const SHEET_NAME = 'Sheet1'; // Change if your sheet tab has a different name

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = data[i][idx];
    });
    row._row = i + 1; // actual row number in sheet (1-indexed, skip header)
    rows.push(row);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', data: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const params = JSON.parse(e.postData.contents);
  const action = params.action;
  
  try {
    if (action === 'add') {
      sheet.appendRow([
        params.date,
        params.season,
        params.opponent,
        params.companion || '',
        params.celtics_score,
        params.opponent_score,
        params.result,
        params.overtime,
        params.tags || '',
        params.notes || ''
      ]);
      return respond({ status: 'ok', message: 'Game added' });
      
    } else if (action === 'edit') {
      const row = params._row;
      if (!row) return respond({ status: 'error', message: 'Missing _row' });
      const values = [
        params.date,
        params.season,
        params.opponent,
        params.companion || '',
        params.celtics_score,
        params.opponent_score,
        params.result,
        params.overtime,
        params.tags || '',
        params.notes || ''
      ];
      sheet.getRange(row, 1, 1, values.length).setValues([values]);
      return respond({ status: 'ok', message: 'Game updated' });
      
    } else if (action === 'delete') {
      const row = params._row;
      if (!row) return respond({ status: 'error', message: 'Missing _row' });
      sheet.deleteRow(row);
      return respond({ status: 'ok', message: 'Game deleted' });
      
    } else {
      return respond({ status: 'error', message: 'Unknown action: ' + action });
    }
  } catch (err) {
    return respond({ status: 'error', message: err.toString() });
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
