import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bolt } from '../ui/icons.jsx'
import { CONFIG } from '../game/config.js'
import { polishCost, qualityLabel, qualityColor } from '../game/quality.js'
import { getGenre } from '../game/genres.js'
import { getAlbum } from '../game/albums.js'
import { getMarketing, BUYABLE_TIERS } from '../game/marketing.js'
import { compact, moneyExact } from '../game/format.js'
import { SPRING, SPRING_POP, tap, tapSmall } from '../ui/motion.js'

export default function SongDetailScreen({ game, song, onBack, onPolish, onRelease, onSetMarketing }) {
  const [marketingOpen, setMarketingOpen] = useState(false)
  if (!song) return null

  const genre = getGenre(song.genreId)
  const album = getAlbum(game, song.albumId)
  const marketing = getMarketing(song.marketingTier)
  const canRelease = !song.released && game.player.energy >= CONFIG.ENERGY_PER_RELEASE

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
        <span className="create-title" style={{ fontSize: 26 }}>
          {song.title}
        </span>
      </div>

      <StatBar
        label="PRODUCTION RATING"
        value={song.production}
        color="#d9ad2b"
        locked={song.released}
        energy={game.player.energy}
        onPolish={() => onPolish(song.id, 'production')}
      />
      <StatBar
        label="VIRALITY"
        value={song.virality}
        color="#e2655e"
        locked={song.released}
        energy={game.player.energy}
        onPolish={() => onPolish(song.id, 'virality')}
      />

      <div className="detail-grid">
        <Cell label="ALBUM" value={album ? album.title : 'Single'} highlight={Boolean(album)} />
        <Cell label="TOTAL STREAMS" value={compact(song.totalStreams)} highlight />
        <Cell
          label="FEATURING"
          value={song.featuring ? song.featuring.name : 'None'}
          highlight={Boolean(song.featuring)}
          dim={!song.featuring}
        />
        <Cell label="MARKETING" value={marketing.name} highlight={marketing.id !== 'none'} />
        <Cell label="GENRE" value={genre.name} />
        <Cell label="MUSIC VIDEO" value="–" dim />
      </div>

      {!song.released && album ? (
        <>
          <div className="detail-btn disabled">ON "{album.title.toUpperCase()}"</div>
          <div className="cash-note" style={{ lineHeight: 1.6 }}>
            This track goes out when the album does. Release it from the album's
            page.
          </div>
        </>
      ) : song.released ? (
        <>
          <div className="detail-btn disabled">RELEASED</div>
          <div className="cash-note">
            Out since week {song.releasedOnWeek}, {song.releasedOnYear} ·{' '}
            {compact(song.lastWeekStreams)} streams last week
          </div>
        </>
      ) : (
        <>
          <motion.button
            className="detail-btn primary"
            whileTap={canRelease ? tap : undefined}
            disabled={!canRelease}
            onClick={() => onRelease(song.id)}
          >
            RELEASE {CONFIG.ENERGY_PER_RELEASE} <Bolt size={17} />
          </motion.button>

          <motion.button
            className="detail-btn"
            whileTap={tap}
            onClick={() => setMarketingOpen(true)}
          >
            SET MARKETING
          </motion.button>

          <div className="cash-note">
            Not out yet — polish it first, then release when you're happy.
          </div>
        </>
      )}

      <AnimatePresence>
        {marketingOpen && (
          <MarketingModal
            game={game}
            song={song}
            onPick={(tierId) => {
              onSetMarketing(song.id, tierId)
              setMarketingOpen(false)
            }}
            onClose={() => setMarketingOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// One of the two rating rows: label, the +0.5 polish button, and a bar.
function StatBar({ label, value, color, locked, energy, onPolish }) {
  const cost = polishCost(value)
  const maxed = value >= CONFIG.MAX_QUALITY
  const canPolish = !locked && !maxed && energy >= cost

  return (
    <div className="statbar">
      <div className="statbar-head">
        <span className="field-label" style={{ margin: 0 }}>
          {label}
        </span>
        {!locked && !maxed && (
          <motion.button
            className="polish-btn"
            whileTap={canPolish ? { scale: 0.9 } : undefined}
            disabled={!canPolish}
            style={{ opacity: canPolish ? 1 : 0.45 }}
            onClick={onPolish}
          >
            <Bolt size={13} />
            {cost}
            <span className="polish-plus">+{CONFIG.POLISH_STEP}</span>
          </motion.button>
        )}
        <motion.span
          className="statbar-value"
          key={value}
          initial={{ scale: 1.25, color: '#7fb84e' }}
          animate={{ scale: 1, color }}
          transition={SPRING_POP}
        >
          {value.toFixed(1)}
        </motion.span>
      </div>
      <div className="statbar-track">
        <motion.div
          className="statbar-fill"
          style={{ background: color }}
          initial={false}
          animate={{ width: `${Math.max(value, 2)}%` }}
          transition={SPRING}
        />
      </div>
      <div className="statbar-label" style={{ color: qualityColor(value) }}>
        {qualityLabel(value)}
      </div>
    </div>
  )
}

function Cell({ label, value, highlight, dim }) {
  return (
    <div className="detail-cell">
      <div className="detail-cell-label">{label}</div>
      <div
        className="detail-cell-value"
        style={{ color: highlight ? 'var(--gold)' : dim ? 'var(--muted)' : 'var(--text)' }}
      >
        {value}
      </div>
    </div>
  )
}

function MarketingModal({ game, song, onPick, onClose }) {
  const current = song.marketingTier

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
        initial={{ scale: 0.88, y: 26 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={SPRING}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-kicker">SET MARKETING</div>
        <div className="modal-title" style={{ fontSize: 21 }}>
          Push this song
        </div>

        {BUYABLE_TIERS.map((tier) => {
          const affordable = game.player.cash >= tier.cost
          const picked = current === tier.id
          return (
            <motion.button
              key={tier.id}
              className={`mkt-row ${picked ? 'picked' : ''}`}
              whileTap={affordable ? tap : undefined}
              disabled={!affordable || picked}
              style={{ opacity: affordable || picked ? 1 : 0.4 }}
              onClick={() => onPick(tier.id)}
            >
              <span className="mkt-name">{tier.name}</span>
              <span className="mkt-cost">{moneyExact(tier.cost)}</span>
              <span className={`mkt-dot ${picked ? 'on' : ''}`} />
            </motion.button>
          )
        })}

        <div
          style={{
            color: 'var(--muted)', fontSize: 12.5, fontWeight: 600,
            lineHeight: 1.5, marginTop: 12, textAlign: 'left',
          }}
        >
          A bigger campaign means more people hear the song in its first week,
          and that head start carries through its whole run.
        </div>

        <motion.button className="modal-btn ghost" whileTap={tap} onClick={onClose}>
          CLOSE
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
