// ============================================================================
// roster.js — the people and places you can hire on the CREATE A SONG screen.
//
// Every list is sorted cheapest-first. They are ALL visible from week 1, but
// anything you can't afford is greyed out. Getting richer is how you unlock
// the good ones.
//
// `rating` is on the same 1-100 scale as your own traits, and feeds the song
// quality calculation. The roster runs from 15 up to 95, so a fully maxed
// artist (100) is still better than anyone you can hire.
// ============================================================================

// Musicality = the producer / beatmaker behind the track.
export const PRODUCERS = [
  { id: 'p_local',    name: 'Lo-Fi Lenny',      rating: 15, cost: 250 },
  { id: 'p_bedroom',  name: 'Basement 808s',    rating: 25, cost: 900 },
  { id: 'p_upcoming', name: 'Kaia Rhodes',      rating: 35, cost: 2600 },
  { id: 'p_rising',   name: 'NOVA',             rating: 45, cost: 7000 },
  { id: 'p_charting', name: 'Silvertone',       rating: 55, cost: 18000 },
  { id: 'p_hitmaker', name: 'Marco Vance',      rating: 65, cost: 45000 },
  { id: 'p_platinum', name: 'The Midas Room',   rating: 75, cost: 110000 },
  { id: 'p_legend',   name: 'Emory Sloane',     rating: 85, cost: 260000 },
  { id: 'p_goat',     name: 'DR. HALO',         rating: 95, cost: 600000 },
]

// Songwriting = who actually writes the lyrics and melody.
export const WRITERS = [
  { id: 'w_friend',   name: 'Jules Park',       rating: 15, cost: 200 },
  { id: 'w_open_mic', name: 'Sunny Adeyemi',    rating: 25, cost: 750 },
  { id: 'w_credited', name: 'Remy Castellanos', rating: 35, cost: 2200 },
  { id: 'w_pro',      name: 'Hazel Quinn',      rating: 45, cost: 6000 },
  { id: 'w_topliner', name: 'Ivo Brandt',       rating: 55, cost: 15000 },
  { id: 'w_hit',      name: 'Delphine Okoro',   rating: 65, cost: 38000 },
  { id: 'w_elite',    name: 'Cass Mercier',     rating: 75, cost: 95000 },
  { id: 'w_legend',   name: 'August Reyes',     rating: 85, cost: 220000 },
  { id: 'w_goat',     name: 'THE PEN',          rating: 95, cost: 500000 },
]

// Studio = where it gets recorded and mixed.
// Your home studio is free and starts at rating 50 (see config START_HOME_STUDIO_RATING),
// which is exactly neutral for song quality.
export const STUDIOS = [
  { id: 's_rehearsal', name: 'Rehearsal Room B', rating: 60, cost: 400 },
  { id: 's_indie',     name: 'Tape Deck Studio', rating: 70, cost: 1800 },
  { id: 's_pro',       name: 'Northline Sound',  rating: 80, cost: 9000 },
  { id: 's_elite',     name: 'Grand Avenue',     rating: 90, cost: 35000 },
  { id: 's_world',     name: 'Sterling Hall',    rating: 95, cost: 120000 },
]

// The free "yourself" option that sits at the front of each list.
// Its rating comes from YOUR stats, so these grow as you improve.
export function selfProducer(player) {
  return { id: 'self', name: player.name, rating: player.traits.rhythm, cost: 0, isSelf: true }
}
export function selfWriter(player) {
  return { id: 'self', name: `Written by ${player.name}`, rating: player.traits.songwriting, cost: 0, isSelf: true }
}
export function selfStudio(player) {
  return { id: 'self', name: `${player.name}'s Studio`, rating: player.homeStudioRating, cost: 0, isSelf: true }
}

// Full lists, with "you" always first.
export function producerOptions(player) { return [selfProducer(player), ...PRODUCERS] }
export function writerOptions(player)   { return [selfWriter(player), ...WRITERS] }
export function studioOptions(player)   { return [selfStudio(player), ...STUDIOS] }
