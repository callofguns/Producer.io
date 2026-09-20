import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import PhoneFrame from './ui/PhoneFrame.jsx'
import TopBar from './ui/TopBar.jsx'
import BottomNav from './ui/BottomNav.jsx'
import { SongResultModal, WeekReportModal } from './ui/Modals.jsx'

import SetupScreen from './screens/SetupScreen.jsx'
import MusicScreen from './screens/MusicScreen.jsx'
import CreateSongScreen from './screens/CreateSongScreen.jsx'
import TraitsScreen from './screens/TraitsScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'

import { createNewGame, createSong, trainTrait } from './game/state.js'
import { advanceWeek } from './game/simulate.js'
import { loadGame, saveGame, clearSave } from './game/save.js'
import { SPRING_SOFT } from './ui/motion.js'

export default function App() {
  // `game` is the entire save file. null means "no career started yet".
  const [game, setGame] = useState(() => loadGame())
  const [tab, setTab] = useState('music')
  const [creating, setCreating] = useState(false)   // is the CREATE A SONG page open?
  const [newSong, setNewSong] = useState(null)      // song to show in the reveal popup
  const [report, setReport] = useState(null)        // week summary popup

  // Autosave: any time the game changes, write it to localStorage.
  useEffect(() => {
    if (game) saveGame(game)
  }, [game])

  // ---- no career yet -> setup screen --------------------------------------
  if (!game) {
    return (
      <PhoneFrame>
        <SetupScreen onStart={(opts) => setGame(createNewGame(opts))} />
      </PhoneFrame>
    )
  }

  // ---- actions ------------------------------------------------------------
  function handleCreateSong(opts) {
    const result = createSong(game, opts)
    if (result.error) return
    setGame(result.game)
    setCreating(false)
    setNewSong(result.song)
  }

  function handleTrain(traitId) {
    const result = trainTrait(game, traitId)
    if (result.error) return
    setGame(result.game)
  }

  function handleEndWeek() {
    const { nextState, report: r } = advanceWeek(game)
    setGame(nextState)
    setReport(r)
  }

  function handleReset() {
    clearSave()
    setGame(null)
    setTab('music')
    setCreating(false)
  }

  function handleImport(file) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (parsed && parsed.player && Array.isArray(parsed.songs)) {
          setGame(parsed)
          setTab('music')
        } else {
          alert("That file doesn't look like a Producer.io save.")
        }
      } catch {
        alert("Couldn't read that file.")
      }
    }
    reader.readAsText(file)
  }

  // ---- main app -----------------------------------------------------------
  // Each screen gets a `key`. When the key changes, AnimatePresence springs the
  // old one out and the new one in.
  const screenKey = creating ? 'create' : tab

  return (
    <PhoneFrame>
      <TopBar game={game} onEndWeek={handleEndWeek} busy={creating} />

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, x: creating ? 40 : 0, y: creating ? 0 : 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: creating ? 0 : 0, y: -8 }}
            transition={SPRING_SOFT}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
          >
            {creating ? (
              <CreateSongScreen
                game={game}
                onBack={() => setCreating(false)}
                onCreate={handleCreateSong}
              />
            ) : tab === 'traits' ? (
              <TraitsScreen game={game} onTrain={handleTrain} />
            ) : tab === 'settings' ? (
              <SettingsScreen game={game} onReset={handleReset} onImport={handleImport} />
            ) : (
              <MusicScreen game={game} onCreateSong={() => setCreating(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav
        tab={tab}
        setTab={(t) => {
          setCreating(false)
          setTab(t)
        }}
      />

      <AnimatePresence>
        {newSong && (
          <SongResultModal key="song" song={newSong} onClose={() => setNewSong(null)} />
        )}
        {!newSong && report && (
          <WeekReportModal key="week" report={report} onClose={() => setReport(null)} />
        )}
      </AnimatePresence>
    </PhoneFrame>
  )
}
