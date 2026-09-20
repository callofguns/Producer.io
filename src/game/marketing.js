// ============================================================================
// marketing.js — the SET MARKETING campaign you can buy for a song before
// releasing it. Prices come straight from the reference game.
//
// A bigger campaign multiplies how many streams the song pulls in its first
// week, which then carries through the whole decay tail.
// ============================================================================

export const MARKETING_TIERS = [
  { id: 'none',     name: 'None',     cost: 0,      multiplier: 1.0 },
  { id: 'local',    name: 'Local',    cost: 500,    multiplier: 1.15 },
  { id: 'state',    name: 'State',    cost: 4500,   multiplier: 1.45 },
  { id: 'regional', name: 'Regional', cost: 35000,  multiplier: 2.0 },
  { id: 'national', name: 'National', cost: 175000, multiplier: 2.8 },
  { id: 'global',   name: 'Global',   cost: 875000, multiplier: 4.0 },
]

export function getMarketing(id) {
  return MARKETING_TIERS.find((t) => t.id === id) || MARKETING_TIERS[0]
}

// The tiers you can actually pick on the modal (everything but "None").
export const BUYABLE_TIERS = MARKETING_TIERS.filter((t) => t.id !== 'none')
