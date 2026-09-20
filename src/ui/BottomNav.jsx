import { motion } from 'framer-motion'
import { MicIcon, NoteIcon, ChartIcon, HomeIcon, GearIcon } from './icons.jsx'
import { SPRING_POP, tapSmall } from './motion.js'

// Music, Traits, Lifestyle (home) and Settings are on. Only the Financials
// tab is still drawn-but-disabled.
const TABS = [
  { id: 'music', Icon: MicIcon, enabled: true },
  { id: 'traits', Icon: NoteIcon, enabled: true },
  { id: 'stats', Icon: ChartIcon, enabled: false },
  { id: 'home', Icon: HomeIcon, enabled: true },
  { id: 'settings', Icon: GearIcon, enabled: true },
]

export default function BottomNav({ tab, setTab }) {
  return (
    <div className="bottomnav">
      {TABS.map(({ id, Icon, enabled }) => (
        <motion.button
          key={id}
          className={`navbtn ${tab === id ? 'active' : ''}`}
          style={{ opacity: enabled ? 1 : 0.35, cursor: enabled ? 'pointer' : 'default' }}
          whileTap={enabled ? tapSmall : undefined}
          onClick={() => enabled && setTab(id)}
          aria-label={id}
        >
          <motion.span
            animate={{ scale: tab === id ? 1.12 : 1, y: tab === id ? -1 : 0 }}
            transition={SPRING_POP}
            style={{ display: 'grid', placeItems: 'center' }}
          >
            <Icon size={25} />
          </motion.span>
        </motion.button>
      ))}
    </div>
  )
}
