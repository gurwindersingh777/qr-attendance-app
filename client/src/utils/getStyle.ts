
export function getBadgeStyle(pct: number) {
  if (pct >= 75) return 'bg-green-50 text-green-700 border-green-100'
  if (pct >= 60) return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-red-50 text-red-700 border-red-100'
}

export function getBarColor(pct: number) {
  if (pct >= 75) return 'bg-green-500'
  if (pct >= 60) return 'bg-amber-400'
  return 'bg-red-500'
}