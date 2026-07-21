export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateLong(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

export function formatDateParts(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return {
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
  }
}

export function formatPrice(price) {
  if (price === 0) return 'Free'
  return '₹' + price.toLocaleString('en-IN')
}
