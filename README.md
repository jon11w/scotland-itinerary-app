# Trip Itinerary App

A beautiful, mobile-first React app for sharing a private city break itinerary. Features a simple password login, AI-generated location descriptions, Unsplash photos, and Google Maps deep links.

---

## Quick Start

### 1. Install dependencies

Make sure you have **Node.js 18+** installed. Then:

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Customise Your Itinerary

Edit **`src/data/itinerary.js`** — this is the only file you need to touch:

### Change the trip details
```js
export const TRIP_CONFIG = {
  title: "Weekend in Rome",
  subtitle: "La dolce vita",
  coverImage: "https://images.unsplash.com/...",   // Paste any Unsplash image URL
  destination: "Rome, Italy",
};
```

### Change the login credentials
```js
export const AUTH = {
  username: "myusername",
  password: "mysecretpassword",
};
```

### Add / edit itinerary items
Each event looks like this:
```js
{
  id: "evt-1",             // Unique ID (any string)
  time: "14:00",           // Display time
  type: "sightseeing",     // See types below
  name: "Colosseum",       // Display name
  location: "Piazza del Colosseo, 1, 00184 Rome, Italy",  // Full address for Maps
  locationQuery: "Colosseum Rome",  // Short search term for Unsplash image
  notes: "Book tickets online in advance to skip the queue.",  // Optional tip
}
```

**Available event types:** `sightseeing` · `dining` · `arrival` · `departure` · `experience` · `shopping`

---

## Setting Up AI Descriptions (Claude API)

The app calls the Claude API to generate descriptions. To enable this:

1. Get an API key from https://console.anthropic.com
2. Create a file called `.env` in the project root:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-...
   ```
3. In `src/components/EventCard.jsx`, update the fetch headers:
   ```js
   headers: {
     'Content-Type': 'application/json',
     'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
     'anthropic-version': '2023-06-01',
     'anthropic-dangerous-direct-browser-access': 'true',
   }
   ```

> **Note:** For a private/personal app, direct API keys are fine. For a public app, route through a serverless function.

---

## Setting Up Photos (Unsplash API)

1. Create a free account at https://unsplash.com/developers
2. Create a new application to get an **Access Key**
3. In `src/components/EventCard.jsx`, replace:
   ```js
   const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_KEY';
   ```
   with your actual key.

If you skip this step, the app will use Unsplash's free source URLs as a fallback (slightly less targeted images, but still works).

---

## Deploy to Netlify

### Option A: Drag & Drop (easiest)

1. Build the app:
   ```bash
   npm run build
   ```
2. Go to https://netlify.com and sign up (free)
3. Drag the **`dist/`** folder onto the Netlify dashboard
4. Done — you'll get a live URL instantly!

### Option B: Connect GitHub (recommended for updates)

1. Push this project to a GitHub repository
2. In Netlify: **Add new site → Import an existing project → GitHub**
3. Select your repo
4. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. If using environment variables, add them in **Site settings → Environment variables**
6. Click **Deploy site**

Every time you push to GitHub, Netlify will automatically redeploy.

---

## Adding Environment Variables on Netlify

In your Netlify site: **Site configuration → Environment variables → Add variable**

| Key | Value |
|-----|-------|
| `VITE_ANTHROPIC_API_KEY` | `sk-ant-...` |
| `VITE_UNSPLASH_ACCESS_KEY` | `your_unsplash_key` |

Then update `EventCard.jsx` to read from `import.meta.env.VITE_UNSPLASH_ACCESS_KEY`.

---

## File Structure

```
itinerary-app/
├── src/
│   ├── data/
│   │   └── itinerary.js      ← EDIT THIS to customise your trip
│   ├── components/
│   │   ├── LoginPage.jsx     ← Login screen
│   │   ├── ItineraryView.jsx ← Main itinerary layout
│   │   ├── DaySection.jsx    ← Collapsible day group
│   │   └── EventCard.jsx     ← Individual event with photos & AI desc
│   ├── App.jsx               ← Auth state management
│   ├── main.jsx              ← React entry point
│   └── index.css             ← Global styles & design tokens
├── index.html
├── vite.config.js
├── netlify.toml              ← Netlify SPA routing config
└── package.json
```
