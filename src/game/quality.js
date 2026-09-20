// ============================================================================
// quality.js — how good a song turns out.
//
// ⚠️  PROVISIONAL — waiting on your stats-screen design.
// You said: "It's an average of your 3 stats — vocals, songwriting and rhythm."
// But the CREATE A SONG screen also shows a rating for the producer, the
// writer and the studio you hired, and those obviously have to matter too
// (otherwise paying $600,000 for DR. HALO would do nothing).
//
// So right now the formula blends the two, and the blend is one number you
// can change: TALENT_WEIGHT below. Once you confirm how your stats screen
// works, this is the ONLY function that needs rewriting.
// ============================================================================

import { CONFIG } from './config.js'

// 0.5 = your talent and who you hired matter equally.
// 1.0 = only your own stats matter (pure "average of your 3 stats").
// 0.0 = only the people you hired matter.
export const TALENT_WEIGHT = 0.5

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

// The average of your three personal stats, on the 1-10 scale.
export function talentScore(player) {
  const { vocals, songwriting, rhythm } = player.stats
  return (vocals + songwriting + rhythm) / 3
}

// The average of the three things you picked on the create screen.
export function creditsScore(producer, writer, studio) {
  return (producer.rating + writer.rating + studio.rating) / 3
}

// What the song WOULD score with no luck involved (0-100).
// Useful for showing the player a preview before they hit CREATE.
export function expectedQuality(player, producer, writer, studio) {
  const talent = talentScore(player)
  const credits = creditsScore(producer, writer, studio)
  const blended = talent * TALENT_WEIGHT + credits * (1 - TALENT_WEIGHT)
  // blended is 1-10, so multiply by 10 to land on the 0-100 scale.
  return clamp(Math.round(blended * 10), 1, CONFIG.MAX_QUALITY)
}

// The real roll, with luck. This is what actually gets stored on the song.
export function rollQuality(player, producer, writer, studio, rng = Math.random) {
  const expected = expectedQuality(player, producer, writer, studio)
  const luck = CONFIG.LUCK_MIN + rng() * (CONFIG.LUCK_MAX - CONFIG.LUCK_MIN)
  return clamp(Math.round(expected * luck), 1, CONFIG.MAX_QUALITY)
}

// Turns a 0-100 quality into the word the UI shows next to the song.
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
