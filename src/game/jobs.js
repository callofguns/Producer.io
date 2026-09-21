// ============================================================================
// jobs.js — the JOB BOARD you reach from LIFESTYLE > FIND A JOB.
//
// A job pays you every week, but eats a slice of your weekly energy for the
// length of the contract. Early on that trade is worth it; once music pays
// properly, the energy is worth more than the wage.
//
// Nothing here pays more than CONFIG.MAX_JOB_PAY a week — a day job should
// only ever be a leg-up, never a living.
//
// Shape matches the reference game: "⚡13 | BABYSIT — +$375/week | 11/week
// contract".
// ============================================================================

export const JOB_POOL = [
  { id: 'dogwalk',   name: 'DOG WALKER',         energy: 6,  pay: 150, weeks: 8 },
  { id: 'paper',     name: 'PAPER ROUND',        energy: 8,  pay: 200, weeks: 6 },
  { id: 'dishpit',   name: 'DISH PIT',           energy: 10, pay: 250, weeks: 9 },
  { id: 'lawn',      name: 'LAWN MOWER',         energy: 12, pay: 350, weeks: 6 },
  { id: 'clerk',     name: 'RECORD STORE CLERK', energy: 13, pay: 340, weeks: 9 },
  { id: 'babysit',   name: 'BABYSIT',            energy: 13, pay: 375, weeks: 11 },
  { id: 'barista',   name: 'BARISTA',            energy: 16, pay: 390, weeks: 12 },
  { id: 'warehouse', name: 'WAREHOUSE SHIFT',    energy: 18, pay: 400, weeks: 14 },
]

import { CONFIG } from './config.js'

export const JOBS_ON_BOARD = 3

// Nothing on the board may pay more than CONFIG.MAX_JOB_PAY, so the cap holds
// even if a job above it gets added later.
function capPay(job) {
  return { ...job, pay: Math.min(job.pay, CONFIG.MAX_JOB_PAY) }
}

// Picks a few random jobs to show. Refreshing costs energy, so you can't just
// reroll until the best one appears for free.
export function rollJobBoard(rng = Math.random) {
  const pool = [...JOB_POOL]
  const out = []
  for (let i = 0; i < JOBS_ON_BOARD && pool.length; i++) {
    const idx = Math.floor(rng() * pool.length)
    out.push(capPay(pool.splice(idx, 1)[0]))
  }
  // Cheapest first, so the board reads like a ladder.
  return out.sort((a, b) => a.pay - b.pay)
}
