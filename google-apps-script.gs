/**
 * Receives IELTS Reading test submissions from the website and saves each one as a row
 * in the "Submissions" tab of this Google Sheet. Setup steps: see SETUP-GOOGLE-SHEET.md.
 */

// true = also email you each submission (from your own Gmail, up to about 100 emails a day).
var SEND_EMAIL = true;
// Leave empty to email the Google account that owns this script, or type another address.
var EMAIL_TO = '';

var SHEET_NAME = 'Submissions';
var FIXED = ['Submitted at', 'Student', 'Score /40', 'Band', 'Part 1 /13', 'Part 2 /13', 'Part 3 /14',
  'Total time', 'Part 1 time', 'Part 2 time', 'Part 3 time', 'Unanswered', 'How submitted',
  'Highlights (passages)', 'Highlights (questions)', 'Notes'];
var GREEN = '#d9f2dd', RED = '#f8d7d4', YELLOW = '#fff1c2';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var p = e.parameter;
    var answers = JSON.parse(p.answers || '[]');
    var sheet = getSheet_(answers);
    var row = [new Date(), txt_(p.name), Number(p.score), Number(p.band), Number(p.part1_score), Number(p.part2_score),
      Number(p.part3_score), txt_(p.total_time), txt_(p.part_1_time), txt_(p.part_2_time), txt_(p.part_3_time), Number(p.unanswered),
      p.how, Number(p.highlights_passages), Number(p.highlights_questions), Number(p.notes)];
    answers.forEach(function (a) { row.push(a.v === '' ? '(blank)' : txt_(a.v)); });
    row.push(txt_(p.message));
    sheet.appendRow(row);
    var r = sheet.getLastRow();
    var colours = answers.map(function (a) { return a.pts >= a.max ? GREEN : (a.pts > 0 ? YELLOW : RED); });
    if (colours.length) sheet.getRange(r, FIXED.length + 1, 1, colours.length).setBackgrounds([colours]);
    if (SEND_EMAIL) {
      try {
        MailApp.sendEmail(EMAIL_TO || Session.getEffectiveUser().getEmail(),
          'IELTS Reading Test: ' + p.name + ' - ' + p.score + '/40 (Band ' + p.band + ')', p.message);
      } catch (mailErr) { /* the row is saved even if the email quota is used up */ }
    }
    return json_({ success: true });
  } catch (err) {
    return json_({ success: false, message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web app URL in a browser to check that it is deployed.
function doGet() { return json_({ success: true, message: 'IELTS submissions endpoint is running.' }); }

function getSheet_(answers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    var head = FIXED.concat(answers.map(function (a) { return 'Q' + a.q; }), ['Full report']);
    sheet.appendRow(head);
    sheet.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#FFDDB8');
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(2);
  }
  return sheet;
}

// The leading apostrophe makes Sheets keep the value as plain text (no formulas, dates or TRUE/FALSE booleans).
function txt_(v) { return "'" + String(v == null ? '' : v); }

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
