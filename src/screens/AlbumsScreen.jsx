import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { albumTracks, albumRating, albumStreams } from '../game/albums.js'
import { qualityColor, qualityLabel } from '../game/quality.js'
import { compact } from '../game/format.js'
import { SPRING, tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

export default function AlbumsScreen({ game, onBack, onOpenAlbum, onCreateAlbum }) {
  const [naming, setNaming] = useState(false)
  const [title, setTitle] = useState('')

  function submit() {
    if (!title.trim()) return
    onCreateAlbum(title)
    setTitle('')
    setNaming(false)
  }

  return (
    <div className="screen">
      <div className="create-head">
        <motion.button className="back-btn" whileTap={tapSmall} onClick={onBack}>
          ←
        </motion.button>
        <span className="create-title">ALBUMS</span>
      </div>

      <motion.button
        className="detail-btn primary"
        whileTap={tap}
        onClick={() => setNaming(true)}
        style={{ marginBottom: 18 }}
      >
        + START AN ALBUM
      </motion.button>

      {game.albums.length === 0 ? (
        <div className="empty">
          No albums yet.
          <br />
          Start one, then put new songs on it instead of releasing singles.
        </div>
      ) : (
        <motion.div variants={listContainer} initial="hidden" animate="show">
          {game.albums.map((album) => {
            const tracks = albumTracks(game, album.id)
            const rating = albumRating(game, album.id)
            const color = qualityColor(rating)
            return (
              <motion.button
                key={album.id}
                className="song"
                variants={listItem}
                whileTap={tapSmall}
                onClick={() => onOpenAlbum(album.id)}
              >
                <div className="song-art" style={{ background: color }}>
                  {album.title.charAt(0).toUpperCase()}
                </div>
                <div className="song-main">
                  <div className="song-title">
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {album.title}
                    </span>
                    {!album.released && <span className="tag-draft">UNRELEASED</span>}
                  </div>
                  <div className="song-sub">
                    {tracks.length} track{tracks.length === 1 ? '' : 's'}
                    {album.released
                      ? ` · ${compact(albumStreams(game, album.id))} streams`
                      : ' · tap to add and release'}
                  </div>
                </div>
                <div className="song-right">
                  <div className="song-q" style={{ color }}>
                    {rating ? Math.round(rating) : '–'}
                  </div>
                  <div className="song-q-label">{rating ? qualityLabel(rating) : 'EMPTY'}</div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      )}

      <AnimatePresence>
        {naming && (
          <motion.div
            className="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNaming(false)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={SPRING}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-kicker">NEW ALBUM</div>
              <div className="modal-title" style={{ fontSize: 22 }}>
                Name the record
              </div>
              <input
                className="setup-input"
                placeholder="Album title"
                value={title}
                maxLength={28}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <motion.button
                className="modal-btn"
                whileTap={tap}
                disabled={!title.trim()}
                style={{ opacity: title.trim() ? 1 : 0.5 }}
                onClick={submit}
              >
                CREATE
              </motion.button>
              <motion.button
                className="modal-btn ghost"
                whileTap={tap}
                onClick={() => setNaming(false)}
                style={{ marginTop: 10 }}
              >
                CANCEL
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
