// ============================================================================
// traits.js — the ARTIST TRAITS / BUSINESS TRAITS screen.
//
// Traits run from 1 to 100. One training costs ENERGY and adds +1 to the
// trait; the progress bar just shows how close it is to 100.
// The energy price goes up as the trait gets higher.
// ============================================================================

import { CONFIG } from './config.js'

// `active: true`  = the trait actually affects the game right now.
// `active: false` = drawn on the screen but greyed out, waiting on a feature
//                   that doesn't exist yet (shows, music videos, your label).
export const TRAITS = [
  // --- ARTIST ---
  { id: 'vocals',         name: 'VOCALS',          group: 'artist',   color: '#6b5dd3', baseCost: 2, active: true,
    blurb: 'Your singing. Always counts toward song quality — nobody can be hired to replace it.' },
  { id: 'songwriting',    name: 'SONG WRITING',    group: 'artist',   color: '#ab5ec9', baseCost: 2, active: true,
    blurb: 'Counts toward song quality when you write the song yourself.' },
  { id: 'rhythm',         name: 'RHYTHM',          group: 'artist',   color: '#5f9ed6', baseCost: 2, active: true,
    blurb: 'Counts toward song quality when you produce the song yourself.' },
  { id: 'charisma',       name: 'CHARISMA',        group: 'artist',   color: '#dd9130', baseCost: 2, active: false,
    blurb: 'For live shows and interviews. Not in the game yet.' },
  { id: 'virality',       name: 'VIRALITY',        group: 'artist',   color: '#e3c73f', baseCost: 4, active: true,
    blurb: 'How hard a new song hits in its first week.' },
  { id: 'videoDirecting', name: 'VIDEO DIRECTING', group: 'artist',   color: '#6b5dd3', baseCost: 2, active: false,
    blurb: 'For music videos. Not in the game yet.' },

  // --- BUSINESS ---
  { id: 'leadership',     name: 'LEADERSHIP',      group: 'business', color: '#e0cc4a', baseCost: 2, active: false,
    blurb: 'For running your own label. Not in the game yet.' },
  { id: 'marketing',      name: 'MARKETING',       group: 'business', color: '#e09a3e', baseCost: 2, active: true,
    blurb: 'Keeps your songs on playlists longer, so they stay earning.' },
]

export const ARTIST_TRAITS = TRAITS.filter((t) => t.group === 'artist')
export const BUSINESS_TRAITS = TRAITS.filter((t) => t.group === 'business')

export function getTrait(id) {
  return TRAITS.find((t) => t.id === id)
}

// What one training session costs, in energy.
// The price steps up every TRAIN_COST_STEP levels, so levels 1-10 all cost the
// base (matching your screenshot, where level 1 and level 2 both cost 2).
export function trainCost(traitId, level) {
  const trait = getTrait(traitId)
  if (!trait) return 0
  const steps = Math.floor((level - 1) / CONFIG.TRAIN_COST_STEP)
  return trait.baseCost + steps * CONFIG.TRAIN_COST_RISE
}

// The orange "1 SKILL LEVEL" at the top — the average of every trait (1-100).
export function skillLevel(traits) {
  const values = TRAITS.map((t) => traits[t.id] ?? 1)
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}
