import { motion } from 'framer-motion'
import { Bolt } from '../ui/icons.jsx'
import { CONFIG } from '../game/config.js'
import { LIFESTYLE, LOCKED_CATEGORIES, weeklyExpenses, getTier } from '../game/lifestyle.js'
import { money, moneyExact } from '../game/format.js'
import { SPRING, tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

export default function LifestyleScreen({ game, onFindJob, onQuitJob, onOpenCategory }) {
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

      <div className="expense-line" style={{ marginTop: -6 }}>
        Weekly Expenses:{' '}
        {moneyExact(CONFIG.BASE_WEEKLY_EXPENSE + weeklyExpenses(game.player.lifestyle))}
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

        {LIFESTYLE.map((cat) => {
          const tier = getTier(cat.id, game.player.lifestyle[cat.id])
          return (
            <motion.button
              className="row"
              key={cat.id}
              variants={listItem}
              whileTap={tapSmall}
              onClick={() => onOpenCategory(cat.id)}
            >
              <span className="row-label">{cat.name}</span>
              <span className="row-actions">
                {tier && <span className="owned-tag">{tier.name}</span>}
                <span className="circle-btn">→</span>
              </span>
            </motion.button>
          )
        })}

        {LOCKED_CATEGORIES.map((label) => (
          <motion.div className="row" key={label} variants={listItem} style={{ opacity: 0.38 }}>
            <span className="row-label">{label}</span>
            <span className="circle-btn">→</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
