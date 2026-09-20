// ============================================================================
// lifestyle.js — the LIFESTYLE spending categories.
//
// You pick ONE tier per category. It bills every single week, forever, until
// you change it or clear it. In exchange most tiers raise your MAX ENERGY,
// which is the only way to afford the expensive end of trait training.
//
// Numbers are taken straight from the reference game.
//   bonus type 'energy'   -> adds to your weekly energy cap  (shown green)
//   bonus type 'virality' -> adds to every new song's virality (shown orange)
//
// Note the first tier of each category costs money but gives nothing — it's
// the baseline cost of living, not an upgrade.
// ============================================================================

import { CONFIG } from './config.js'

export const LIFESTYLE = [
  {
    id: 'food',
    name: 'FOOD',
    bonusType: 'energy',
    blurb: 'Eating healthy increases your max energy.',
    tiers: [
      { id: 'junk',     name: 'JUNK FOOD',   cost: 100,  bonus: 0 },
      { id: 'balanced', name: 'BALANCED',    cost: 150,  bonus: 2 },
      { id: 'organic',  name: 'ORGANIC',     cost: 300,  bonus: 4 },
      { id: 'fine',     name: 'FINE DINING', cost: 750,  bonus: 6 },
      { id: 'chef',     name: 'HOUSE CHEF',  cost: 1500, bonus: 10 },
    ],
  },
  {
    id: 'fashion',
    name: 'FASHION',
    bonusType: 'virality',
    blurb: 'Your style gives virality bonuses.',
    tiers: [
      { id: 'thrifty',  name: 'THRIFTY',           cost: 15,   bonus: 0 },
      { id: 'basic',    name: 'BASIC',             cost: 300,  bonus: 1 },
      { id: 'trendy',   name: 'TRENDY',            cost: 750,  bonus: 2 },
      { id: 'designer', name: 'DESIGNER',          cost: 2000, bonus: 3 },
      { id: 'stylist',  name: 'CELEBRITY STYLIST', cost: 5000, bonus: 5 },
    ],
  },
  {
    id: 'health',
    name: 'HEALTH',
    bonusType: 'energy',
    blurb: 'Taking care of your body increases your max energy.',
    tiers: [
      { id: 'gym',       name: 'GYM MEMBERSHIP',    cost: 25,  bonus: 0 },
      { id: 'bootcamp',  name: 'BOOTCAMP',          cost: 50,  bonus: 1 },
      { id: 'cryo',      name: 'CRYOTHERAPY',       cost: 100, bonus: 2 },
      { id: 'trainer',   name: 'PERSONAL TRAINER',  cost: 200, bonus: 4 },
      { id: 'celebtrainer', name: 'CELEBRITY TRAINER', cost: 500, bonus: 8 },
    ],
  },
  {
    id: 'home',
    name: 'HOME',
    bonusType: 'energy',
    blurb: 'A place to rest lets you recharge quickly.',
    tiers: [
      { id: 'apartment', name: 'APARTMENT',       cost: 300,   bonus: 0 },
      { id: 'single',    name: 'SINGLE FAMILY',   cost: 750,   bonus: 5 },
      { id: 'beach',     name: 'BEACHFRONT',      cost: 1500,  bonus: 10 },
      { id: 'penthouse', name: 'PENTHOUSE',       cost: 4000,  bonus: 15 },
      { id: 'chateau',   name: 'PRIVATE CHATEAU', cost: 10000, bonus: 25 },
    ],
  },
]

// Still waiting on the tier lists for these two.
export const LOCKED_CATEGORIES = ['RELATIONSHIPS', 'TRANSPORTATION']

export function getCategory(id) {
  return LIFESTYLE.find((c) => c.id === id)
}

export function getTier(categoryId, tierId) {
  const cat = getCategory(categoryId)
  if (!cat || !tierId) return null
  return cat.tiers.find((t) => t.id === tierId) || null
}

// What you're billed every week across everything you've bought.
export function weeklyExpenses(lifestyle = {}) {
  let total = 0
  for (const cat of LIFESTYLE) {
    const tier = getTier(cat.id, lifestyle[cat.id])
    if (tier) total += tier.cost
  }
  return total
}

// Adds up one kind of bonus across every category.
function sumBonus(lifestyle = {}, type) {
  let total = 0
  for (const cat of LIFESTYLE) {
    if (cat.bonusType !== type) continue
    const tier = getTier(cat.id, lifestyle[cat.id])
    if (tier) total += tier.bonus
  }
  return total
}

export function energyBonus(lifestyle) {
  return sumBonus(lifestyle, 'energy')
}

export function viralityBonus(lifestyle) {
  return sumBonus(lifestyle, 'virality')
}

// Drops the single most expensive thing you own down one tier (or clears it
// if it's already the cheapest). Used when you can't pay the weekly bill.
export function downgradeOnce(lifestyle = {}) {
  let worstCat = null
  let worstCost = 0

  for (const cat of LIFESTYLE) {
    const tier = getTier(cat.id, lifestyle[cat.id])
    if (tier && tier.cost > worstCost) {
      worstCost = tier.cost
      worstCat = cat
    }
  }
  if (!worstCat) return { lifestyle, downgraded: null }

  const tiers = worstCat.tiers
  const idx = tiers.findIndex((t) => t.id === lifestyle[worstCat.id])
  const nextTier = idx > 0 ? tiers[idx - 1].id : null

  return {
    lifestyle: { ...lifestyle, [worstCat.id]: nextTier },
    downgraded: worstCat.name,
  }
}

// Your weekly energy cap: the base 100, plus everything your lifestyle adds.
export function maxEnergyFor(player) {
  return CONFIG.MAX_ENERGY + energyBonus(player.lifestyle)
}
