// ============================================================================
// simulate.js — what happens when you press END WEEK.
//
// The rule: every released song earns streams every week, and those streams
// shrink a bit each week (STREAM_DECAY). Streams turn into money at
// PAYOUT_PER_STREAM. Nothing here touches the UI.
// ============================================================================

import { CONFIG } from './config.js'
import { getGenre, HOME_GENRE_BONUS } from './genres.js'
import { PLATFORM_SPLIT } from './config.js'
import { getMarketing } from './marketing.js'
import { weeklyExpenses, downgradeOnce, maxEnergyFor } from './lifestyle.js'

// How many streams a song pulls in its very first week.
export function firstWeekStreams(song, player) {
  const genre = getGenre(song.genreId)

  // Great songs don't just do a bit better, they do WAY better.
  // (quality / 50) ^ 2.35 means a 100-quality song is ~5x a 50-quality one.
  const qualityFactor = Math.pow(song.production / 50, CONFIG.QUALITY_EXPONENT)

  // Fame multiplies everything — an unknown and a superstar releasing the
  // same song get very different numbers.
  const fameFactor = 1 + (player.fame / CONFIG.MAX_FAME) * CONFIG.FAME_STREAM_MULTIPLIER

  let streams = CONFIG.FIRST_WEEK_BASE * qualityFactor * fameFactor * genre.popularity

  // Small bonus for staying in your own lane.
  if (song.genreId === player.genreId) streams *= HOME_GENRE_BONUS

  // Explicit songs get shared more but lose some playlists.
  if (song.explicit) {
    streams *= 1 + CONFIG.EXPLICIT_STREAM_BONUS - CONFIG.EXPLICIT_RADIO_PENALTY
  }

  // The song's own VIRALITY rating decides how far it travels. This is a
  // per-song number now, not your trait — polishing the song raises it.
  const virality = song.virality ?? 1
  streams *= 1 + (virality - 1) * CONFIG.VIRALITY_BONUS_PER_LEVEL

  // The paid campaign bought on SET MARKETING before release.
  streams *= getMarketing(song.marketingTier).multiplier

  return Math.max(1, Math.round(streams))
}

// The MARKETING trait slows how fast a song fades, so it earns for longer.
export function decayFor(song) {
  const marketing = song.marketingTrait ?? 1
  const decay = CONFIG.STREAM_DECAY + (marketing - 1) * CONFIG.MARKETING_DECAY_PER_LEVEL
  return Math.min(decay, CONFIG.MAX_DECAY)
}

// Streams for a song that's already been out for `weeksOut` weeks.
export function weeklyStreams(song, player, weeksOut) {
  if (weeksOut < 0) return 0
  const base = firstWeekStreams(song, player)
  return Math.round(base * Math.pow(decayFor(song), weeksOut))
}

// Splits a stream total across the four platforms (display only).
export function splitAcrossPlatforms(total) {
  const out = {}
  for (const p of PLATFORM_SPLIT) out[p.id] = Math.round(total * p.share)
  return out
}

// ---------------------------------------------------------------------------
// The big one: advance the game by a single week.
// Takes the current game state and returns { nextState, report }.
// `report` is what the week-summary popup shows you.
// ---------------------------------------------------------------------------
export function advanceWeek(game) {
  const player = game.player
  let weekStreams = 0
  const perSong = []

  const songs = game.songs.map((song) => {
    if (!song.released) return song

    const weeksOut = game.week - song.releasedOnWeek
    const gained = weeklyStreams(song, player, weeksOut)

    // Once a song barely gets played, it stops earning.
    if (gained < CONFIG.STREAM_FLOOR) {
      return { ...song, cold: true }
    }

    weekStreams += gained
    perSong.push({ id: song.id, title: song.title, streams: gained })

    return {
      ...song,
      totalStreams: song.totalStreams + gained,
      lastWeekStreams: gained,
      cold: false,
    }
  })

  const earned = weekStreams * CONFIG.PAYOUT_PER_STREAM

  // --- your day job ---------------------------------------------------------
  // It pays every week and takes a slice of next week's energy, until the
  // contract runs out.
  let job = game.job
  let wages = 0
  if (job) {
    wages = job.pay
    const weeksLeft = job.weeksLeft - 1
    job = weeksLeft > 0 ? { ...job, weeksLeft } : null
  }

  // Fame: released songs push it up, silence lets it slide.
  const releasedThisWeek = game.songs.filter(
    (s) => s.released && s.releasedOnWeek === game.week
  )
  let fameGain = 0
  for (const s of releasedThisWeek) {
    fameGain += (s.production / 100) * CONFIG.FAME_GAIN_PER_RELEASE
  }
  const fame = Math.max(
    0,
    Math.min(CONFIG.MAX_FAME, player.fame + fameGain - CONFIG.FAME_DECAY_PER_WEEK)
  )

  // Roll the calendar forward.
  let week = game.week + 1
  let year = game.year
  if (week > CONFIG.WEEKS_PER_YEAR) {
    week = 1
    year += 1
  }

  // --- the weekly bill ------------------------------------------------------
  // Everything you've bought on the LIFESTYLE screen charges every week, on
  // top of a flat base cost of living. If you can't cover it, your lifestyle
  // gets downgraded a step at a time until you can.
  let lifestyle = player.lifestyle
  let expenses = CONFIG.BASE_WEEKLY_EXPENSE + weeklyExpenses(lifestyle)
  const cashBefore = player.cash + earned + wages
  const downgrades = []

  while (expenses > cashBefore) {
    const result = downgradeOnce(lifestyle)
    if (!result.downgraded) break // nothing left to sell; you go into the red
    lifestyle = result.lifestyle
    downgrades.push(result.downgraded)
    expenses = CONFIG.BASE_WEEKLY_EXPENSE + weeklyExpenses(lifestyle)
  }

  // A job you're still working eats part of next week's energy.
  const maxEnergy = maxEnergyFor({ ...player, lifestyle })
  const energy = Math.max(0, maxEnergy - (job ? job.energy : 0))

  const nextState = {
    ...game,
    week,
    year,
    songs,
    job,
    player: {
      ...player,
      cash: cashBefore - expenses,
      energy,
      fame,
      lifestyle,
      totalStreams: player.totalStreams + weekStreams,
      totalEarned: player.totalEarned + earned + wages,
    },
  }

  const report = {
    week: game.week,
    year: game.year,
    streams: weekStreams,
    earned,
    wages,
    expenses,
    downgrades,
    jobName: game.job ? game.job.name : null,
    jobEnded: Boolean(game.job) && !job,
    fameGain: fameGain - CONFIG.FAME_DECAY_PER_WEEK,
    topSongs: perSong.sort((a, b) => b.streams - a.streams).slice(0, 3),
    songsOut: songs.filter((s) => s.released).length,
  }

  return { nextState, report }
}
