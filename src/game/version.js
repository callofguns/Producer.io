// ============================================================================
// version.js — what version the game is on, and what changed in each one.
//
// When you ship something new: bump VERSION, add an entry to the top of
// CHANGELOG, and keep the "version" field in package.json in step.
// ============================================================================

export const VERSION = '0.1 beta'

// Newest first — this is what the UPDATE LOG screen lists.
export const CHANGELOG = [
  {
    version: '0.1 beta',
    date: '2026-09-21',
    title: 'First playable build',
    changes: [
      'Weekly career loop: make songs, release them, collect streams, end the week',
      'Create a song by hiring Musicality, Songwriting and a Studio — better people cost more',
      'Songs carry a Production Rating and a Virality rating, and are released separately from being made',
      'Polish an unreleased song to nudge either rating up, for energy',
      'Buy a marketing campaign before release, from Local to Global',
      'Artist and Business traits from 1 to 100, trained with energy',
      'Featured artists — buy a guest verse to lift a song past your own traits',
      'Albums — group songs onto a record, where tracks cross-promote each other',
      'Lifestyle spending on Food, Fashion, Health and Home, which raises your max energy',
      'Job board with weekly contracts for early income',
      'Installable as an app, and plays offline',
      'Progress saves automatically, with export and import',
    ],
  },
]
