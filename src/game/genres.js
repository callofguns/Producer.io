// The genres you can pick for your artist and for each song.
// `popularity` scales how many streams songs in that genre pull (1.0 = average).
export const GENRES = [
  { id: 'pop',       name: 'Pop',       popularity: 1.15 },
  { id: 'hiphop',    name: 'Hip-Hop',   popularity: 1.12 },
  { id: 'rnb',       name: 'R&B',       popularity: 1.00 },
  { id: 'edm',       name: 'EDM',       popularity: 0.98 },
  { id: 'rock',      name: 'Rock',      popularity: 0.92 },
  { id: 'country',   name: 'Country',   popularity: 0.90 },
  { id: 'latin',     name: 'Latin',     popularity: 1.05 },
  { id: 'afrobeats', name: 'Afrobeats', popularity: 1.02 },
  { id: 'indie',     name: 'Indie',     popularity: 0.82 },
]

export function getGenre(id) {
  return GENRES.find((g) => g.id === id) || GENRES[0]
}

// A song in your artist's main genre gets a small bonus — you know that lane.
export const HOME_GENRE_BONUS = 1.08
