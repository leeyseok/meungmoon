import 'server-only'
import { google } from 'googleapis'

function loadCredentials() {
  const json = process.env.GOOGLE_SA_CREDENTIALS!
  return JSON.parse(json)
}

export async function readSheet(range: string) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  if (!spreadsheetId) throw new Error('Missing env: GOOGLE_SHEET_ID')

  const credentials = loadCredentials()

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range })
  return res.data.values ?? []
}
