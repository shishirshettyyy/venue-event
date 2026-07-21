const { v4: uuidv4 } = require('uuid')

/**
 * Generate a unique booking code.
 * Format: BK-XXXXXXXX (8 uppercase alphanumeric chars)
 */
function generateBookingCode() {
  const raw = uuidv4().replace(/-/g, '').toUpperCase()
  return 'BK-' + raw.slice(0, 8)
}

module.exports = { generateBookingCode }
