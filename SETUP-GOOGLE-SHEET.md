# Saving submissions to a Google Sheet

The test sends each submission to a Google Sheet first. If that fails, it falls back to Web3Forms email.
Until `SHEET_URL` in `app.js` is filled in, only Web3Forms is used.

## One-time setup (about 5 minutes)

1. Go to <https://sheets.new> and name the new sheet, for example **IELTS Reading – Submissions**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the sample code, paste in everything from [`google-apps-script.gs`](google-apps-script.gs), and press **Save** (💾).
4. Press **Deploy → New deployment**. Click the gear icon next to "Select type" and choose **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Press **Deploy**. Google asks you to authorise the script: choose your account, then **Advanced → Go to (project name) (unsafe) → Allow**.
   (This warning appears for every personal script. It only lets the script write to this sheet and send email from your account.)
6. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy.../exec`.
7. Put that URL in `app.js` as `var SHEET_URL='...';` (or send it to Claude to do it).

To check the deployment, open the Web app URL in a browser. It should show
`{"success":true,"message":"IELTS submissions endpoint is running."}`.

## What you get

- A **Submissions** tab with one row per student: time, name, score, band, part scores, time per part,
  unanswered count, highlight and note counts, every answer (green = correct, red = wrong, yellow = half marks on Q25–26)
  and the full report.
- An email for each submission from your own Gmail (set `SEND_EMAIL = false` at the top of the script to turn this off).
  Gmail allows about 100 of these per day; rows are still saved after that.

## If you change the script later

Use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. This keeps the same URL.
Creating a *new* deployment gives a new URL, which would then need to go into `app.js`.
