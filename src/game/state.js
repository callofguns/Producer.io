// ============================================================================
// state.js — the shape of a save file, and the actions that change it.
// Every function here is "pure": it takes the old game and returns a NEW one.
// ============================================================================

import { CONFIG } from './config.js'
import { rollQuality } from './quality.js'
import { TRAITS, trainCost, getTrait } from './traits.js'

let idCounter = 0
function newId() {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter}`
}

function emptyProgress() {
  const out = {}
  for (const t of TRAITS) out[t.id] = 0
  return out
}

// A brand new career.
export function createNewGame({ name, genreId }) {
  return {
    version: 2,
    week: 1,
    year: CONFIG.START_YEAR,
    player: {
      name,
      genreId,
      cash: CONFIG.START_CASH,
      energy: CONFIG.MAX_ENERGY,
      fame: CONFIG.START_FAME,
      traits: { ...CONFIG.START_TRAITS },
      // How many trainings you've put into the CURRENT level of each trait.
      traitProgress: emptyProgress(),
      homeStudioRating: CONFIG.START_HOME_STUDIO_RATING,
      totalStreams: 0,
      totalEarned: 0,
    },
    songs: [],
  }
}

// Older saves (or a save from before a trait was added) get filled in here so
// the game never crashes on a missing field.
export function migrate(game) {
  if (!game || !game.player) return game
  const p = game.player

  const traits = { ...CONFIG.START_TRAITS, ...(p.traits || {}) }
  // Saves from v1 kept the three song traits under `stats`.
  if (p.stats) {
    traits.vocals = p.stats.vocals ?? traits.vocals
    traits.songwriting = p.stats.songwriting ?? traits.songwriting
    traits.rhythm = p.stats.rhythm ?? traits.rhythm
  }

  const traitProgress = { ...emptyProgress(), ...(p.traitProgress || {}) }

  const { stats, statXp, ...rest } = p
  return {
    ...game,
    version: 2,
    player: {
      ...rest,
      traits,
      traitProgress,
      homeStudioRating: p.homeStudioRating ?? CONFIG.START_HOME_STUDIO_RATING,
    },
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
// Train a trait. Spends energy and fills the progress bar. Fill the bar and
// the trait levels up.
// ---------------------------------------------------------------------------
export function trainTrait(game, traitId) {
  const trait = getTrait(traitId)
  if (!trait) return { error: 'Unknown trait.' }

  const level = game.player.traits[traitId] ?? 1
  if (level >= CONFIG.MAX_TRAIT) return { error: 'Already maxed out.' }

  const cost = trainCost(traitId, level)
  if (!hasEnergy(game, cost)) return { error: 'Not enough energy.' }

  const progress = (game.player.traitProgress[traitId] ?? 0) + 1
  const levelledUp = progress >= CONFIG.TRAININGS_PER_LEVEL

  return {
    game: {
      ...game,
      player: {
        ...game.player,
        energy: game.player.energy - cost,
        traits: {
          ...game.player.traits,
          [traitId]: levelledUp ? level + 1 : level,
        },
        traitProgress: {
          ...game.player.traitProgress,
          [traitId]: levelledUp ? 0 : progress,
        },
      },
    },
    levelledUp,
  }
}
