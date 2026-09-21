import { motion } from 'framer-motion'
import { ARTISTS_BY_RATING, trendLabel } from '../game/artists.js'
import { moneyExact } from '../game/format.js'
import { tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

// Pick a guest artist for the song you're making. Anyone you can't afford is
// greyed out, same as the producers and writers.
export default function FeaturedArtistsScreen({ game, selectedId, onBack, onPick }) {
  const cash = game.player.cash

  return (
    <div className="screen">
      <div className="create-head">
        <motion.button className="back-btn" whileTap={tapSmall} onClick={onBack}>
          ←
        </motion.button>
        <span className="create-title" style={{ fontSize: 25 }}>
          FEATURED ARTISTS
        </span>
      </div>

      <div className="fa-head">
        <span className="fa-tag virality">VIRALITY</span>
        <span className="fa-tag name">NAME</span>
        <span className="fa-tag rating">RATING</span>
      </div>

      {selectedId && (
        <motion.button
          className="detail-btn"
          whileTap={tap}
          onClick={() => onPick(null)}
          style={{ marginBottom: 14 }}
        >
          REMOVE FEATURE
        </motion.button>
      )}

      <motion.div variants={listContainer} initial="hidden" animate="show">
        {ARTISTS_BY_RATING.map((artist) => {
          const affordable = cash >= artist.fee
          const picked = selectedId === artist.id
          return (
            <motion.button
              key={artist.id}
              className={`fa-row ${picked ? 'picked' : ''}`}
              variants={listItem}
              whileTap={affordable ? tapSmall : undefined}
              disabled={!affordable}
              style={{ opacity: affordable ? 1 : 0.4 }}
              onClick={() => onPick(artist.id)}
            >
              <span className="fa-col left">
                <span className="fa-num virality">{artist.virality}</span>
                <span className="fa-sub">{trendLabel(artist.virality)}</span>
              </span>

              <span className="fa-col mid">
                <span className="fa-name">{artist.name}</span>
                <span className="fa-fee">{moneyExact(artist.fee)}</span>
              </span>

              <span className="fa-col right">
                <span className="fa-num rating">{artist.rating}</span>
                <span className="fa-sub">RATING</span>
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="cash-note" style={{ lineHeight: 1.6, marginTop: 16 }}>
        A feature lends you their verse and their audience — it lifts both the
        song's production rating and its virality.
      </div>
    </div>
  )
}
