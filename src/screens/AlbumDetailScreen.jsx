import { motion } from 'framer-motion'
import { Bolt } from '../ui/icons.jsx'
import { CONFIG } from '../game/config.js'
import { albumTracks, albumRating, albumBonus, albumStreams, getAlbum } from '../game/albums.js'
import { qualityColor, qualityLabel } from '../game/quality.js'
import { compact } from '../game/format.js'
import { SPRING, tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

export default function AlbumDetailScreen({ game, albumId, onBack, onRelease, onOpenSong }) {
  const album = getAlbum(game, albumId)
  if (!album) return null

  const tracks = albumTracks(game, albumId)
  const rating = albumRating(game, albumId)
  const color = qualityColor(rating)
  const bonus = albumBonus(tracks.length)

  const enoughTracks = tracks.length >= CONFIG.MIN_ALBUM_TRACKS
  const enoughEnergy = game.player.energy >= CONFIG.ENERGY_PER_ALBUM_RELEASE
  const canRelease = !album.released && enoughTracks && enoughEnergy

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
        <span className="create-title" style={{ fontSize: 24 }}>
          {album.title}
        </span>
      </div>

      <div className="statbar">
        <div className="statbar-head">
          <span className="field-label" style={{ margin: 0 }}>
            ALBUM RATING
          </span>
          <motion.span
            className="statbar-value"
            key={rating}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1, color }}
            transition={SPRING}
          >
            {rating ? rating.toFixed(1) : '–'}
          </motion.span>
        </div>
        <div className="statbar-track">
          <motion.div
            className="statbar-fill"
            style={{ background: color }}
            initial={false}
            animate={{ width: `${Math.max(rating, 2)}%` }}
            transition={SPRING}
          />
        </div>
        <div className="statbar-label" style={{ color }}>
          {rating ? qualityLabel(rating) : 'NO TRACKS YET'}
        </div>
      </div>

      <div className="detail-grid">
        <Cell label="TRACKS" value={tracks.length} />
        <Cell
          label="TOTAL STREAMS"
          value={compact(albumStreams(game, albumId))}
          highlight
        />
        <Cell label="CROSS-PROMO" value={`+${Math.round(bonus * 100)}%`} highlight={bonus > 0} />
        <Cell
          label="STATUS"
          value={album.released ? `Out wk ${album.releasedOnWeek}` : 'Unreleased'}
        />
      </div>

      <div className="field-label">TRACKLIST</div>
      {tracks.length === 0 ? (
        <div className="empty" style={{ padding: '26px 10px' }}>
          Nothing on this record yet.
          <br />
          Make a song and pick this album instead of Single.
        </div>
      ) : (
        <motion.div variants={listContainer} initial="hidden" animate="show">
          {tracks.map((song, i) => (
            <motion.button
              key={song.id}
              className="song"
              variants={listItem}
              whileTap={tapSmall}
              onClick={() => onOpenSong(song.id)}
            >
              <div className="track-num">{i + 1}</div>
              <div className="song-main">
                <div className="song-title">
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {song.title}
                  </span>
                  {song.explicit && <span className="tag-e">E</span>}
                </div>
                <div className="song-sub">
                  {song.featuring ? `feat. ${song.featuring.name} · ` : ''}
                  {compact(song.totalStreams)} streams
                </div>
              </div>
              <div className="song-right">
                <div className="song-q" style={{ color: qualityColor(song.production) }}>
                  {Math.round(song.production)}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {album.released ? (
        <div className="detail-btn disabled" style={{ marginTop: 18 }}>
          RELEASED
        </div>
      ) : (
        <>
          <motion.button
            className="detail-btn primary"
            whileTap={canRelease ? tap : undefined}
            disabled={!canRelease}
            onClick={() => onRelease(albumId)}
            style={{ marginTop: 18 }}
          >
            RELEASE ALBUM {CONFIG.ENERGY_PER_ALBUM_RELEASE} <Bolt size={17} />
          </motion.button>
          <div className="cash-note" style={{ lineHeight: 1.6 }}>
            {!enoughTracks
              ? `An album needs at least ${CONFIG.MIN_ALBUM_TRACKS} tracks.`
              : !enoughEnergy
                ? 'Not enough energy to put it out this week.'
                : 'Releasing puts every track out at once.'}
          </div>
        </>
      )}
    </div>
  )
}

function Cell({ label, value, highlight }) {
  return (
    <div className="detail-cell">
      <div className="detail-cell-label">{label}</div>
      <div
        className="detail-cell-value"
        style={{ color: highlight ? 'var(--gold)' : 'var(--text)' }}
      >
        {value}
      </div>
    </div>
  )
}
