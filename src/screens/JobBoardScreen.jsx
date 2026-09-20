import { motion } from 'framer-motion'
import { Bolt } from '../ui/icons.jsx'
import { CONFIG } from '../game/config.js'
import { money } from '../game/format.js'
import { SPRING, tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

export default function JobBoardScreen({ game, onBack, onAccept, onRefresh }) {
  const canRefresh = game.player.energy >= CONFIG.ENERGY_TO_FIND_JOB

  return (
    <div className="screen">
      <div className="create-head">
        <motion.button className="back-btn" whileTap={tapSmall} onClick={onBack}>
          ←
        </motion.button>
        <span className="create-energy">
          <Bolt size={16} />
          {game.player.energy}
        </span>
        <span className="create-title" style={{ fontSize: 27 }}>
          JOB BOARD
        </span>
      </div>

      <motion.div variants={listContainer} initial="hidden" animate="show">
        {game.jobBoard.map((job) => {
          const working = game.job?.id === job.id
          return (
            <motion.button
              key={job.id}
              className="job-row"
              variants={listItem}
              whileTap={tapSmall}
              onClick={() => onAccept(job.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="job-title">
                  <span className="job-energy">{job.energy}</span>
                  <span className="job-sep">|</span>
                  {job.name}
                </div>
                <div className="job-meta">
                  <Bolt size={13} />
                  +{money(job.pay)}/week | {job.weeks}/week contract
                </div>
              </div>
              <span className={`mkt-dot ${working ? 'on' : ''}`} />
            </motion.button>
          )
        })}
      </motion.div>

      <motion.button
        className="detail-btn"
        whileTap={canRefresh ? tap : undefined}
        disabled={!canRefresh}
        onClick={onRefresh}
        style={{ marginTop: 18 }}
      >
        SEE OTHER JOBS {CONFIG.ENERGY_TO_FIND_JOB} <Bolt size={15} />
      </motion.button>

      <div className="cash-note" style={{ lineHeight: 1.6 }}>
        A job pays every week, but takes that energy off your weekly total for
        the whole contract.
      </div>
    </div>
  )
}
