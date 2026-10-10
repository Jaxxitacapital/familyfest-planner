# FamilyFest Planner 2.0

A Kenyan school-family cooking/event planner with:
- live KSh budgeting
- Kenyan meals and seeded local prices
- meal photos
- budget-based meal recommendations
- editable planned/actual prices
- shopping checklist
- spending analytics
- online recipe search via TheMealDB
- optional Google Programmable Search through the Express server
- music lobby / queue
- print-friendly event report
- local browser persistence

## Requirements

- Node.js 20+
- npm 10+

## Run

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:4000

## Optional Google search

Create `server/.env`:

```env
PORT=4000
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX=your_programmable_search_engine_id
```

The Google credentials stay on the server and are never sent to the browser.

If Google credentials are not configured, the app still works and can use:
- its local Kenyan meal database
- TheMealDB recipe search

## TheMealDB

The app uses TheMealDB's free development endpoint for online recipe search and meal images. For a public/commercial deployment, check their current API terms and production/supporter requirements.

## Data model

Local prices are deliberately editable because Kenyan food prices vary by location and date. Each price has:
- unit
- planned price
- category
- source
- updated date

The app uses the event's local edited price as the calculation source.

## Main upgrade points

1. `client/src/data/kenyanMeals.js` - local meals and recipes
2. `client/src/data/prices.js` - editable seed prices
3. `server/index.js` - online recipe and Google search integration
4. `client/src/App.jsx` - application logic and UI
5. `client/src/styles.css` - design

## Production roadmap

- PostgreSQL/Supabase for shared events
- user accounts
- authenticated organizers
- price history by market/location
- receipt scanning
- real-time collaborative shopping checklist
- Google Places/Maps if shopping locations are added
- Spotify/YouTube integrations with their official APIs
- stronger recipe source attribution/caching
