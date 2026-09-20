import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import PhoneFrame from './ui/PhoneFrame.jsx'
import TopBar from './ui/TopBar.jsx'
import BottomNav from './ui/BottomNav.jsx'
import { WeekReportModal } from './ui/Modals.jsx'

import SetupScreen from './screens/SetupScreen.jsx'
import MusicScreen from './screens/MusicScreen.jsx'
import CreateSongScreen from './screens/CreateSongScreen.jsx'
import TraitsScreen from './screens/TraitsScreen.jsx'
import SongDetailScreen from './screens/SongDetailScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'

import {
  createNewGame,
  createSong,
  trainTrait,
  polishSong,
  releaseSong,
  setMarketing,
} from './game/state.js'
import { advanceWeek } from './game/simulate.js'
import { loadGame, saveGame, clearSave } from './game/save.js'
import { SPRING_SOFT } from './ui/motion.js'

export default function App() {
  // `game` is the entire save file. null means "no career started yet".
  const [game, setGame] = useState(() => loadGame())
  const [tab, setTab] = useState('music')
  const [creating, setCreating] = useState(false)   // is the CREATE A SONG page open?
  const [openSongId, setOpenSongId] = useState(null) // which song's page is open
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
  // Making a song no longer puts it out. You land on the song's own page,
  // where you can polish it and then release it when you're ready.
  function handleCreateSong(opts) {
    const result = createSong(game, opts)
    if (result.error) return
    setGame(result.game)
    setCreating(false)
    setOpenSongId(result.song.id)
  }

  function handlePolish(songId, which) {
    const result = polishSong(game, songId, which)
    if (!result.error) setGame(result.game)
  }

  function handleRelease(songId) {
    const result = releaseSong(game, songId)
    if (!result.error) setGame(result.game)
  }

  function handleSetMarketing(songId, tierId) {
    const result = setMarketing(game, songId, tierId)
    if (!result.error) setGame(result.game)
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
    setOpenSongId(null)
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
  const openSong = openSongId ? game.songs.find((s) => s.id === openSongId) : null
  const screenKey = creating ? 'create' : openSong ? `song-${openSong.id}` : tab

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
            ) : openSong ? (
              <SongDetailScreen
                game={game}
                song={openSong}
                onBack={() => setOpenSongId(null)}
                onPolish={handlePolish}
                onRelease={handleRelease}
                onSetMarketing={handleSetMarketing}
              />
            ) : tab === 'traits' ? (
              <TraitsScreen game={game} onTrain={handleTrain} />
            ) : tab === 'settings' ? (
              <SettingsScreen game={game} onReset={handleReset} onImport={handleImport} />
            ) : (
              <MusicScreen
                game={game}
                onCreateSong={() => setCreating(true)}
                onOpenSong={setOpenSongId}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav
        tab={tab}
        setTab={(t) => {
          setCreating(false)
          setOpenSongId(null)
          setTab(t)
        }}
      />

      <AnimatePresence>
        {report && (
          <WeekReportModal key="week" report={report} onClose={() => setReport(null)} />
        )}
      </AnimatePresence>
    </PhoneFrame>
  )
}
