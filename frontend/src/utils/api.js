// ─── Base URL from env ─────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('venue.token')
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  get:    (path)        => request(path),
  post:   (path, body)  => request(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  (path, body)  => request(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (path)        => request(path, { method: 'DELETE' }),
}

// ─── Normalise backend event → frontend shape ─────────────────────────────────
// Backend uses dateTime (ISO), bannerImage, _id, organizer (object).
// Frontend components expect date (YYYY-MM-DD), time (h:mm AM/PM), image, id (string), organizer (string).
export function normalizeEvent(e) {
  if (!e) return null
  const dt = e.dateTime ? new Date(e.dateTime) : null
  return {
    ...e,
    id: e._id || e.id,
    date: dt ? dt.toISOString().slice(0, 10) : e.date,
    time: dt
      ? dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      : e.time,
    image: e.bannerImage || e.image || 'workshop',
    organizer:
      typeof e.organizer === 'object' && e.organizer !== null
        ? e.organizer.name || 'Organizer'
        : e.organizer || 'Organizer',
    seatsAvailable:
      e.seatsAvailable !== undefined
        ? e.seatsAvailable
        : (e.totalSeats ?? 0) - (e.seatsBooked ?? 0),
  }
}
