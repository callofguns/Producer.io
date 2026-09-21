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
import LifestyleScreen from './screens/LifestyleScreen.jsx'
import JobBoardScreen from './screens/JobBoardScreen.jsx'
import LifestyleCategoryScreen from './screens/LifestyleCategoryScreen.jsx'
import AlbumsScreen from './screens/AlbumsScreen.jsx'
import AlbumDetailScreen from './screens/AlbumDetailScreen.jsx'
import UpdateLogScreen from './screens/UpdateLogScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'

import {
  createNewGame,
  createSong,
  trainTrait,
  polishSong,
  releaseSong,
  setMarketing,
  refreshJobBoard,
  acceptJob,
  quitJob,
  setLifestyle,
  clearLifestyle,
  createAlbum,
  releaseAlbum,
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
  const [jobBoardOpen, setJobBoardOpen] = useState(false)
  const [openCategory, setOpenCategory] = useState(null)
  const [albumsOpen, setAlbumsOpen] = useState(false)
  const [openAlbumId, setOpenAlbumId] = useState(null)
  const [updateLogOpen, setUpdateLogOpen] = useState(false)

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

  function handleFindJob() {
    // Looking at the board costs energy, same as refreshing it.
    const result = refreshJobBoard(game)
    if (result.error) return
    setGame(result.game)
    setJobBoardOpen(true)
  }

  function handleAcceptJob(jobId) {
    const result = acceptJob(game, jobId)
    if (!result.error) setGame(result.game)
    setJobBoardOpen(false)
  }

  function handleQuitJob() {
    setGame(quitJob(game).game)
  }

  // Returns the new album's id so the create-song screen can select it
  // straight away.
  function handleCreateAlbum(title) {
    const result = createAlbum(game, title)
    if (result.error) return null
    setGame(result.game)
    return result.album.id
  }

  function handleReleaseAlbum(albumId) {
    const result = releaseAlbum(game, albumId)
    if (!result.error) setGame(result.game)
  }

  function handlePickLifestyle(categoryId, tierId) {
    const result = setLifestyle(game, categoryId, tierId)
    if (!result.error) setGame(result.game)
  }

  function handleClearLifestyle(categoryId) {
    setGame(clearLifestyle(game, categoryId).game)
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
    setJobBoardOpen(false)
    setOpenCategory(null)
    setAlbumsOpen(false)
    setOpenAlbumId(null)
    setUpdateLogOpen(false)
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
  const screenKey = updateLogOpen
    ? 'updatelog'
    : creating
      ? 'create'
      : openSong
        ? `song-${openSong.id}`
        : openAlbumId
          ? `album-${openAlbumId}`
          : albumsOpen
            ? 'albums'
            : jobBoardOpen
              ? 'jobs'
              : openCategory
                ? `cat-${openCategory}`
                : tab

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
            {updateLogOpen ? (
              <UpdateLogScreen onBack={() => setUpdateLogOpen(false)} />
            ) : creating ? (
              <CreateSongScreen
                game={game}
                onBack={() => setCreating(false)}
                onCreate={handleCreateSong}
                onCreateAlbum={handleCreateAlbum}
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
            ) : openAlbumId ? (
              <AlbumDetailScreen
                game={game}
                albumId={openAlbumId}
                onBack={() => setOpenAlbumId(null)}
                onRelease={handleReleaseAlbum}
                onOpenSong={(id) => {
                  setOpenAlbumId(null)
                  setAlbumsOpen(false)
                  setOpenSongId(id)
                }}
              />
            ) : albumsOpen ? (
              <AlbumsScreen
                game={game}
                onBack={() => setAlbumsOpen(false)}
                onOpenAlbum={setOpenAlbumId}
                onCreateAlbum={handleCreateAlbum}
              />
            ) : jobBoardOpen ? (
              <JobBoardScreen
                game={game}
                onBack={() => setJobBoardOpen(false)}
                onAccept={handleAcceptJob}
                onRefresh={() => {
                  const r = refreshJobBoard(game)
                  if (!r.error) setGame(r.game)
                }}
              />
            ) : openCategory ? (
              <LifestyleCategoryScreen
                game={game}
                categoryId={openCategory}
                onBack={() => setOpenCategory(null)}
                onPick={handlePickLifestyle}
                onClear={handleClearLifestyle}
              />
            ) : tab === 'home' ? (
              <LifestyleScreen
                game={game}
                onFindJob={handleFindJob}
                onQuitJob={handleQuitJob}
                onOpenCategory={setOpenCategory}
              />
            ) : tab === 'traits' ? (
              <TraitsScreen game={game} onTrain={handleTrain} />
            ) : tab === 'settings' ? (
              <SettingsScreen
                game={game}
                onReset={handleReset}
                onImport={handleImport}
                onOpenUpdateLog={() => setUpdateLogOpen(true)}
              />
            ) : (
              <MusicScreen
                game={game}
                onCreateSong={() => setCreating(true)}
                onOpenSong={setOpenSongId}
                onOpenAlbums={() => setAlbumsOpen(true)}
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
          setJobBoardOpen(false)
          setOpenCategory(null)
          setAlbumsOpen(false)
          setOpenAlbumId(null)
          setUpdateLogOpen(false)
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
