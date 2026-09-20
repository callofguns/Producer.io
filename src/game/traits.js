// ============================================================================
// traits.js — the ARTIST TRAITS / BUSINESS TRAITS screen.
//
// Traits run from 1 to 100. One training costs ENERGY and adds +1 to the
// trait; the progress bar just shows how close it is to 100.
// The energy price is (level + 1), so it climbs by 1 with every point.
// ============================================================================

import { CONFIG } from './config.js'

// `active: true`  = the trait actually affects the game right now.
// `active: false` = drawn on the screen but greyed out, waiting on a feature
//                   that doesn't exist yet (shows, music videos, your label).
export const TRAITS = [
  // --- ARTIST ---
  { id: 'vocals',         name: 'VOCALS',          group: 'artist',   color: '#6b5dd3', costMultiplier: 1, active: true,
    blurb: 'Your singing. Always counts toward song quality — nobody can be hired to replace it.' },
  { id: 'songwriting',    name: 'SONG WRITING',    group: 'artist',   color: '#ab5ec9', costMultiplier: 1, active: true,
    blurb: 'Counts toward song quality when you write the song yourself.' },
  { id: 'rhythm',         name: 'RHYTHM',          group: 'artist',   color: '#5f9ed6', costMultiplier: 1, active: true,
    blurb: 'Counts toward song quality when you produce the song yourself.' },
  { id: 'charisma',       name: 'CHARISMA',        group: 'artist',   color: '#dd9130', costMultiplier: 1, active: false,
    blurb: 'For live shows and interviews. Not in the game yet.' },
  { id: 'virality',       name: 'VIRALITY',        group: 'artist',   color: '#e3c73f', costMultiplier: 2, active: true,
    blurb: 'How hard a new song hits in its first week. Costs twice the energy of a normal trait to train.' },
  { id: 'videoDirecting', name: 'VIDEO DIRECTING', group: 'artist',   color: '#6b5dd3', costMultiplier: 1, active: false,
    blurb: 'For music videos. Not in the game yet.' },

  // --- BUSINESS ---
  { id: 'leadership',     name: 'LEADERSHIP',      group: 'business', color: '#e0cc4a', costMultiplier: 0.5, active: false,
    blurb: 'For running your own label. Not in the game yet.' },
  { id: 'marketing',      name: 'MARKETING',       group: 'business', color: '#e09a3e', costMultiplier: 0.5, active: true,
    blurb: 'Keeps your songs on playlists longer, so they stay earning.' },
]

export const ARTIST_TRAITS = TRAITS.filter((t) => t.group === 'artist')
export const BUSINESS_TRAITS = TRAITS.filter((t) => t.group === 'business')

export function getTrait(id) {
  return TRAITS.find((t) => t.id === id)
}

// What one training session costs, in energy.
//
//   cost = (level + 1) x the trait's multiplier
//
// So a normal trait costs 2 at level 1, 5 at level 4, 7 at level 6, and 100 at
// level 99. Virality has a x2 multiplier ("Virality costs twice the energy"),
// and business traits are x0.5 because they "level twice as fast".
export function trainCost(traitId, level) {
  const trait = getTrait(traitId)
  if (!trait) return 0
  return Math.ceil((level + 1) * trait.costMultiplier)
}

// The orange "1 SKILL LEVEL" at the top — the average of every trait (1-100).
export function skillLevel(traits) {
  const values = TRAITS.map((t) => traits[t.id] ?? 1)
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}
