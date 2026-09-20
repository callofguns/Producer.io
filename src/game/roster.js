// ============================================================================
// roster.js — the people and places you can hire on the CREATE A SONG screen.
//
// Every list is sorted cheapest-first. They are ALL visible from week 1, but
// anything you can't afford is greyed out. Getting richer is how you unlock
// the good ones.
//
// `rating` is 1-10 and feeds the song quality calculation.
// ============================================================================

// Musicality = the producer / beatmaker behind the track.
export const PRODUCERS = [
  { id: 'p_local',    name: 'Lo-Fi Lenny',      rating: 2,  cost: 250 },
  { id: 'p_bedroom',  name: 'Basement 808s',    rating: 3,  cost: 900 },
  { id: 'p_upcoming', name: 'Kaia Rhodes',      rating: 4,  cost: 2600 },
  { id: 'p_rising',   name: 'NOVA',             rating: 5,  cost: 7000 },
  { id: 'p_charting', name: 'Silvertone',       rating: 6,  cost: 18000 },
  { id: 'p_hitmaker', name: 'Marco Vance',      rating: 7,  cost: 45000 },
  { id: 'p_platinum', name: 'The Midas Room',   rating: 8,  cost: 110000 },
  { id: 'p_legend',   name: 'Emory Sloane',     rating: 9,  cost: 260000 },
  { id: 'p_goat',     name: 'DR. HALO',         rating: 10, cost: 600000 },
]

// Songwriting = who actually writes the lyrics and melody.
export const WRITERS = [
  { id: 'w_friend',   name: 'Jules Park',       rating: 2,  cost: 200 },
  { id: 'w_open_mic', name: 'Sunny Adeyemi',    rating: 3,  cost: 750 },
  { id: 'w_credited', name: 'Remy Castellanos', rating: 4,  cost: 2200 },
  { id: 'w_pro',      name: 'Hazel Quinn',      rating: 5,  cost: 6000 },
  { id: 'w_topliner', name: 'Ivo Brandt',       rating: 6,  cost: 15000 },
  { id: 'w_hit',      name: 'Delphine Okoro',   rating: 7,  cost: 38000 },
  { id: 'w_elite',    name: 'Cass Mercier',     rating: 8,  cost: 95000 },
  { id: 'w_legend',   name: 'August Reyes',     rating: 9,  cost: 220000 },
  { id: 'w_goat',     name: 'THE PEN',          rating: 10, cost: 500000 },
]

// Studio = where it gets recorded and mixed.
// Your home studio is free and starts at rating 5 (see config START_HOME_STUDIO_RATING).
export const STUDIOS = [
  { id: 's_rehearsal', name: 'Rehearsal Room B', rating: 6,  cost: 400 },
  { id: 's_indie',     name: 'Tape Deck Studio', rating: 7,  cost: 1800 },
  { id: 's_pro',       name: 'Northline Sound',  rating: 8,  cost: 9000 },
  { id: 's_elite',     name: 'Grand Avenue',     rating: 9,  cost: 35000 },
  { id: 's_world',     name: 'Sterling Hall',    rating: 10, cost: 120000 },
]

// The free "yourself" option that sits at the front of each list.
// Its rating comes from YOUR stats, so these grow as you improve.
export function selfProducer(player) {
  return { id: 'self', name: player.name, rating: player.stats.rhythm, cost: 0, isSelf: true }
}
export function selfWriter(player) {
  return { id: 'self', name: `Written by ${player.name}`, rating: player.stats.songwriting, cost: 0, isSelf: true }
}
export function selfStudio(player) {
  return { id: 'self', name: `${player.name}'s Studio`, rating: player.homeStudioRating, cost: 0, isSelf: true }
}

// Full lists, with "you" always first.
export function producerOptions(player) { return [selfProducer(player), ...PRODUCERS] }
export function writerOptions(player)   { return [selfWriter(player), ...WRITERS] }
export function studioOptions(player)   { return [selfStudio(player), ...STUDIOS] }
