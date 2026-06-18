# Driftline — Journey Mapping Workbench

A small, client-side journey-mapping workbench built with React and Vite. Driftline lets you sketch persona journeys as an emotional curve, flag friction points and instantly estimate projected retention — everything runs in the browser and is saved to localStorage.

Live demo: (replace with your hosted URL)

https://your-hosted-url.example.com

---

## Tech stack

- React (functional components)
- Vite (dev server / build)
- Plain CSS
- No backend — all data is stored in browser localStorage and can be exported as JSON

## Features

- Plot touchpoints for personas as an emotional journey curve
- Reorder & rescore steps and get instant churn/retention estimates
- Flag peak friction automatically
- Multiple personas per workbench
- Save/load from browser localStorage
- Export a JSON blueprint

## Screenshots

Place screenshots in `./public` or `./screenshots` and reference them here. Example:

![Driftline UI](./screenshots/driftline-landing.png)

Replace the image file above with actual screenshots from the project (recommended sizes: 1200×600 or similar).

---

## Quick start (developer)

Prerequisites

- Node.js 16+ (Node 18+ recommended)
- npm (or use yarn/pnpm)

Install and run locally

```bash
# from the repo root
cd "driftline/driftline-app"

# install dependencies
npm install

# start dev server (hot reload)
npm run dev

# open the URL shown by Vite (usually http://localhost:5173)
```

Build for production

```bash
npm run build
# preview the production build locally
npm run preview
```

Notes
- Vite will pick a free port if 5173 is taken; check the terminal output for the actual URL.
- You may see a harmless 404 for `/favicon.ico` if no favicon is present.

## Deployment

You can deploy the built app to any static hosting (Netlify, Vercel, GitHub Pages, etc.). Typical steps:

1. Run `npm run build` to produce the `dist/` folder.
2. Upload the contents of `dist/` to your host or connect your repository to Vercel/Netlify and let them run the build step.

After deployment update the `Live demo` link at the top of this README.

## Troubleshooting

- "React is not defined" in the browser console: ensure the file `src/Driftline.jsx` imports the default React export. Example at top of file:

```js
import React, { useState, useEffect } from 'react'
```

- Dev server not starting: make sure you ran `npm install` inside `driftline/driftline-app`.
- If you see audit warnings after `npm install`, run `npm audit` and `npm audit fix` if you want to address advisories. Use `--force` only when you understand the breaking changes.

## File map (important files)

- `index.html` — Vite entry
- `src/main.jsx` — mounts the React app
- `src/Driftline.jsx` — main component (UI + logic)
- `src/styles.css` — project styles
- `package.json` — scripts and deps

## Contributing

Contributions are welcome. Fork, create a branch, and open a PR with changes. Please keep changes small and focused.

