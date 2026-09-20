// ============================================================================
// state.js — the shape of a save file, and the actions that change it.
// Every function here is "pure": it takes the old game and returns a NEW one.
// ============================================================================

import { CONFIG } from './config.js'
import { rollQuality } from './quality.js'
import { trainCost, getTrait } from './traits.js'

let idCounter = 0
function newId() {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter}`
}

// A brand new career.
export function createNewGame({ name, genreId }) {
  return {
    version: 3,
    week: 1,
    year: CONFIG.START_YEAR,
    player: {
      name,
      genreId,
      cash: CONFIG.START_CASH,
      energy: CONFIG.MAX_ENERGY,
      fame: CONFIG.START_FAME,
      traits: { ...CONFIG.START_TRAITS },
      homeStudioRating: CONFIG.START_HOME_STUDIO_RATING,
      totalStreams: 0,
      totalEarned: 0,
    },
    songs: [],
  }
}

// Older saves get brought up to the current shape so the game never crashes
// on a missing field.
//   v1 kept the three song traits under `stats`.
//   v2 used a 1-10 trait scale with a per-level progress bar.
//   v3 (now) uses a 1-100 scale where one training is +1.
export function migrate(game) {
  if (!game || !game.player) return game
  const p = game.player
  const fromVersion = game.version ?? 1

  const traits = { ...CONFIG.START_TRAITS, ...(p.traits || {}) }

  // v1 stored the song traits separately.
  if (p.stats) {
    traits.vocals = p.stats.vocals ?? traits.vocals
    traits.songwriting = p.stats.songwriting ?? traits.songwriting
    traits.rhythm = p.stats.rhythm ?? traits.rhythm
  }

  let homeStudioRating = p.homeStudioRating ?? CONFIG.START_HOME_STUDIO_RATING

  // Anything before v3 was on the old 1-10 scale, so multiply up to keep the
  // player's relative progress instead of resetting them.
  if (fromVersion < 3) {
    for (const key of Object.keys(traits)) {
      traits[key] = Math.min(CONFIG.MAX_TRAIT, Math.max(1, traits[key] * 10))
    }
    homeStudioRating = Math.min(100, homeStudioRating * 10)
  }

  const { stats, statXp, traitProgress, ...rest } = p
  return {
    ...game,
    version: 3,
    player: { ...rest, traits, homeStudioRating },
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
    // Snapshot of the traits that shaped this song's performance, so a song
    // released while you were bad doesn't suddenly improve later.
    virality: game.player.traits.virality,
    marketing: game.player.traits.marketing,
    cost,
    released: true,
    releasedOnWeek: game.week,
    releasedOnYear: game.year,
    totalStreams: 0,
    lastWeekStreams: 0,
    cold: false,
  }

  const nextGame = {
    ...game,
    songs: [song, ...game.songs],
    player: {
      ...game.player,
      cash: game.player.cash - cost,
      energy: game.player.energy - CONFIG.ENERGY_PER_SONG,
    },
  }

  return { game: nextGame, song }
}

// ---------------------------------------------------------------------------
// Train a trait. Spends energy and adds +1, up to a maximum of 100.
// ---------------------------------------------------------------------------
export function trainTrait(game, traitId) {
  const trait = getTrait(traitId)
  if (!trait) return { error: 'Unknown trait.' }

  const level = game.player.traits[traitId] ?? 1
  if (level >= CONFIG.MAX_TRAIT) return { error: 'Already maxed out.' }

  const cost = trainCost(traitId, level)
  if (!hasEnergy(game, cost)) return { error: 'Not enough energy.' }

  return {
    game: {
      ...game,
      player: {
        ...game.player,
        energy: game.player.energy - cost,
        traits: { ...game.player.traits, [traitId]: level + 1 },
      },
    },
  }
}
