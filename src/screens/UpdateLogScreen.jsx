import { motion } from 'framer-motion'
import { CHANGELOG } from '../game/version.js'
import { tapSmall, listContainer, listItem } from '../ui/motion.js'

export default function UpdateLogScreen({ onBack }) {
  return (
    <div className="screen">
      <div className="create-head">
        <motion.button className="back-btn" whileTap={tapSmall} onClick={onBack}>
          ←
        </motion.button>
        <span className="create-title" style={{ fontSize: 27 }}>
          UPDATE LOG
        </span>
      </div>

      <motion.div variants={listContainer} initial="hidden" animate="show">
        {CHANGELOG.map((entry) => (
          <motion.div className="card release" key={entry.version} variants={listItem}>
            <div className="release-head">
              <span className="release-version">{entry.version}</span>
              <span className="release-date">{entry.date}</span>
            </div>
            <div className="release-title">{entry.title}</div>
            <ul className="release-list">
              {entry.changes.map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      <div className="cash-note" style={{ lineHeight: 1.6, marginTop: 6 }}>
        Producer.io is in beta — saves may need resetting as the game changes.
      </div>
    </div>
  )
}
