// ============================================================================
// save.js — reading and writing your progress to the browser's localStorage.
// localStorage is just a tiny key/value store built into every browser.
// It survives refreshes and closing the tab, but it lives on THIS browser only.
// ============================================================================

import { CONFIG } from './config.js'
import { migrate } from './state.js'

export function loadGame() {
  try {
    const raw = localStorage.getItem(CONFIG.SAVE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // A very light sanity check so a corrupted save doesn't crash the game.
    if (!parsed || typeof parsed !== 'object' || !parsed.player) return null
    // Fills in anything an older save is missing so it doesn't crash.
    return migrate(parsed)
  } catch {
    return null
  }
}

export function saveGame(game) {
  try {
    localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(game))
    return true
  } catch {
    return false // e.g. private browsing with storage blocked
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(CONFIG.SAVE_KEY)
  } catch {
    /* ignore */
  }
}

// Download the current save as a .json file you can keep or move to another browser.
export function exportSave(game) {
  const blob = new Blob([JSON.stringify(game, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `producer-io-${game.player.name || 'save'}-w${game.week}.json`
  a.click()
  URL.revokeObjectURL(url)
}
