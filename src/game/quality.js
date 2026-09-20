// ============================================================================
// quality.js — how good a song turns out.
//
// THE RULE (your design):
//   Quality is the average of three numbers —
//     VOCALS       always yours. Nobody can be hired to sing for you.
//     SONGWRITING  the writer you hired, or your own trait if you wrote it.
//     RHYTHM       the producer you hired, or your own trait if you made it.
//   Hiring someone REPLACES your stat with theirs. That's what the $600,000
//   producer is buying: his 10 instead of your 3.
//
//   The STUDIO isn't one of the three traits, so it multiplies the result
//   instead. Your free home studio (rating 5) is neutral.
//
//   Then a bit of luck is rolled on top.
// ============================================================================

import { CONFIG } from './config.js'

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

// The three numbers that get averaged, on the 1-100 scale.
// `producer` and `writer` are whatever is selected in the create screen —
// they already carry the right rating, because the "yourself" option is built
// from your own traits (see roster.js).
export function qualityParts(player, producer, writer) {
  return {
    vocals: player.traits.vocals,
    songwriting: writer.rating,
    rhythm: producer.rating,
  }
}

// Studio turns into a multiplier. Rating 50 = 1.00, rating 95 = 1.18.
export function studioMultiplier(studio) {
  const diff = studio.rating - CONFIG.STUDIO_NEUTRAL_RATING
  return 1 + diff * CONFIG.STUDIO_BONUS_PER_RATING
}

// What the song WOULD score with no luck (0-100). Used for the live preview
// on the create screen, so you can see what your money is buying.
export function expectedQuality(player, producer, writer, studio) {
  const parts = qualityParts(player, producer, writer)
  // Traits and hire ratings are already on the 0-100 scale, so the average IS
  // the score — no conversion needed.
  const average = (parts.vocals + parts.songwriting + parts.rhythm) / 3
  const score = average * studioMultiplier(studio)
  return clamp(Math.round(score), 1, CONFIG.MAX_QUALITY)
}

// The real roll, with luck. This is what gets stored on the song.
export function rollQuality(player, producer, writer, studio, rng = Math.random) {
  const expected = expectedQuality(player, producer, writer, studio)
  const luck = CONFIG.LUCK_MIN + rng() * (CONFIG.LUCK_MAX - CONFIG.LUCK_MIN)
  return clamp(Math.round(expected * luck), 1, CONFIG.MAX_QUALITY)
}

// Turns a 0-100 quality into the word shown next to the song.
export function qualityLabel(q) {
  if (q >= 89) return 'CLASSIC'
  if (q >= 74) return 'GREAT'
  if (q >= 58) return 'SOLID'
  if (q >= 40) return 'DECENT'
  if (q >= 20) return 'WEAK'
  return 'FLOP'
}

export function qualityColor(q) {
  if (q >= 89) return '#f2c14e'
  if (q >= 74) return '#7ab648'
  if (q >= 58) return '#6ea8dc'
  if (q >= 40) return '#9a9ca3'
  return '#e2635c'
}
