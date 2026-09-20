import { useState } from 'react'
import { motion } from 'framer-motion'
import { GENRES } from '../game/genres.js'
import { SPRING, tap, listContainer, listItem } from '../ui/motion.js'

// The one-time screen you see before your career starts.
export default function SetupScreen({ onStart }) {
  const [name, setName] = useState('')
  const [genreId, setGenreId] = useState('rnb')

  const ready = name.trim().length > 0

  return (
    <motion.div
      className="setup"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
    >
      <div className="setup-logo">
        Producer<span>.io</span>
      </div>
      <div className="setup-tag">
        Write it, produce it, drop it. Build a catalogue from nothing and see how
        far you get.
      </div>

      <div className="field-label">ARTIST NAME</div>
      <input
        className="setup-input"
        placeholder="Enter your artist name"
        value={name}
        maxLength={22}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="field-label" style={{ marginTop: 28 }}>
        MAIN GENRE
      </div>
      <motion.div
        className="genre-grid"
        variants={listContainer}
        initial="hidden"
        animate="show"
      >
        {GENRES.map((g) => (
          <motion.button
            key={g.id}
            variants={listItem}
            whileTap={tap}
            className={`genre-btn ${genreId === g.id ? 'on' : ''}`}
            onClick={() => setGenreId(g.id)}
          >
            {g.name}
          </motion.button>
        ))}
      </motion.div>

      <div style={{ flex: 1 }} />

      <motion.button
        className="create-btn"
        whileTap={ready ? tap : undefined}
        disabled={!ready}
        onClick={() => onStart({ name: name.trim(), genreId })}
        style={{ marginBottom: 28 }}
      >
        START CAREER
      </motion.button>
    </motion.div>
  )
}
