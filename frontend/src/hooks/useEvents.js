import { useEffect, useState } from 'react'
import { events as allEvents } from '../data/events.js'

// Simulates an async fetch to a backend events endpoint. Swap the body
// of this function for a real `fetch('/api/events')` call later — every
// page that uses this hook already handles the loading/error states.
const SIMULATED_DELAY = 500

function fetchEvents() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(allEvents), SIMULATED_DELAY)
  })
}

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchEvents()
      .then((data) => {
        if (!cancelled) setEvents(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load events right now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { events, loading, error }
}

export function useEvent(id) {
  const [event, setEvent] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchEvents().then((data) => {
      if (!cancelled) {
        setEvent(data.find((e) => e.id === id) || null)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [id])

  return { event, loading }
}
