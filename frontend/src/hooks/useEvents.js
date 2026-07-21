import { useEffect, useState } from 'react'
import { api, normalizeEvent } from '../utils/api.js'

// ─── List of events — supports optional filter params ─────────────────────────
export function useEvents(filters = {}) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { city, category, search, page } = filters

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (city)     params.set('city',     city)
    if (category && category !== 'All') params.set('category', category)
    if (search)   params.set('search',   search)
    if (page)     params.set('page',     page)
    const query = params.toString() ? `?${params}` : ''

    api.get(`/events${query}`)
      .then(data => {
        if (!cancelled) setEvents((data.events || []).map(normalizeEvent))
      })
      .catch(() => {
        if (!cancelled) setError('Could not load events right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [city, category, search, page])

  return { events, loading, error }
}

// ─── Single event by id ───────────────────────────────────────────────────────
export function useEvent(id) {
  const [event, setEvent] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)

    api.get(`/events/${id}`)
      .then(data => {
        if (!cancelled) {
          setEvent(normalizeEvent(data))
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEvent(null)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [id])

  return { event, loading }
}
