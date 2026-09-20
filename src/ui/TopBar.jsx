import { motion } from 'framer-motion'
import { Bolt } from './icons.jsx'
import { money } from '../game/format.js'
import { CONFIG } from '../game/config.js'
import { SPRING, tap } from './motion.js'

// The dark bar at the very top: cash, energy, END WEEK, and the date.
export default function TopBar({ game, onEndWeek, busy }) {
  const { cash, energy } = game.player

  return (
    <div className="topbar">
      <div>
        {/* key={} makes framer re-run the animation whenever the number changes,
            so cash "pops" when you earn or spend. */}
        <motion.div
          className="topbar-cash"
          key={Math.floor(cash)}
          initial={{ scale: 1.18, color: '#7fb84e' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={SPRING}
        >
          {money(cash)}
        </motion.div>

        <motion.div
          className="topbar-energy"
          key={`e-${energy}`}
          initial={{ scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={SPRING}
        >
          <Bolt size={17} />
          <span>{energy}</span>
          <span className="sep">|</span>
          <span>{CONFIG.MAX_ENERGY}</span>
        </motion.div>
      </div>

      <div>
        <motion.button className="end-week" whileTap={tap} onClick={onEndWeek} disabled={busy}>
          END WEEK
        </motion.button>
        <div className="topbar-date">
          Week {game.week}, {game.year}
        </div>
      </div>
    </div>
  )
}
