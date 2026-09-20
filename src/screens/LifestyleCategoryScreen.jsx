import { motion } from 'framer-motion'
import { getCategory, weeklyExpenses } from '../game/lifestyle.js'
import { CONFIG } from '../game/config.js'
import { moneyExact } from '../game/format.js'
import { SPRING, tap, tapSmall, listContainer, listItem } from '../ui/motion.js'

// One spending category: FOOD, FASHION, HEALTH or HOME.
// You own one tier at a time and it bills every week.
export default function LifestyleCategoryScreen({ game, categoryId, onBack, onPick, onClear }) {
  const cat = getCategory(categoryId)
  if (!cat) return null

  const owned = game.player.lifestyle[categoryId]
  const total = CONFIG.BASE_WEEKLY_EXPENSE + weeklyExpenses(game.player.lifestyle)
  // Green for energy, orange for virality — matching the reference.
  const bonusColor = cat.bonusType === 'energy' ? '#7fb84e' : '#e0a33e'

  return (
    <div className="screen">
      <div className="create-head">
        <motion.button className="back-btn" whileTap={tapSmall} onClick={onBack}>
          ←
        </motion.button>
        <span className="create-title">{cat.name}</span>
      </div>

      <div className="expense-line">Weekly Expenses: {moneyExact(total)}</div>

      <motion.div variants={listContainer} initial="hidden" animate="show">
        {cat.tiers.map((tier) => {
          const isOwned = owned === tier.id
          const affordable = game.player.cash >= tier.cost
          return (
            <motion.button
              key={tier.id}
              className="tier-row"
              variants={listItem}
              whileTap={affordable && !isOwned ? tapSmall : undefined}
              disabled={isOwned || !affordable}
              style={{ opacity: isOwned || affordable ? 1 : 0.45 }}
              onClick={() => onPick(categoryId, tier.id)}
            >
              <span className="tier-name">{tier.name}</span>
              {tier.bonus > 0 && (
                <span className="tier-bonus" style={{ color: bonusColor }}>
                  +{tier.bonus}
                </span>
              )}
              <span className="tier-cost">-{moneyExact(tier.cost)}</span>
              <span className={`tier-dot ${isOwned ? 'on' : ''}`} />
            </motion.button>
          )
        })}
      </motion.div>

      <div className="tier-blurb">{cat.blurb}</div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
        <motion.button
          className="clear-expense"
          whileTap={owned ? tap : undefined}
          disabled={!owned}
          style={{ opacity: owned ? 1 : 0.4 }}
          onClick={() => onClear(categoryId)}
        >
          CLEAR EXPENSE
        </motion.button>
      </div>

      <div className="cash-note" style={{ marginTop: 20, lineHeight: 1.6 }}>
        {cat.bonusType === 'energy'
          ? 'Raises your weekly energy for as long as you keep paying.'
          : 'Adds to the virality of every new song you make.'}
      </div>
    </div>
  )
}
