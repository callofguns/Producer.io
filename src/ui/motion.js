// Shared spring settings so every animation in the game feels like the same app.
// stiffness = how strong the spring is (higher = snappier)
// damping   = how much it resists wobbling (lower = more bounce)

export const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 }
export const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 28 }
export const SPRING_POP = { type: 'spring', stiffness: 600, damping: 22, mass: 0.7 }

// Reusable "press me" feedback for buttons.
export const tap = { scale: 0.96 }
export const tapSmall = { scale: 0.9 }

// Screens sliding in from the right, like a phone app pushing a new page.
export const pageVariants = {
  enter: { x: '100%', opacity: 1 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-28%', opacity: 0.4 },
}

// A list where each item springs in slightly after the one above it.
export const listContainer = {
  show: { transition: { staggerChildren: 0.045 } },
}
export const listItem = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: SPRING },
}
