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
- Making a song does **not** release it. A new song sits in your catalogue as
  a draft with two ratings you can work on:
  - **Production Rating** — how good it sounds
  - **Virality** — how far it travels, rolled off your Virality trait
- On a song's page you can **polish** either rating: energy for **+0.5** at a
  time, getting pricier as the rating climbs. You can also buy a **marketing
  campaign** (Local $500 → Global $875,000), which multiplies its first week.
- When you're happy, **RELEASE 10 ⚡**. Only released songs earn anything.
- A song's **Production Rating** starts as the average of three numbers, times
  a studio bonus, times a bit of luck:
  - **Vocals** — always your own trait. Nobody can be hired to sing for you.
  - **Songwriting** — the writer you hired, or your own trait if you wrote it.
  - **Rhythm** — the producer you hired, or your own trait if you produced it.
  Hiring someone **replaces** your stat with theirs. The roster runs from 15 to
  95, so a maxed-out artist (100) is still better than anyone money can buy.
- Traits run from **1 to 100**. You raise them on the **ARTIST TRAITS** tab:
  one tap costs energy and adds **+1**, and the bar shows how close that trait
  is to 100.
- Training costs **(level + 1) energy**, so the price climbs by 1 with every
  point: ⚡2 at level 1, ⚡7 at level 6, ⚡100 at level 99. **Virality costs
  double**; business traits are half price because they level twice as fast.
  Taking one normal trait all the way to 100 costs 5,049 energy — about 50
  weeks of doing nothing else.
- **Virality** makes a new song hit harder in week one.
  **Marketing** slows how fast songs fade, so they earn for longer.
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
| `src/game/traits.js` | The traits, their colours, energy costs and what they do |
| `src/game/marketing.js` | The marketing campaign tiers and what each one is worth |
| `src/game/genres.js` | Genre list and how popular each one is |
| `src/game/state.js` | The shape of a save file |
| `src/screens/` | One file per screen |
| `src/ui/motion.js` | The spring settings every animation shares |
| `src/styles.css` | All the colours and layout |

## Lifestyle and jobs

The **home tab** is the LIFESTYLE screen. **FIND A JOB** (⚡5) opens the job
board, which offers three contracts at a time. A job pays every week but takes
its energy off your weekly total for the length of the contract — so early on
the wage is worth it, and later the energy is worth more than the money.
Refreshing the board costs the same ⚡5.

The six spending categories (Food, Fashion, Health, Home, Relationships,
Transportation) are drawn but switched off. Spending more on them will raise
your maximum energy, which is what makes the top of each trait reachable.

## Not built yet

Drawn in the UI but switched off on purpose, so the layout is final:
Featuring, Albums, Awards, Certifications, Festivals, Label, Merch, the
Stats / Home tabs, and the Charisma, Video Directing and Leadership traits
(they belong to features that don't exist yet — shows, music videos, running
your own label).
