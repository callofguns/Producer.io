// ============================================================================
// jobs.js — the JOB BOARD you reach from LIFESTYLE > FIND A JOB.
//
// A job pays you every week, but eats a slice of your weekly energy for the
// length of the contract. Early on that trade is worth it; once music pays
// properly, the energy is worth more than the wage.
//
// Shape matches the reference game: "⚡13 | BABYSIT — +$375/week | 11/week
// contract".
// ============================================================================

export const JOB_POOL = [
  { id: 'dogwalk',  name: 'DOG WALKER',        energy: 10, pay: 280, weeks: 8 },
  { id: 'lawn',     name: 'LAWN MOWER',        energy: 12, pay: 350, weeks: 6 },
  { id: 'babysit',  name: 'BABYSIT',           energy: 13, pay: 375, weeks: 11 },
  { id: 'clerk',    name: 'RECORD STORE CLERK', energy: 16, pay: 460, weeks: 9 },
  { id: 'barista',  name: 'BARISTA',           energy: 18, pay: 520, weeks: 12 },
  { id: 'rideshare', name: 'RIDESHARE DRIVER', energy: 22, pay: 700, weeks: 10 },
  { id: 'bar',      name: 'BARTENDER',         energy: 24, pay: 780, weeks: 10 },
  { id: 'warehouse', name: 'WAREHOUSE SHIFT',  energy: 26, pay: 850, weeks: 14 },
]

export const JOBS_ON_BOARD = 3

// Picks a few random jobs to show. Refreshing costs energy, so you can't just
// reroll until the best one appears for free.
export function rollJobBoard(rng = Math.random) {
  const pool = [...JOB_POOL]
  const out = []
  for (let i = 0; i < JOBS_ON_BOARD && pool.length; i++) {
    const idx = Math.floor(rng() * pool.length)
    out.push(pool.splice(idx, 1)[0])
  }
  // Cheapest first, so the board reads like a ladder.
  return out.sort((a, b) => a.pay - b.pay)
}
