# Driftline · Persona Journey & Emotion Mapper

> A browser-native UX workshop that finds where every user starts to lose patience — and where they recover.

**Live demo → (https://driftline-v85g.vercel.app) **

---

## What it does

Every digital workflow is a sequence of moments where a user feels something — delighted when one-click checkout works, frustrated when a card form rejects their CVV for the third time, relieved when an order confirmation finally lands. These emotional shifts are usually invisible.

Driftline maps the emotional journey of a persona touchpoint by touchpoint, attaches sentiment scores, computes friction deltas, and surfaces the exact steps where users are most likely to drop off — all inside your browser tab. No backend. No uploads. No vendor account. No data ever leaves your device.

---

## Features

### Emotional Trajectory Engine
- **Cubic-bezier plotter** — touchpoints become a smooth continuous curve with horizontal-tangent control points
- **Gradient by sentiment** — coral at frustration → amber at neutral → tide green at delight, applied per segment
- **ΔF friction analyzer** — sentiment drops of ≥ 2 are flagged in crimson on the curve, node, and matrix row
- **Funnel retention model** — per-step churn coefficient compounds down the journey; projected Keep% updates live as you score
- **Live telemetry HUD** — touchpoint count, satisfaction index, projected retention, peak friction node, recompute latency in ms

### Interactive Workbench
- **Touchpoint builder** — type a label, pick a stage (Discovery / Consideration / Action / Friction Point), slide −3..+3 sentiment, press Enter
- **Inline persona editing** — name and archetype edit in place inside the card header; no modal, no save button
- **Score in the matrix** — edit sentiment scores directly inside the matrix; the curve updates in the same frame
- **Hover for detail** — hovering a node reveals the touchpoint, its ΔF, and its retention contribution
- **Persona strip** — horizontal chip strip to switch active personas; one tap adds a new one

### Data & Product
- **JSON blueprint export** — one click serialises the full persona tree to a downloadable JSON file
- **Workbench autosave** — every mutation mirrors to `localStorage`; close and reopen the tab and the canvas reloads identically
- **Zero external dependencies** for charts or animation — every algorithm is hand-written and visible in plain JS

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 (functional components + hooks) | Rendering only; no framework magic |
| Build | Vite | Zero-config, instant HMR, static output |
| Graphics | Native SVG | The trajectory is a single `<path>`; no Canvas, no WebGL, no chart library |
| Language | Plain JSX (no TypeScript) | Keeps the codebase readable at a glance |
| Persistence | `window.localStorage` | Autosave without a backend |
| Hosting | Vercel | Static deploy; matches the zero-server privacy claim |

### Hand-written algorithms (no library)

| Algorithm | Description |
|---|---|
| Bezier smoothing | Builds the trajectory `d`-string from touchpoint coordinates using horizontal-tangent midpoints |
| Friction deltas | `ΔF = sentiment(t) − sentiment(t−1)` for every consecutive pair; drops ≥ 2 trigger critical flags |
| Funnel retention | Per-step churn coefficient blends sentiment depth with negative ΔF; compounds multiplicatively |
| Sentiment colour map | Three-stop linear interpolation (coral → amber → tide) drives path stroke and node fill |

---

## Component Architecture

```
Driftline (root — view: landing | app)
├── Landing
│   ├── Nav
│   ├── Hero (animated demo curve — same SVG renderer as the mapper)
│   ├── Features
│   ├── Pricing (Sketch / Pro / Studio)
│   └── Footer
└── Mapper
    ├── AppNav (back, Export Blueprint, Flush Workbench)
    ├── PersonaStrip
    ├── Stage card
    │   ├── CardHead (editable name & archetype)
    │   ├── JourneyCurve ← shared SVG renderer
    │   └── TouchpointBuilder
    ├── Matrix card (Step · Stage · Feel · ΔF · Keep%)
    └── TelemetryHUD
```

**Analytics layer (pure functions, no React)**

| Function | Returns |
|---|---|
| `computeGeometry(steps)` | `{pts, d}` — node coordinates and the cubic-bezier path string |
| `sentimentColor(s)` | RGB from three-stop linear interpolation over `[−3, +3]` |
| `analyze(steps)` | `{rows, satisfaction, peak, latency}` — friction deltas, retention, critical flags |

---

## Project Stats

| | |
|---|---|
| Journey stages | 4 (Discovery → Consideration → Action → Friction Point) |
| External chart/viz libraries | 0 |
| Product surfaces | 2 (Landing + Mapper) |
| Typical recompute latency | < 1 ms |
| Total source lines | < 700 |

---

## Getting Started

```bash
git clone https://github.com/parigothi/driftline.git
cd driftline
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Production build
npm run build
```

Output goes to `/dist` — fully static, deploy anywhere.

---

## Pricing Tiers (SaaS prototype)

| Tier | Price | Scope |
|---|---|---|
| Sketch | Free | Full case-study feature set |
| Pro | $9 / mo | Extended for designers |
| Studio | $29 / mo | Small teams |

---

## Screenshots 

1. Landing page
   <img width="1408" height="629" alt="image" src="https://github.com/user-attachments/assets/ff576273-c293-4271-ba46-421e31ad8151" />
   <img width="1445" height="715" alt="image" src="https://github.com/user-attachments/assets/021613c2-1944-4033-b010-84e25b8a8cfe" />
   <img width="1419" height="778" alt="image" src="https://github.com/user-attachments/assets/f763cf8a-d52c-4b4b-89d0-65f94f3f0578" />

2. The product
   <img width="1413" height="828" alt="image" src="https://github.com/user-attachments/assets/6e2809fa-d9d3-4901-badc-86e29ec22cba" />

---

## Links

- **Live demo** — [driftline-v85g.vercel.app](https://driftline-v85g.vercel.app)
- **Source** — [github.com/parigothi/driftline](https://github.com/Parii22/Driftline)

---

*Build by Pari Gothi
