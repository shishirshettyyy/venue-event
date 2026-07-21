import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useEvents } from '../hooks/useEvents.js'
import EventCard from '../components/EventCard.jsx'
import EventCardSkeleton from '../components/EventCardSkeleton.jsx'

const CATEGORIES = ['All', 'Workshop', 'Meetup', 'Show', 'Concert', 'Conference']

export default function Events() {
  const [searchParams] = useSearchParams()
  const [query, setQuery]       = useState(searchParams.get('q')        || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [state, setState]       = useState('All')
  const [states, setStates]     = useState([])

  const { events, loading, error } = useEvents()

  // Fetch city/state/category meta from API once
  useEffect(() => {
    api.get('/events/meta')
      .then(data => setStates(data.states || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setCategory(searchParams.get('category') || 'All')
  }, [searchParams])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesQuery =
        !query ||
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.city.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || e.category === category
      const matchesState    = state === 'All'    || e.state    === state
      return matchesQuery && matchesCategory && matchesState
    })
  }, [events, query, category, state])

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="eyebrow">All events</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Browse across the country</h1>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 rounded-full border border-line px-4 py-2.5 focus-within:border-ink">
        <span className="text-muted">⌕</span>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by event name or city…"
          className="w-full text-sm outline-none placeholder:text-muted" />
      </div>

      {/* Category filters */}
      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`chip ${category === c ? 'chip-active' : ''}`}>
            {c}
          </button>
        ))}
      </div>

      {/* State filter */}
      {states.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">State</span>
          {['All', ...states].map((s) => (
            <button key={s} onClick={() => setState(s)}
              className={`chip !py-1 !px-3 text-xs ${state === s ? 'chip-active' : ''}`}>
              {s}
            </button>
          ))}
        </div>
      )}

      {!loading && !error && (
        <p className="mt-6 text-sm text-muted">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {loading && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      )}

      {error && (
        <div className="mt-16 rounded-2xl border border-dashed border-line py-16 text-center">
          <p className="font-display text-lg font-semibold">Something went wrong</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="mt-16 rounded-2xl border border-dashed border-line py-16 text-center">
          <p className="font-display text-lg font-semibold">No events match those filters</p>
          <p className="mt-2 text-sm text-muted">Try a different city, state, or category.</p>
        </div>
      )}
    </div>
  )
}
