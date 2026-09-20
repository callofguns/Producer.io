import { motion } from 'framer-motion'
import { Bolt } from '../ui/icons.jsx'
import { CONFIG } from '../game/config.js'
import { money } from '../game/format.js'
import { SPRING, tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

// The categories you'll be able to spend on. Only FIND A JOB works so far —
// the rest are drawn but switched off until their upgrade ladders are in.
const CATEGORIES = ['FOOD', 'FASHION', 'HEALTH', 'HOME', 'RELATIONSHIPS', 'TRANSPORTATION']

export default function LifestyleScreen({ game, onFindJob, onQuitJob }) {
  const job = game.job
  const canLook = game.player.energy >= CONFIG.ENERGY_TO_FIND_JOB

  return (
    <div className="screen">
      <div className="screen-head">
        <motion.div className="pill coral" whileTap={tap}>
          VIEW EXPENSES
        </motion.div>
        <div className="screen-title">LIFESTYLE</div>
      </div>

      {/* --- the job you're working right now --- */}
      {job && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
        >
          <div className="field-label">CURRENT JOB</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{job.name}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)', marginTop: 3 }}>
                +{money(job.pay)}/week · {job.weeksLeft} week
                {job.weeksLeft === 1 ? '' : 's'} left · costs{' '}
                <span style={{ color: 'var(--coral)' }}>⚡{job.energy}</span>/week
              </div>
            </div>
            <motion.button className="quit-btn" whileTap={tap} onClick={onQuitJob}>
              QUIT
            </motion.button>
          </div>
        </motion.div>
      )}

      <motion.div variants={listContainer} initial="hidden" animate="show">
        <motion.button
          className="row"
          variants={listItem}
          whileTap={canLook ? tapSmall : undefined}
          onClick={onFindJob}
          style={{ opacity: canLook ? 1 : 0.5 }}
        >
          <span className="row-label">FIND A JOB</span>
          <span className="row-actions">
            <span className="job-energy">
              <Bolt size={15} />
              {CONFIG.ENERGY_TO_FIND_JOB}
            </span>
            <span className="circle-btn">→</span>
          </span>
        </motion.button>

        {CATEGORIES.map((label) => (
          <motion.div className="row" key={label} variants={listItem} style={{ opacity: 0.38 }}>
            <span className="row-label">{label}</span>
            <span className="circle-btn">→</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="cash-note" style={{ marginTop: 18, lineHeight: 1.6 }}>
        Spending more on your lifestyle will raise your weekly energy.
        <br />
        Not built yet.
      </div>
    </div>
  )
}
