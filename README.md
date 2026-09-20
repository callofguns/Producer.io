# Producer.io

A web music-career game. Write songs, hire producers, drop them, and watch the
streams roll in. Turn-based by week, with an energy budget.

## Running it

You need [Node.js](https://nodejs.org) installed (version 18 or newer).

```bash
npm install     # once, downloads the libraries
npm run dev     # starts the game
```

Then open the link it prints (usually http://localhost:5173).

To make a version you can upload to a host:

```bash
npm run build   # output lands in dist/
```

## How the game works right now (V1)

- You start in **Week 1, 2023** with **$0** and **100 energy**.
- Making a song costs **10 energy**, so you get about **10 songs a week**.
- Each song needs three hires: **Musicality** (producer), **Songwriting**
  (writer) and a **Studio**. Doing them yourself is free; better people cost
  money. Everything is visible from week 1 — cash is the only gate.
- Song **quality** (0-100) comes from your own stats plus who you hired, with a
  bit of luck.
- Songs earn **streams** every week, decaying over time, which turn into cash.
- Press **END WEEK** to collect the money and refill your energy.
- Progress **saves automatically** in your browser. Settings has export/import.

## Where to change things

Almost all balance lives in one file:

| File | What's in it |
| --- | --- |
| `src/game/config.js` | **Every tunable number** — energy, payouts, stream curve, fame |
| `src/game/quality.js` | How good a song turns out |
| `src/game/simulate.js` | What happens when you press END WEEK |
| `src/game/roster.js` | The producers, writers and studios you can hire |
| `src/game/genres.js` | Genre list and how popular each one is |
| `src/game/state.js` | The shape of a save file |
| `src/screens/` | One file per screen |
| `src/ui/motion.js` | The spring settings every animation shares |
| `src/styles.css` | All the colours and layout |

## Not built yet

Drawn in the UI but switched off on purpose, so the layout is final:
Featuring, Albums, Awards, Certifications, Festivals, Label, Merch, and the
Catalog / Stats / Home tabs.
