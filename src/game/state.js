// ============================================================================
// state.js — the shape of a save file, and the actions that change it.
// Every function here is "pure": it takes the old game and returns a NEW one.
// ============================================================================

import { CONFIG } from './config.js'
import { rollQuality, rollVirality, polishCost } from './quality.js'
import { getMarketing } from './marketing.js'
import { rollJobBoard } from './jobs.js'
import { getCategory, getTier } from './lifestyle.js'
import { getArtist } from './artists.js'
import { albumTracks, getAlbum } from './albums.js'
import { trainCost, getTrait } from './traits.js'

let idCounter = 0
function newId() {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter}`
}

// A brand new career.
export function createNewGame({ name, genreId }) {
  return {
    version: 4,
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
      // One chosen tier per spending category; null means you own nothing there.
      lifestyle: { food: null, fashion: null, health: null, home: null },
      totalStreams: 0,
      totalEarned: 0,
    },
    songs: [],
    albums: [],
    // The job you're currently working, and the offers on the board.
    job: null,
    jobBoard: rollJobBoard(),
  }
}

// Older saves get brought up to the current shape so the game never crashes
// on a missing field.
//   v1 kept the three song traits under `stats`.
//   v2 used a 1-10 trait scale with a per-level progress bar.
//   v3 used a 1-100 trait scale where one training is +1.
//   v4 (now) splits a song into production + virality and makes releasing a
//      separate, deliberate step.
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

  // Songs from before v4 had a single `quality` and were released on creation.
  const songs = (game.songs || []).map((song) => {
    if (song.production !== undefined) return song
    return {
      ...song,
      production: song.quality ?? 1,
      virality: (song.virality ?? 1) * (fromVersion < 3 ? 10 : 1),
      marketingTrait: song.marketing ?? traits.marketing,
      marketingTier: song.marketingTier ?? 'none',
      released: song.released ?? true,
      albumId: song.albumId ?? null,
      featuring: song.featuring ?? null,
    }
  })

  return {
    ...game,
    version: 4,
    songs,
    albums: game.albums ?? [],
    job: game.job ?? null,
    jobBoard: game.jobBoard?.length ? game.jobBoard : rollJobBoard(),
    player: {
      ...rest,
      traits,
      homeStudioRating,
      lifestyle: p.lifestyle ?? { food: null, fashion: null, health: null, home: null },
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
export function createSong(
  game,
  { title, genreId, explicit, producer, writer, studio, featureId = null, albumId = null }
) {
  const guest = getArtist(featureId)
  const cost = producer.cost + writer.cost + studio.cost + (guest ? guest.fee : 0)

  if (!hasEnergy(game, CONFIG.ENERGY_PER_SONG)) return { error: 'Not enough energy.' }
  if (!canAfford(game, cost)) return { error: 'Not enough cash.' }

  // You can only add tracks to a record that hasn't dropped yet.
  const album = getAlbum(game, albumId)
  if (albumId && (!album || album.released)) return { error: 'That album is already out.' }

  const production = rollQuality(game.player, producer, writer, studio, Math.random, featureId)

  const song = {
    id: newId(),
    title: title.trim(),
    genreId,
    explicit,
    // A song has two ratings. Production is how good it sounds; virality is
    // how far it travels. Both can be polished before release.
    production,
    virality: rollVirality(game.player, Math.random, featureId),
    featuring: guest ? { id: guest.id, name: guest.name } : null,
    albumId: albumId || null,
    credits: {
      producer: producer.name,
      writer: writer.name,
      studio: studio.name,
      producerRating: producer.rating,
      writerRating: writer.rating,
      studioRating: studio.rating,
    },
    // Snapshot of the Marketing trait that shaped this song, so an old song
    // doesn't retroactively improve as you train.
    marketingTrait: game.player.traits.marketing,
    // The paid campaign you buy on the SET MARKETING screen.
    marketingTier: 'none',
    cost,
    // Songs are NOT released when you make them. They sit in your catalogue
    // until you spend the energy to put them out.
    released: false,
    releasedOnWeek: null,
    releasedOnYear: null,
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

// ---------------------------------------------------------------------------
// Polish an unreleased song: spend energy to nudge its Production Rating or
// Virality up by +0.5. `which` is 'production' or 'virality'.
// ---------------------------------------------------------------------------
export function polishSong(game, songId, which) {
  const song = game.songs.find((s) => s.id === songId)
  if (!song) return { error: 'Song not found.' }
  if (song.released) return { error: 'This song is already out.' }
  if (which !== 'production' && which !== 'virality') return { error: 'Unknown stat.' }

  const current = song[which]
  if (current >= CONFIG.MAX_QUALITY) return { error: 'Already maxed out.' }

  const cost = polishCost(current)
  if (!hasEnergy(game, cost)) return { error: 'Not enough energy.' }

  // Keep it to one decimal place so +0.5 steps stay tidy.
  const next = Math.min(
    CONFIG.MAX_QUALITY,
    Math.round((current + CONFIG.POLISH_STEP) * 10) / 10
  )

  return {
    game: {
      ...game,
      songs: game.songs.map((s) => (s.id === songId ? { ...s, [which]: next } : s)),
      player: { ...game.player, energy: game.player.energy - cost },
    },
  }
}

// ---------------------------------------------------------------------------
// Buy a marketing campaign for an unreleased song. Swapping tiers charges the
// full new price (you don't get a refund on the old one).
// ---------------------------------------------------------------------------
export function setMarketing(game, songId, tierId) {
  const song = game.songs.find((s) => s.id === songId)
  if (!song) return { error: 'Song not found.' }
  if (song.released) return { error: 'This song is already out.' }

  const tier = getMarketing(tierId)
  if (!canAfford(game, tier.cost)) return { error: 'Not enough cash.' }

  return {
    game: {
      ...game,
      songs: game.songs.map((s) =>
        s.id === songId ? { ...s, marketingTier: tier.id } : s
      ),
      player: { ...game.player, cash: game.player.cash - tier.cost },
    },
  }
}

// ---------------------------------------------------------------------------
// Release a song. Costs energy, and from this week on it starts earning.
// ---------------------------------------------------------------------------
export function releaseSong(game, songId) {
  const song = game.songs.find((s) => s.id === songId)
  if (!song) return { error: 'Song not found.' }
  if (song.released) return { error: 'This song is already out.' }
  if (!hasEnergy(game, CONFIG.ENERGY_PER_RELEASE)) return { error: 'Not enough energy.' }

  return {
    game: {
      ...game,
      songs: game.songs.map((s) =>
        s.id === songId
          ? { ...s, released: true, releasedOnWeek: game.week, releasedOnYear: game.year }
          : s
      ),
      player: {
        ...game.player,
        energy: game.player.energy - CONFIG.ENERGY_PER_RELEASE,
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

// Spend energy to shuffle the offers on the board.
export function refreshJobBoard(game) {
  if (!hasEnergy(game, CONFIG.ENERGY_TO_FIND_JOB)) return { error: 'Not enough energy.' }
  return {
    game: {
      ...game,
      jobBoard: rollJobBoard(),
      player: {
        ...game.player,
        energy: game.player.energy - CONFIG.ENERGY_TO_FIND_JOB,
      },
    },
  }
}

// Take a job. You can only hold one at a time — accepting a new one replaces
// whatever you were doing.
export function acceptJob(game, jobId) {
  const offer = game.jobBoard.find((j) => j.id === jobId)
  if (!offer) return { error: 'That job is gone.' }
  if (offer.energy >= CONFIG.MAX_ENERGY) return { error: 'That job would eat all your energy.' }

  return {
    game: {
      ...game,
      job: { ...offer, weeksLeft: offer.weeks },
    },
  }
}

// Walk away from a contract early. Costs nothing but the wage.
export function quitJob(game) {
  return { game: { ...game, job: null } }
}

// ---------------------------------------------------------------------------
// Lifestyle
// ---------------------------------------------------------------------------

// Buy a tier in a category. You pay the first week straight away, so you can't
// pick something up for free and cancel it before the bill lands.
export function setLifestyle(game, categoryId, tierId) {
  const cat = getCategory(categoryId)
  if (!cat) return { error: 'Unknown category.' }

  const tier = getTier(categoryId, tierId)
  if (!tier) return { error: 'Unknown tier.' }
  if (game.player.lifestyle[categoryId] === tierId) return { error: 'Already yours.' }
  if (!canAfford(game, tier.cost)) return { error: 'Not enough cash.' }

  return {
    game: {
      ...game,
      player: {
        ...game.player,
        cash: game.player.cash - tier.cost,
        lifestyle: { ...game.player.lifestyle, [categoryId]: tierId },
      },
    },
  }
}

// Stop paying for a category entirely.
export function clearLifestyle(game, categoryId) {
  return {
    game: {
      ...game,
      player: {
        ...game.player,
        lifestyle: { ...game.player.lifestyle, [categoryId]: null },
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------

// Start a new record. Free to begin — you pay for it in the songs you put on it.
export function createAlbum(game, title) {
  const name = (title || '').trim()
  if (!name) return { error: 'Give the album a title.' }

  const album = {
    id: newId(),
    title: name,
    released: false,
    releasedOnWeek: null,
    releasedOnYear: null,
    createdOnWeek: game.week,
    createdOnYear: game.year,
  }

  return { game: { ...game, albums: [album, ...game.albums] }, album }
}

// Move an unreleased song onto a record, or back off it (albumId = null).
export function setSongAlbum(game, songId, albumId) {
  const song = game.songs.find((s) => s.id === songId)
  if (!song) return { error: 'Song not found.' }
  if (song.released) return { error: 'This song is already out.' }

  if (albumId) {
    const album = getAlbum(game, albumId)
    if (!album) return { error: 'Album not found.' }
    if (album.released) return { error: 'That album is already out.' }
  }

  return {
    game: {
      ...game,
      songs: game.songs.map((s) => (s.id === songId ? { ...s, albumId: albumId || null } : s)),
    },
  }
}

// ---------------------------------------------------------------------------
// Drop the record. Every unreleased track on it goes out at once, and from
// this week they all earn with the album's cross-promotion bonus.
// ---------------------------------------------------------------------------
export function releaseAlbum(game, albumId) {
  const album = getAlbum(game, albumId)
  if (!album) return { error: 'Album not found.' }
  if (album.released) return { error: 'This album is already out.' }

  const tracks = albumTracks(game, albumId)
  if (tracks.length < CONFIG.MIN_ALBUM_TRACKS) {
    return { error: `An album needs at least ${CONFIG.MIN_ALBUM_TRACKS} tracks.` }
  }
  if (!hasEnergy(game, CONFIG.ENERGY_PER_ALBUM_RELEASE)) return { error: 'Not enough energy.' }

  const trackIds = new Set(tracks.map((t) => t.id))

  return {
    game: {
      ...game,
      albums: game.albums.map((a) =>
        a.id === albumId
          ? { ...a, released: true, releasedOnWeek: game.week, releasedOnYear: game.year }
          : a
      ),
      songs: game.songs.map((s) =>
        trackIds.has(s.id) && !s.released
          ? { ...s, released: true, releasedOnWeek: game.week, releasedOnYear: game.year }
          : s
      ),
      player: {
        ...game.player,
        energy: game.player.energy - CONFIG.ENERGY_PER_ALBUM_RELEASE,
      },
    },
  }
}
