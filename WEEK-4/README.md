# Week 4 – React Basics: Movie Search App

This folder contains a complete React + Vite project for the Week 4 assignment: a Movie Search App using the OMDb API.

## 🎯 Learning Objectives
- Understand React components and JSX
- Use props and state (`useState`, `useEffect`)
- Handle events (clicks, inputs, form-like interactions)
- Learn React rendering and the Virtual DOM at a high level
- Compose small, reusable UI components
- Structure a small React project effectively

## 🧩 Project Features
- Search movies by title (OMDb API)
- Show list of results with poster, title, and year
- Click a movie card to view details in a modal
- Pagination for next/previous results
- Simple, responsive CSS (no external UI frameworks)
- API key handled via environment variable or runtime input with localStorage persistence

## 🛠 Tools & Tech
- React 18 + Vite + TypeScript
- Editor: VS Code
- Version Control: Git + GitHub
- Deployment: Vercel or GitHub Pages

## 📦 Project Structure
```
WEEK-4/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  src/
    App.tsx
    main.tsx
    styles.css
    api.ts
    types.ts
    components/
      MovieCard.tsx
      MovieDetailsModal.tsx
      MovieList.tsx
      SearchBar.tsx
```

## 🔑 OMDb API Key
You need a free OMDb API key to search. Get one at https://www.omdbapi.com.

Two ways to use your key:
1) .env file (recommended for local dev)
   - Copy `.env.example` to `.env` and put your key:
     - `VITE_OMDB_API_KEY=your_key_here`
2) In-app input
   - Enter the key in the input at the top of the app. It will be stored in `localStorage` for convenience.

## ▶️ Run locally
PowerShell commands:

```
# From the repository root
cd .\WEEK-4
npm install

# Option A: Use .env file with VITE_OMDB_API_KEY
# Create .env and set your key (see above), then:
npm run dev

# Option B: Run dev, then paste your API key into the app input field
npm run dev
```

Open the printed local URL (usually http://localhost:5173) in your browser.

## 🧪 Manual test checklist
- Enter API key at top, or set `.env` first
- Search for a common title (e.g., "Batman")
- See grid of results with posters
- Click a card to open details modal
- Navigate pages with Prev/Next
- Try an unknown title to see empty state

## 🚀 Deploy

### Vercel (recommended)
- Import the repository on Vercel
- Set an environment variable `VITE_OMDB_API_KEY` in Project Settings → Environment Variables
- Deploy. Vercel will build with `npm run build` and serve `dist/`

### GitHub Pages
Option A: Deploy the WEEK-4 folder as a separate project (with root at WEEK-4). In that case, no extra base config is needed.

Option B: Serve from a subpath (e.g., `username.github.io/WEBZENITH-BOOTCAMP/WEEK-4/`). If paths break, set a base in `vite.config.ts` during build:
```ts
// export default defineConfig({ base: '/WEBZENITH-BOOTCAMP/WEEK-4/', plugins: [react()] })
```
Then rebuild and deploy the `dist/` folder.

## 📣 Progress Sharing
When done, share:
- A short LinkedIn post with your learnings
- The GitHub repo link
- The deployed app link (Vercel or GitHub Pages)

Happy hacking!
