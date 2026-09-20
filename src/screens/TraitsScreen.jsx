import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bolt } from '../ui/icons.jsx'
import { ARTIST_TRAITS, BUSINESS_TRAITS, trainCost, skillLevel } from '../game/traits.js'
import { CONFIG } from '../game/config.js'
import { SPRING, SPRING_POP, tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

export default function TraitsScreen({ game, onTrain }) {
  const [helpFor, setHelpFor] = useState(null)
  const level = skillLevel(game.player.traits)

  return (
    <div className="screen">
      <motion.button
        className="help-btn"
        whileTap={tapSmall}
        onClick={() => setHelpFor('how')}
        aria-label="help"
      >
        ?
      </motion.button>

      <div className="screen-head" style={{ paddingTop: 12 }}>
        <div className="skill-level">{level} SKILL LEVEL</div>
        <div className="screen-title traits-title">ARTIST TRAITS</div>
      </div>

      <motion.div variants={listContainer} initial="hidden" animate="show">
        {ARTIST_TRAITS.map((t) => (
          <TraitRow
            key={t.id}
            trait={t}
            game={game}
            onTrain={onTrain}
            onInfo={() => setHelpFor(t.id)}
          />
        ))}
      </motion.div>

      <div className="screen-head" style={{ paddingTop: 20 }}>
        <div style={{ width: 1 }} />
        <div className="screen-title traits-title">BUSINESS TRAITS</div>
      </div>

      <motion.div variants={listContainer} initial="hidden" animate="show">
        {BUSINESS_TRAITS.map((t) => (
          <TraitRow
            key={t.id}
            trait={t}
            game={game}
            onTrain={onTrain}
            onInfo={() => setHelpFor(t.id)}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {helpFor && <HelpModal id={helpFor} onClose={() => setHelpFor(null)} />}
      </AnimatePresence>
    </div>
  )
}

function TraitRow({ trait, game, onTrain, onInfo }) {
  const level = game.player.traits[trait.id] ?? 1
  const progress = game.player.traitProgress[trait.id] ?? 0
  const maxed = level >= CONFIG.MAX_TRAIT
  const cost = trainCost(trait.id, level)
  const canTrain = trait.active && !maxed && game.player.energy >= cost

  // 0 to 1, how full the bar is for this level.
  const fill = maxed ? 1 : progress / CONFIG.TRAININGS_PER_LEVEL

  return (
    <motion.div
      className="trait"
      variants={listItem}
      style={{ background: trait.color, opacity: trait.active ? 1 : 0.42 }}
      onClick={onInfo}
    >
      <motion.div
        className="trait-level"
        key={level}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={SPRING_POP}
      >
        {level}
      </motion.div>

      <div className="trait-main">
        <div className="trait-name">{trait.name}</div>
        <div className="trait-bar">
          <motion.div
            className="trait-bar-fill"
            initial={false}
            animate={{ width: `${Math.max(fill * 100, 5)}%` }}
            transition={SPRING}
          />
        </div>
      </div>

      <div className="trait-cost">
        {maxed ? (
          <span style={{ fontSize: 13, fontWeight: 800 }}>MAX</span>
        ) : (
          <>
            <Bolt size={15} />
            <span>{cost}</span>
          </>
        )}
      </div>

      <motion.button
        className="trait-up"
        whileTap={canTrain ? { scale: 0.85 } : undefined}
        disabled={!canTrain}
        style={{ opacity: canTrain ? 1 : 0.4 }}
        onClick={(e) => {
          e.stopPropagation()
          onTrain(trait.id)
        }}
        aria-label={`train ${trait.name}`}
      >
        ↑
      </motion.button>
    </motion.div>
  )
}

const HOW_IT_WORKS = `Training a trait costs energy and fills its bar. Fill the bar and the trait levels up. The price goes up as the trait gets higher, so late levels are a real investment.

You get ${CONFIG.MAX_ENERGY} energy back every week, and a song costs ${CONFIG.ENERGY_PER_SONG} — so every week you're choosing between making music now and getting better for later.

Greyed-out traits belong to features that aren't in the game yet.`

function HelpModal({ id, onClose }) {
  const trait = [...ARTIST_TRAITS, ...BUSINESS_TRAITS].find((t) => t.id === id)

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
        initial={{ scale: 0.88, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={SPRING}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-kicker">{trait ? 'TRAIT' : 'HOW TRAINING WORKS'}</div>
        <div className="modal-title">{trait ? trait.name : 'Training'}</div>
        <div style={{ color: 'var(--muted)', fontSize: 14.5, fontWeight: 600, lineHeight: 1.6, whiteSpace: 'pre-line', textAlign: 'left' }}>
          {trait ? trait.blurb : HOW_IT_WORKS}
        </div>
        <motion.button className="modal-btn" whileTap={tap} onClick={onClose}>
          GOT IT
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
