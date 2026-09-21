// ============================================================================
// artists.js — the FEATURED ARTISTS roster you can buy a guest verse from.
//
// Each artist has three numbers, matching the reference screen's three columns:
//   virality — how far their audience spreads a song (the TRENDING column)
//   rating   — how good their verse is, which lifts the song's production
//   fee      — a flat one-off cost, paid when you make the song
//
// A feature is the fastest way to make a song punch above your own traits,
// which is exactly why the good ones cost a fortune.
//
// NOTE: these are original invented artists, in the same style as the
// producers and writers in roster.js. If you'd rather use the parody names
// from the reference game, this is the only file that needs swapping.
// ============================================================================

export const FEATURED_ARTISTS = [
  // --- untouchable ---------------------------------------------------------
  { id: 'a_halo',     name: 'SAINT HALO',      virality: 100, rating: 103, fee: 1280000 },
  { id: 'a_vega',     name: 'LUNA VEGA',       virality: 103, rating: 98,  fee: 1050000 },
  { id: 'a_kx',       name: 'KING XAVI',       virality: 94,  rating: 98,  fee: 980000 },
  { id: 'a_mira',     name: 'MIRA SOLENNE',    virality: 89,  rating: 97,  fee: 880000 },
  { id: 'a_drayton',  name: 'DRAYTON',         virality: 99,  rating: 96,  fee: 840000 },
  { id: 'a_bexley',   name: 'BEXLEY ROSE',     virality: 84,  rating: 93,  fee: 700000 },

  // --- superstars ----------------------------------------------------------
  { id: 'a_okonjo',   name: 'ZAYA OKONJO',     virality: 98,  rating: 93,  fee: 660000 },
  { id: 'a_tworiver', name: 'TWO RIVERS',      virality: 87,  rating: 91,  fee: 540000 },
  { id: 'a_cairo',    name: 'CAIRO BLUE',      virality: 104, rating: 90,  fee: 510000 },
  { id: 'a_pindrop',  name: 'PINDROP',         virality: 101, rating: 90,  fee: 480000 },
  { id: 'a_swan',     name: 'ODETTE SWAN',     virality: 91,  rating: 89,  fee: 440000 },
  { id: 'a_marrow',   name: 'MARROW',          virality: 86,  rating: 89,  fee: 415000 },
  { id: 'a_lennox',   name: 'JUDE LENNOX',     virality: 82,  rating: 88,  fee: 380000 },
  { id: 'a_okoro',    name: 'DELPHI OKORO',    virality: 77,  rating: 88,  fee: 355000 },

  // --- stars ---------------------------------------------------------------
  { id: 'a_baptiste', name: 'REN BAPTISTE',    virality: 85,  rating: 86,  fee: 290000 },
  { id: 'a_gold',     name: 'GOLDTOOTH',       virality: 76,  rating: 85,  fee: 265000 },
  { id: 'a_ivory',    name: 'IVORY LANE',      virality: 80,  rating: 84,  fee: 240000 },
  { id: 'a_kestrel',  name: 'KESTREL',         virality: 83,  rating: 82,  fee: 205000 },
  { id: 'a_rook',     name: 'RILEY ROOK',      virality: 68,  rating: 80,  fee: 175000 },
  { id: 'a_sable',    name: 'SABLE MONROE',    virality: 75,  rating: 78,  fee: 150000 },
  { id: 'a_azure',    name: 'AZURE',           virality: 71,  rating: 76,  fee: 125000 },
  { id: 'a_caspian',  name: 'CASPIAN GREY',    virality: 65,  rating: 74,  fee: 105000 },

  // --- established ---------------------------------------------------------
  { id: 'a_tamsin',   name: 'TAMSIN HOLT',     virality: 69,  rating: 70,  fee: 78000 },
  { id: 'a_verde',    name: 'NICO VERDE',      virality: 62,  rating: 67,  fee: 62000 },
  { id: 'a_plume',    name: 'PLUME',           virality: 73,  rating: 65,  fee: 54000 },
  { id: 'a_odell',    name: 'MARCUS ODELL',    virality: 55,  rating: 62,  fee: 42000 },
  { id: 'a_fen',      name: 'FENWAY',          virality: 60,  rating: 58,  fee: 32000 },
  { id: 'a_juniper',  name: 'JUNIPER WILDE',   virality: 52,  rating: 55,  fee: 25000 },

  // --- rising --------------------------------------------------------------
  { id: 'a_halcyon',  name: 'HALCYON',         virality: 58,  rating: 51,  fee: 19000 },
  { id: 'a_briar',    name: 'BRIAR KANE',      virality: 45,  rating: 47,  fee: 14000 },
  { id: 'a_otis',     name: 'OTIS FRAY',       virality: 41,  rating: 43,  fee: 10500 },
  { id: 'a_nova2',    name: 'NOVA SAINT',      virality: 49,  rating: 39,  fee: 8000 },
  { id: 'a_wren',     name: 'WREN ASHBY',      virality: 33,  rating: 35,  fee: 6000 },

  // --- newcomers -----------------------------------------------------------
  { id: 'a_cobalt',   name: 'COBALT',          virality: 30,  rating: 29,  fee: 4200 },
  { id: 'a_pearl',    name: 'PEARL DIVER',     virality: 24,  rating: 24,  fee: 3000 },
  { id: 'a_moss',     name: 'MOSS',            virality: 18,  rating: 19,  fee: 2100 },
  { id: 'a_tinley',   name: 'TINLEY',          virality: 12,  rating: 13,  fee: 1400 },
  { id: 'a_dusk',     name: 'DUSK CHOIR',      virality: 7,   rating: 8,   fee: 850 },
  { id: 'a_sparrow',  name: 'SPARROW',         virality: 4,   rating: 5,   fee: 400 },
]

// The reference screen lists the biggest names first.
export const ARTISTS_BY_RATING = [...FEATURED_ARTISTS].sort((a, b) => b.rating - a.rating)

export function getArtist(id) {
  if (!id) return null
  return FEATURED_ARTISTS.find((a) => a.id === id) || null
}

// The word under the virality number on the reference screen.
export function trendLabel(virality) {
  if (virality >= 90) return 'RED HOT'
  if (virality >= 70) return 'TRENDING'
  if (virality >= 45) return 'STEADY'
  if (virality >= 20) return 'QUIET'
  return 'UNKNOWN'
}
