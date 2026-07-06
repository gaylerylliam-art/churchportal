# Ciencia Y Amor Church Events and Financial Transparency Portal

This is a mobile-friendly working prototype for managing church activities, budgets, fund releases, receipt uploads, mock AI invoice extraction, treasury validation, liquidation reports, audit logs, and transparency reports.

Open `index.html` in a browser to use the prototype. No installation or backend is required.

## Sample Accounts

- Admin: `admin@cienciayamorchurch.org` / `password123`
- Board of Directors: `board@cienciayamorchurch.org` / `password123`
- Treasury Officer: `treasury@cienciayamorchurch.org` / `password123`
- District Leader: `districtleader@cienciayamorchurch.org` / `password123`

## Prototype Notes

- Data is stored in memory for the current browser session unless Supabase is configured.
- Receipt extraction uses a mock AI response and keeps the fields editable before submission.
- Report export creates a CSV file. Print view is available from the Reports page.
- The Supabase database schema is in `supabase/schema.sql`.
- To connect the browser prototype to Supabase, copy `config.example.js` to `config.js` and set your Supabase project URL plus anon or publishable key. `config.js` and `.env` are ignored by Git.
- The browser backend adapter is in `supabaseClient.js`; if Supabase is not configured, the app stays in mock mode.
