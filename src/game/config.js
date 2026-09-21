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
  ENERGY_PER_RELEASE: 10,   // matches the "RELEASE 10 ⚡" button on a song
  ENERGY_PER_ALBUM_RELEASE: 25, // an album is a bigger push than a single

  // --- Featuring ------------------------------------------------------------
  // A guest artist lends you their verse and their audience. Their rating is
  // blended into the song's production, their virality into its virality —
  // so a big feature can carry a song well past your own traits.
  FEATURE_PRODUCTION_WEIGHT: 0.35,
  FEATURE_VIRALITY_WEIGHT: 0.5,

  // --- Albums ---------------------------------------------------------------
  // Tracks on an album cross-promote each other, so each extra track lifts
  // every track on the record a little. Capped so a 30-track album isn't an
  // automatic win.
  ALBUM_BONUS_PER_TRACK: 0.05,
  ALBUM_MAX_BONUS: 0.45,
  MIN_ALBUM_TRACKS: 2,

  // --- Polishing a song -----------------------------------------------------
  // On an unreleased song you can spend energy to nudge its Production Rating
  // or Virality up by +0.5 at a time. The price climbs as the stat climbs:
  //   cost = POLISH_BASE + (current stat / 2)
  // which lands on ⚡17 around a stat of 14, matching the reference footage.
  POLISH_STEP: 0.5,
  POLISH_BASE: 10,
  POLISH_SCALE: 0.5,
  // Energy refills completely every time you press END WEEK.

  // --- Lifestyle & jobs -----------------------------------------------------
  ENERGY_TO_FIND_JOB: 5,   // matches the "FIND A JOB ⚡5" row
  // The best-paying job in the game. Day jobs are meant to get you off the
  // ground, not to be a career — music has to overtake them quickly.
  MAX_JOB_PAY: 400,
  // You're billed this every week even with nothing bought — the reference
  // game shows "Weekly Expenses: $50" on a fresh save.
  BASE_WEEKLY_EXPENSE: 50,

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
  // Traits run 1-100.
  MAX_TRAIT: 100,
  START_HOME_STUDIO_RATING: 50, // your free home studio, mid-range on the 100 scale

  // --- Training --------------------------------------------------------------
  // One tap of the up arrow = +1 to the trait. The progress bar just shows how
  // close that trait is to 100.
  //
  // The energy price is (level + 1), times the trait's own multiplier — so it
  // goes up by 1 with every single point. See traits.js.
  //   normal trait:   2 at level 1, 5 at level 4, 100 at level 99
  //   Virality (x2):  4 at level 1, 200 at level 99
  //   business (x0.5, "level twice as fast")
  // Taking one normal trait all the way to 100 costs 5,049 energy — about 50
  // weeks of doing nothing but training.

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
  // rating 50, which lands on exactly 1.0 — no help, no penalty. The best
  // studio in the game (rating 95) gives +18%.
  STUDIO_NEUTRAL_RATING: 50,
  STUDIO_BONUS_PER_RATING: 0.004,

  // --- Trait effects on streams ---------------------------------------------
  // VIRALITY boosts a song's first week. At level 100 that's +99% streams.
  VIRALITY_BONUS_PER_LEVEL: 0.01,
  // MARKETING keeps songs alive longer by slowing the weekly decay.
  // At level 100 the decay moves from 0.72 up to about 0.82.
  MARKETING_DECAY_PER_LEVEL: 0.001,
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
