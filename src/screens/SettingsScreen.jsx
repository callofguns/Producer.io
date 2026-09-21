import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { exportSave } from '../game/save.js'
import { getGenre } from '../game/genres.js'
import { skillLevel } from '../game/traits.js'
import { VERSION } from '../game/version.js'
import { compact, money } from '../game/format.js'
import { SPRING, tap } from '../ui/motion.js'

export default function SettingsScreen({ game, onReset, onImport, onOpenUpdateLog }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="screen">
      <div className="screen-head">
        <div style={{ width: 1 }} />
        <div className="screen-title">SETTINGS</div>
      </div>

      <div className="field-label">CAREER</div>
      <div className="setting-row">
        <span>Artist</span>
        <span className="v">{game.player.name}</span>
      </div>
      <div className="setting-row">
        <span>Main genre</span>
        <span className="v">{getGenre(game.player.genreId).name}</span>
      </div>
      <div className="setting-row">
        <span>Skill level</span>
        <span className="v">{skillLevel(game.player.traits)}</span>
      </div>
      <div className="setting-row">
        <span>Fame</span>
        <span className="v">{game.player.fame.toFixed(1)} / 100</span>
      </div>
      <div className="setting-row">
        <span>Total streams</span>
        <span className="v">{compact(game.player.totalStreams)}</span>
      </div>
      <div className="setting-row">
        <span>Total earned</span>
        <span className="v">{money(game.player.totalEarned)}</span>
      </div>

      <div className="field-label" style={{ marginTop: 26 }}>
        SAVE
      </div>
      <div className="setting-row" style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', display: 'block' }}>
        Your progress saves automatically in this browser. Clearing your browser
        data will erase it, so export a backup if you care about this run.
      </div>
      <motion.button className="setting-row" whileTap={tap} onClick={() => exportSave(game)}>
        <span>Export save file</span>
        <span className="v">↓</span>
      </motion.button>
      <motion.label className="setting-row" whileTap={tap} style={{ cursor: 'pointer' }}>
        <span>Import save file</span>
        <span className="v">↑</span>
        <input
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onImport(file)
            e.target.value = ''
          }}
        />
      </motion.label>

      <div className="field-label" style={{ marginTop: 26 }}>
        ABOUT
      </div>
      <div className="setting-row">
        <span>Version</span>
        <span className="v">{VERSION}</span>
      </div>
      <motion.button className="setting-row" whileTap={tap} onClick={onOpenUpdateLog}>
        <span>Update log</span>
        <span className="v">→</span>
      </motion.button>

      <motion.button
        className="setting-row danger"
        whileTap={tap}
        onClick={() => setConfirming(true)}
        style={{ marginTop: 20 }}
      >
        <span>Delete save & start over</span>
        <span className="v" style={{ color: 'var(--coral)' }}>
          ✕
        </span>
      </motion.button>

      <AnimatePresence>
        {confirming && (
          <motion.div
            className="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirming(false)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={SPRING}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-kicker">ARE YOU SURE</div>
              <div className="modal-title">Delete this career?</div>
              <div style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>
                {game.songs.length} song{game.songs.length === 1 ? '' : 's'} and{' '}
                {money(game.player.totalEarned)} earned will be gone for good.
              </div>
              <motion.button className="modal-btn danger" whileTap={tap} onClick={onReset}>
                DELETE
              </motion.button>
              <motion.button
                className="modal-btn ghost"
                whileTap={tap}
                onClick={() => setConfirming(false)}
                style={{ marginTop: 10 }}
              >
                CANCEL
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
