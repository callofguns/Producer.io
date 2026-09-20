// ============================================================================
// config.js  —  EVERY tunable number in the game lives here.
// If you want to make the game easier, harder, or faster, change it HERE.
// You should never have to touch the UI files to rebalance the game.
// ============================================================================

export const CONFIG = {
  // --- Calendar -------------------------------------------------------------
  START_YEAR: 2023,
  WEEKS_PER_YEAR: 52,

  // --- Energy ---------------------------------------------------------------
  MAX_ENERGY: 100,          // the "100 | 100" in the top bar
  ENERGY_PER_SONG: 10,      // matches the "CREATE 10 ⚡" button
  // Energy refills completely every time you press END WEEK.

  // --- Money ----------------------------------------------------------------
  START_CASH: 0,
  PAYOUT_PER_STREAM: 0.004, // dollars earned per stream (~$4 per 1,000 streams)

  // --- Starting traits (the ARTIST TRAITS / BUSINESS TRAITS screen) ---------
  // Everything starts at 1 except the two business traits, which start at 2,
  // matching your screenshot.
  START_TRAITS: {
    vocals: 1,
    songwriting: 1,
    rhythm: 1,
    charisma: 1,
    virality: 1,
    videoDirecting: 1,
    leadership: 2,
    marketing: 2,
  },
  MAX_TRAIT: 10,
  START_HOME_STUDIO_RATING: 5, // "Dhruv's Studio — 5 Rating | $0"

  // --- Training --------------------------------------------------------------
  // Training a trait costs energy, and the price goes up as the trait levels.
  // Cost = trait's base cost + floor((level - 1) / TRAIN_COST_STEP)
  // With a step of 2: levels 1-2 cost the base, 3-4 cost base+1, 5-6 base+2 ...
  TRAIN_COST_STEP: 2,
  // How many trainings fill the progress bar and push you to the next level.
  TRAININGS_PER_LEVEL: 8,

  // --- Fame -----------------------------------------------------------------
  START_FAME: 0,
  MAX_FAME: 100,
  // How much fame a song adds when released, scaled by its quality.
  FAME_GAIN_PER_RELEASE: 1.2,
  // Fame slowly decays if you release nothing — keeps you working.
  FAME_DECAY_PER_WEEK: 0.15,

  // --- Streams --------------------------------------------------------------
  // A song's streams in its FIRST week:
  //   base = QUALITY_STREAM_CURVE(quality) * (1 + fame bonus) * genre popularity
  // Streams a quality-50 song gets in week 1 at zero fame. This is the single
  // biggest dial for "how fast does money come in".
  FIRST_WEEK_BASE: 68000,
  // How much quality matters. 3.85 means a 90-quality song pulls roughly 600x
  // the streams of a 17-quality one. Great songs should feel like a different
  // universe, not a small upgrade.
  QUALITY_EXPONENT: 3.85,
  FAME_STREAM_MULTIPLIER: 4,// at max fame, songs get (1 + 4) = 5x the streams

  // After release, weekly streams decay. 0.72 = each week gets 72% of the last.
  STREAM_DECAY: 0.72,
  // Below this many weekly streams a song is considered "cold" and stops paying.
  STREAM_FLOOR: 5,

  // --- Song quality ---------------------------------------------------------
  // How much randomness is in a song. 0.85–1.15 means a song can come out 15%
  // worse or 15% better than its "expected" quality.
  LUCK_MIN: 0.85,
  LUCK_MAX: 1.15,
  MAX_QUALITY: 100,

  // The STUDIO slot isn't one of your three traits, so it works as a
  // multiplier on the finished song instead. Your free home studio sits at
  // rating 5, which lands on exactly 1.0 — no help, no penalty. The best
  // studio in the game (rating 10) gives +20%.
  STUDIO_NEUTRAL_RATING: 5,
  STUDIO_BONUS_PER_RATING: 0.04,

  // --- Trait effects on streams ---------------------------------------------
  // VIRALITY boosts a song's first week. At level 10 that's +90% streams.
  VIRALITY_BONUS_PER_LEVEL: 0.10,
  // MARKETING keeps songs alive longer by slowing the weekly decay.
  // At level 10 the decay moves from 0.72 up to about 0.81.
  MARKETING_DECAY_PER_LEVEL: 0.010,
  MAX_DECAY: 0.86, // safety cap so songs can never stop decaying entirely

  // --- Explicit tag ---------------------------------------------------------
  EXPLICIT_STREAM_BONUS: 0.06,  // +6% streams (edgier = more shares)
  EXPLICIT_RADIO_PENALTY: 0.03, // -3% (locked out of some family playlists)

  // --- Save -----------------------------------------------------------------
  SAVE_KEY: 'producer-io-save-v1',
}

// How the four platforms split a song's streams. Display only in V1 —
// the total is calculated first, then sliced up by these shares.
export const PLATFORM_SPLIT = [
  { id: 'spotify', name: 'Spotify', share: 0.46, color: '#1DB954' },
  { id: 'apple', name: 'Apple Music', share: 0.24, color: '#FA243C' },
  { id: 'youtube', name: 'YouTube Music', share: 0.21, color: '#FF0033' },
  { id: 'soundwave', name: 'Soundwave', share: 0.09, color: '#A855F7' },
]
