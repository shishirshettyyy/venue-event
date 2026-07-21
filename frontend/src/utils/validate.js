export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isRequired(value) {
  return value.trim().length > 0
}

export function minLength(value, len) {
  return value.trim().length >= len
}
