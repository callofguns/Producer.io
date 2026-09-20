// ============================================================================
// state.js — the shape of a save file, and the actions that change it.
// Every function here is "pure": it takes the old game and returns a NEW one.
// ============================================================================

import { CONFIG } from './config.js'
import { rollQuality } from './quality.js'

let idCounter = 0
function newId() {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter}`
}

// A brand new career.
export function createNewGame({ name, genreId }) {
  return {
    version: 1,
    week: 1,
    year: CONFIG.START_YEAR,
    player: {
      name,
      genreId,
      cash: CONFIG.START_CASH,
      energy: CONFIG.MAX_ENERGY,
      fame: CONFIG.START_FAME,
      stats: { ...CONFIG.START_STATS },
      statXp: { vocals: 0, songwriting: 0, rhythm: 0 },
      homeStudioRating: CONFIG.START_HOME_STUDIO_RATING,
      totalStreams: 0,
      totalEarned: 0,
    },
    songs: [],
  }
}

export function canAfford(game, cost) {
  return game.player.cash >= cost
}

export function hasEnergy(game, amount) {
  return game.player.energy >= amount
}

// ---------------------------------------------------------------------------
// Make a song. Pays the money, spends the energy, rolls the quality, and
// releases it immediately in the current week.
// Returns { game, song } or { error } if you can't afford it.
// ---------------------------------------------------------------------------
export function createSong(game, { title, genreId, explicit, producer, writer, studio }) {
  const cost = producer.cost + writer.cost + studio.cost

  if (!hasEnergy(game, CONFIG.ENERGY_PER_SONG)) return { error: 'Not enough energy.' }
  if (!canAfford(game, cost)) return { error: 'Not enough cash.' }

  const quality = rollQuality(game.player, producer, writer, studio)

  const song = {
    id: newId(),
    title: title.trim(),
    genreId,
    explicit,
    quality,
    credits: {
      producer: producer.name,
      writer: writer.name,
      studio: studio.name,
      producerRating: producer.rating,
      writerRating: writer.rating,
      studioRating: studio.rating,
    },
    cost,
    released: true,
    releasedOnWeek: game.week,
    releasedOnYear: game.year,
    totalStreams: 0,
    lastWeekStreams: 0,
    cold: false,
  }

  // Practice: making the song nudges your own stats up (see applyPractice).
  const { leveledUp, ...grownStats } = applyPractice(game.player)

  const nextGame = {
    ...game,
    songs: [song, ...game.songs],
    player: {
      ...game.player,
      ...grownStats,
      cash: game.player.cash - cost,
      energy: game.player.energy - CONFIG.ENERGY_PER_SONG,
    },
  }

  return { game: nextGame, song, leveledUp }
}

// ---------------------------------------------------------------------------
// PLACEHOLDER (see CONFIG.STAT_GROWTH_ENABLED): making a song is practice, so
// it nudges all three of your stats up over time. Replace this once the stats
// screen decides how you're really meant to improve.
// ---------------------------------------------------------------------------
function applyPractice(player) {
  if (!CONFIG.STAT_GROWTH_ENABLED) return { leveledUp: [] }

  const stats = { ...player.stats }
  const statXp = { ...(player.statXp || { vocals: 0, songwriting: 0, rhythm: 0 }) }
  const leveledUp = []

  for (const key of Object.keys(stats)) {
    if (stats[key] >= CONFIG.MAX_STAT) continue
    statXp[key] += CONFIG.XP_PER_SONG
    const needed = stats[key] * CONFIG.XP_PER_STAT_LEVEL
    if (statXp[key] >= needed) {
      statXp[key] -= needed
      stats[key] += 1
      leveledUp.push(key)
    }
  }

  return { stats, statXp, leveledUp }
}
