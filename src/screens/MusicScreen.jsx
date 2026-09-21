import { motion, AnimatePresence } from 'framer-motion'
import { SpotifyMark, AppleMark, YoutubeMark, WaveMark } from '../ui/icons.jsx'
import { PLATFORM_SPLIT } from '../game/config.js'
import { splitAcrossPlatforms } from '../game/simulate.js'
import { qualityLabel, qualityColor } from '../game/quality.js'
import { compact } from '../game/format.js'
import { getGenre } from '../game/genres.js'
import { SPRING, tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

const MARKS = {
  spotify: { Mark: SpotifyMark, bg: '#1DB954' },
  apple: { Mark: AppleMark, bg: '#FA243C' },
  youtube: { Mark: YoutubeMark, bg: '#ffffff' },
  soundwave: { Mark: WaveMark, bg: '#A855F7' },
}

// Rows from your screenshot that aren't built yet. Drawn but switched off so
// the layout is final and we can turn them on one at a time later.
const LOCKED_ROWS = ['AWARDS', 'CERTIFICATIONS', 'FESTIVALS', 'LABEL', 'MERCH']

export default function MusicScreen({ game, onCreateSong, onOpenSong, onOpenAlbums }) {
  const perPlatform = splitAcrossPlatforms(game.player.totalStreams)

  return (
    <div className="screen">
      <div className="screen-head">
        <motion.div className="pill" whileTap={tap}>
          SNAPSHOT
        </motion.div>
        <div className="screen-title">MUSIC</div>
      </div>

      {/* --- streaming platforms (display only in V1) --- */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
      >
        <div className="platforms">
          {PLATFORM_SPLIT.map((p) => {
            const { Mark, bg } = MARKS[p.id]
            return (
              <div className="platform" key={p.id}>
                <motion.div
                  className="platform-dot"
                  style={{ background: bg }}
                  whileTap={tapSmall}
                >
                  <Mark />
                </motion.div>
                <div className="platform-count">{compact(perPlatform[p.id] || 0)}</div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* --- ALBUMS --- */}
      <motion.button
        className="row"
        whileTap={tapSmall}
        onClick={onOpenAlbums}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.04 }}
      >
        <span className="row-label">ALBUMS</span>
        <span className="row-actions">
          {game.albums.length > 0 && (
            <span className="circle-btn gold">{game.albums.length}</span>
          )}
          <span className="circle-btn">→</span>
        </span>
      </motion.button>

      {/* --- SONGS row: the + is how you make a song --- */}
      <motion.div
        className="row"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.05 }}
      >
        <span className="row-label">SONGS</span>
        <span className="row-actions">
          <span className="circle-btn gold" title="songs in your catalogue">
            {game.songs.length}
          </span>
          <motion.button className="circle-btn" whileTap={tapSmall} onClick={onCreateSong}>
            +
          </motion.button>
        </span>
      </motion.div>

      {/* --- your catalogue --- */}
      <AnimatePresence initial={false}>
        {game.songs.length === 0 ? (
          <motion.div
            className="empty"
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            No songs yet.
            <br />
            Hit the <strong>+</strong> above to make your first one.
          </motion.div>
        ) : (
          <motion.div key="list" variants={listContainer} initial="hidden" animate="show">
            {game.songs.map((song) => (
              <SongRow key={song.id} song={song} onOpen={() => onOpenSong(song.id)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- coming later --- */}
      <div style={{ marginTop: 26, opacity: 0.38 }}>
        {LOCKED_ROWS.map((label) => (
          <div className="row" key={label}>
            <span className="row-label">{label}</span>
            <span className="circle-btn">→</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SongRow({ song, onOpen }) {
  const color = qualityColor(song.production)
  const genre = getGenre(song.genreId)

  return (
    <motion.button
      className={`song ${song.released ? '' : 'unreleased'}`}
      variants={listItem}
      layout
      whileTap={tapSmall}
      onClick={onOpen}
    >
      <div className="song-art" style={{ background: color }}>
        {song.title.charAt(0).toUpperCase() || '?'}
      </div>

      <div className="song-main">
        <div className="song-title">
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</span>
          {song.explicit && <span className="tag-e">E</span>}
          {!song.released && <span className="tag-draft">UNRELEASED</span>}
        </div>
        <div className="song-sub">
          {song.released ? (
            <>
              {song.featuring ? `feat. ${song.featuring.name} · ` : ''}
              {genre.name} · {compact(song.totalStreams)} streams
              {song.lastWeekStreams > 0 && ` · +${compact(song.lastWeekStreams)} last wk`}
            </>
          ) : (
            <>{genre.name} · tap to polish and release</>
          )}
        </div>
      </div>

      <div className="song-right">
        <div className="song-q" style={{ color }}>
          {Math.round(song.production)}
        </div>
        <div className="song-q-label">{qualityLabel(song.production)}</div>
      </div>
    </motion.button>
  )
}
