import { motion } from 'framer-motion'
import { compact, money } from '../game/format.js'
import { SPRING, tap } from './motion.js'

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

// Shown after END WEEK.
export function WeekReportModal({ report, onClose }) {
  return (
    <Scrim onClose={onClose}>
      <div className="modal-kicker">
        WEEK {report.week}, {report.year}
      </div>
      <div className="modal-title">{money(report.earned + (report.wages || 0))} earned</div>

      <div className="stat-line">
        <span className="k">Streams this week</span>
        <span>{compact(report.streams)}</span>
      </div>
      {report.wages > 0 && (
        <div className="stat-line">
          <span className="k">{report.jobName}</span>
          <span style={{ color: 'var(--green)' }}>+{money(report.wages)}</span>
        </div>
      )}
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

      {report.jobEnded && (
        <div style={{ color: 'var(--gold)', fontSize: 13.5, fontWeight: 700, marginTop: 12 }}>
          Your contract ended. Time to find something else.
        </div>
      )}

      {report.streams === 0 && report.wages === 0 && (
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
