// Small helpers for turning numbers into the strings the UI shows.

export function money(n) {
  const v = Math.floor(n)
  if (Math.abs(v) >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (Math.abs(v) >= 10_000) return `$${(v / 1000).toFixed(0)}K`
  return `$${v.toLocaleString('en-US')}`
}

// Exact dollars, used where precision matters (e.g. the cost breakdown).
export function moneyExact(n) {
  return `$${Math.floor(n).toLocaleString('en-US')}`
}

export function compact(n) {
  const v = Math.round(n)
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return `${v}`
}
