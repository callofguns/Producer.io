import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bolt } from '../ui/icons.jsx'
import { GENRES, getGenre } from '../game/genres.js'
import { producerOptions, writerOptions, studioOptions } from '../game/roster.js'
import { CONFIG } from '../game/config.js'
import { moneyExact } from '../game/format.js'
import { SPRING, SPRING_POP, tap, tapSmall } from '../ui/motion.js'

export default function CreateSongScreen({ game, onBack, onCreate }) {
  const player = game.player

  // The three lists you can arrow through. useMemo just avoids rebuilding
  // them on every keystroke.
  const producers = useMemo(() => producerOptions(player), [player])
  const writers = useMemo(() => writerOptions(player), [player])
  const studios = useMemo(() => studioOptions(player), [player])

  const [title, setTitle] = useState('')
  const [genreId, setGenreId] = useState(player.genreId)
  const [explicit, setExplicit] = useState(false)
  const [pIdx, setPIdx] = useState(0)
  const [wIdx, setWIdx] = useState(0)
  const [sIdx, setSIdx] = useState(0)

  const producer = producers[pIdx]
  const writer = writers[wIdx]
  const studio = studios[sIdx]

  const totalCost = producer.cost + writer.cost + studio.cost
  const canPay = player.cash >= totalCost
  const hasEnergy = player.energy >= CONFIG.ENERGY_PER_SONG
  const hasTitle = title.trim().length > 0
  const canCreate = canPay && hasEnergy && hasTitle

  let problem = null
  if (!hasTitle) problem = 'Give your song a title.'
  else if (!hasEnergy) problem = 'Not enough energy — end the week to refill.'
  else if (!canPay) problem = `You need ${moneyExact(totalCost - player.cash)} more.`

  const genre = getGenre(genreId)

  function cycleGenre() {
    const i = GENRES.findIndex((g) => g.id === genreId)
    setGenreId(GENRES[(i + 1) % GENRES.length].id)
  }

  return (
    <div className="screen">
      <div className="create-head">
        <motion.button className="back-btn" whileTap={tapSmall} onClick={onBack}>
          ←
        </motion.button>
        <span className="create-energy">
          <Bolt size={16} />
          {player.energy}
        </span>
        <span className="create-title">CREATE A SONG</span>
      </div>

      {/* --- TITLE / genre / featuring --- */}
      <div className="field-label">TITLE</div>
      <div className="seg-row">
        <motion.button className="chip" whileTap={tap} onClick={cycleGenre}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={genre.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRING_POP}
              style={{ display: 'inline-block' }}
            >
              {genre.name}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Featuring is V2 — drawn but switched off. */}
        <span className="chip light disabled" title="Coming soon">
          Featuring
        </span>
      </div>

      <div className="title-input-row">
        <input
          className="title-input"
          placeholder="Enter a song title"
          value={title}
          maxLength={30}
          onChange={(e) => setTitle(e.target.value)}
        />
        <CleanExplicitToggle explicit={explicit} setExplicit={setExplicit} />
      </div>

      {/* --- ALBUM (V2) --- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="field-label">ALBUM</div>
        <span className="circle-btn" style={{ opacity: 0.35, width: 32, height: 32, flexBasis: 32 }}>
          +
        </span>
      </div>
      <div className="select-row disabled">Single</div>

      {/* --- the three hires --- */}
      <Slot
        label="MUSICALITY"
        options={producers}
        index={pIdx}
        setIndex={setPIdx}
        cash={player.cash}
      />
      <Slot
        label="SONGWRITING"
        options={writers}
        index={wIdx}
        setIndex={setWIdx}
        cash={player.cash}
      />
      <Slot
        label="STUDIO"
        options={studios}
        index={sIdx}
        setIndex={setSIdx}
        cash={player.cash}
      />

      {/* --- cost + create --- */}
      <div className="total-row">
        <span className="total-label">TOTAL COST</span>
        <motion.span
          className="total-value"
          key={totalCost}
          initial={{ scale: 1.16 }}
          animate={{ scale: 1 }}
          transition={SPRING}
          style={{ color: canPay ? 'var(--coral)' : '#ff8a84' }}
        >
          {moneyExact(totalCost)}
        </motion.span>
      </div>

      <motion.button
        className="create-btn"
        whileTap={canCreate ? tap : undefined}
        disabled={!canCreate}
        onClick={() =>
          onCreate({ title, genreId, explicit, producer, writer, studio })
        }
      >
        CREATE {CONFIG.ENERGY_PER_SONG} <Bolt size={19} />
      </motion.button>

      <div className="cash-note">CASH AVAILABLE: {moneyExact(player.cash)}</div>
      <AnimatePresence>
        {problem && (
          <motion.div
            className="error-note"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={SPRING}
          >
            {problem}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// One arrow-through picker (Musicality, Songwriting or Studio).
function Slot({ label, options, index, setIndex, cash }) {
  const current = options[index]
  const affordable = cash >= current.cost
  // Which way the name should slide when it changes.
  const [dir, setDir] = useState(1)

  function move(step) {
    const next = index + step
    if (next < 0 || next >= options.length) return
    setDir(step)
    setIndex(next)
  }

  return (
    <div className="slot">
      <div className="field-label">{label}</div>
      <div className="slot-body">
        <motion.button
          className="arrow"
          whileTap={tapSmall}
          onClick={() => move(-1)}
          disabled={index === 0}
        >
          ←
        </motion.button>

        <div className="slot-center">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={current.id + index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -26 }}
              transition={SPRING}
            >
              <div className="slot-name">{current.name}</div>
              <div className="slot-meta">
                <span className="rating">{current.rating}</span> Rating |{' '}
                <span className={affordable ? '' : 'locked'}>{moneyExact(current.cost)}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          className="arrow"
          whileTap={tapSmall}
          onClick={() => move(1)}
          disabled={index === options.length - 1}
        >
          →
        </motion.button>
      </div>
    </div>
  )
}

// The little C / E switch. The white thumb slides with a spring because
// framer's `layout` prop animates it between the two positions automatically.
function CleanExplicitToggle({ explicit, setExplicit }) {
  return (
    <div className="ce-toggle">
      {['C', 'E'].map((k) => {
        const on = (k === 'E') === explicit
        return (
          <button
            key={k}
            className={`ce-opt ${on ? 'on' : ''}`}
            onClick={() => setExplicit(k === 'E')}
          >
            {on && (
              <motion.span
                layoutId="ce-thumb"
                className="ce-thumb"
                style={{ top: 0, left: 0 }}
                transition={SPRING}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{k}</span>
          </button>
        )
      })}
    </div>
  )
}
