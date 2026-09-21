// ============================================================================
// albums.js — grouping songs into a record instead of dropping them as singles.
//
// An album is just a named list of song ids. Its rating is the average
// production rating of its tracks, and releasing it puts every track out at
// once. Tracks on an album cross-promote each other, so a strong record lifts
// all of its songs.
// ============================================================================

import { CONFIG } from './config.js'

export function albumTracks(game, albumId) {
  return game.songs.filter((s) => s.albumId === albumId)
}

// Average production rating across the record, 0 if it has no tracks yet.
export function albumRating(game, albumId) {
  const tracks = albumTracks(game, albumId)
  if (!tracks.length) return 0
  const total = tracks.reduce((sum, s) => sum + s.production, 0)
  return Math.round((total / tracks.length) * 10) / 10
}

// How much every track on this record gains from being part of it.
// A single (no album) gets nothing.
export function albumBonus(trackCount) {
  if (!trackCount || trackCount < CONFIG.MIN_ALBUM_TRACKS) return 0
  return Math.min(trackCount * CONFIG.ALBUM_BONUS_PER_TRACK, CONFIG.ALBUM_MAX_BONUS)
}

export function getAlbum(game, albumId) {
  if (!albumId) return null
  return game.albums?.find((a) => a.id === albumId) || null
}

// Albums you can still add songs to.
export function openAlbums(game) {
  return (game.albums || []).filter((a) => !a.released)
}

// Total streams across every track on the record.
export function albumStreams(game, albumId) {
  return albumTracks(game, albumId).reduce((sum, s) => sum + s.totalStreams, 0)
}
