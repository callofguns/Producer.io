import { motion } from 'framer-motion'
import { compact, money } from '../game/format.js'
import { qualityLabel, qualityColor } from '../game/quality.js'
import { SPRING, SPRING_POP, tap } from './motion.js'

const STAT_NAMES = (k) =>
  ({ vocals: 'Vocals', songwriting: 'Songwriting', rhythm: 'Rhythm' }[k] || k)

function Scrim({ children, onClose }) {
  return (
    <motion.div
      className="scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal"
        initial={{ scale: 0.86, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={SPRING}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Shown right after a song is made, so the quality roll feels like a reveal.
export function SongResultModal({ song, onClose }) {
  const color = qualityColor(song.quality)
  return (
    <Scrim onClose={onClose}>
      <div className="modal-kicker">RELEASED</div>
      <div className="modal-title">{song.title}</div>

      <motion.div
        className="big-score"
        style={{ color }}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING_POP, delay: 0.12 }}
      >
        {song.quality}
      </motion.div>
      <div className="big-score-label" style={{ color }}>
        {qualityLabel(song.quality)}
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="stat-line">
          <span className="k">Musicality</span>
          <span>{song.credits.producer}</span>
        </div>
        <div className="stat-line">
          <span className="k">Songwriting</span>
          <span>{song.credits.writer}</span>
        </div>
        <div className="stat-line">
          <span className="k">Studio</span>
          <span>{song.credits.studio}</span>
        </div>
        <div className="stat-line">
          <span className="k">Spent</span>
          <span>{money(song.cost)}</span>
        </div>
      </div>

      {song.leveledUp?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.35 }}
          style={{
            marginTop: 14, padding: '10px 12px', borderRadius: 12,
            background: '#7fb84e22', color: 'var(--green)',
            fontSize: 13, fontWeight: 800, letterSpacing: 0.4,
          }}
        >
          STAT UP: {song.leveledUp.map(STAT_NAMES).join(', ')}
        </motion.div>
      )}

      <motion.button className="modal-btn" whileTap={tap} onClick={onClose}>
        NICE
      </motion.button>
    </Scrim>
  )
}

// Shown after END WEEK.
export function WeekReportModal({ report, onClose }) {
  return (
    <Scrim onClose={onClose}>
      <div className="modal-kicker">
        WEEK {report.week}, {report.year}
      </div>
      <div className="modal-title">{money(report.earned)} earned</div>

      <div className="stat-line">
        <span className="k">Streams this week</span>
        <span>{compact(report.streams)}</span>
      </div>
      <div className="stat-line">
        <span className="k">Songs out</span>
        <span>{report.songsOut}</span>
      </div>
      <div className="stat-line">
        <span className="k">Fame</span>
        <span style={{ color: report.fameGain >= 0 ? 'var(--green)' : 'var(--coral)' }}>
          {report.fameGain >= 0 ? '+' : ''}
          {report.fameGain.toFixed(2)}
        </span>
      </div>

      {report.topSongs.length > 0 && (
        <>
          <div className="field-label" style={{ marginTop: 18, textAlign: 'left' }}>
            TOP PERFORMERS
          </div>
          {report.topSongs.map((s) => (
            <div className="stat-line" key={s.id}>
              <span className="k" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.title}
              </span>
              <span>{compact(s.streams)}</span>
            </div>
          ))}
        </>
      )}

      {report.streams === 0 && (
        <div style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 600, marginTop: 14, lineHeight: 1.5 }}>
          Nothing is streaming yet. Make a song to start earning.
        </div>
      )}

      <motion.button className="modal-btn" whileTap={tap} onClick={onClose}>
        CONTINUE
      </motion.button>
    </Scrim>
  )
}
