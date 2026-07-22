import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useOrganizerEvents } from '../hooks/useOrganizerEvents.js'
import EventFormModal from '../components/organizer/EventFormModal.jsx'
import AttendeeRosterModal from '../components/organizer/AttendeeRosterModal.jsx'
import { formatDate, formatPrice } from '../utils/format.js'

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const {
    events,
    loading,
    error,
    isUsingFallback,
    createEvent,
    updateEvent,
    cancelEvent,
    deleteEvent,
    getEventAttendees,
  } = useOrganizerEvents()

  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [rosterEventId, setRosterEventId] = useState(null)

  // ─── Analytics calculations ─────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalEvents = events.length
    const publishedCount = events.filter((e) => e.status === 'published').length
    const draftCount = events.filter((e) => e.status === 'draft').length
    const cancelledCount = events.filter((e) => e.status === 'cancelled').length

    let totalSeatsBooked = 0
    let totalSeatsCapacity = 0
    let totalRevenue = 0

    events.forEach((e) => {
      const booked = e.seatsBooked ?? (e.totalSeats - (e.seatsAvailable ?? 0))
      const capacity = e.totalSeats || 1
      const price = e.price || 0

      totalSeatsBooked += booked
      totalSeatsCapacity += capacity
      if (e.status !== 'cancelled') {
        totalRevenue += booked * price
      }
    })

    const avgOccupancy =
      totalSeatsCapacity > 0
        ? Math.round((totalSeatsBooked / totalSeatsCapacity) * 100)
        : 0

    // Category breakdown
    const categoryCounts = {}
    events.forEach((e) => {
      const cat = e.category || 'Other'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
    })

    return {
      totalEvents,
      publishedCount,
      draftCount,
      cancelledCount,
      totalSeatsBooked,
      totalSeatsCapacity,
      totalRevenue,
      avgOccupancy,
      categoryCounts,
    }
  }, [events])

  // ─── Filtered Events List ──────────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesTab =
        activeTab === 'All' ||
        (activeTab === 'Published' && e.status === 'published') ||
        (activeTab === 'Draft' && e.status === 'draft') ||
        (activeTab === 'Cancelled' && e.status === 'cancelled')

      const matchesSearch =
        !searchQuery.trim() ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesTab && matchesSearch
    })
  }, [events, activeTab, searchQuery])

  // ─── Handlers ──────────────────────────────────────────────────────────────
  function handleOpenCreate() {
    setEditingEvent(null)
    setIsFormOpen(true)
  }

  function handleOpenEdit(eventObj) {
    setEditingEvent(eventObj)
    setIsFormOpen(true)
  }

  async function handleFormSubmit(eventData) {
    if (editingEvent) {
      await updateEvent(editingEvent.id || editingEvent._id, eventData)
      showToast('Event updated successfully!')
    } else {
      await createEvent(eventData)
      showToast('Event created successfully!')
    }
  }

  async function handleCancelEvent(eventObj) {
    if (window.confirm(`Are you sure you want to cancel "${eventObj.title}"? All confirmed bookings will be marked as cancelled.`)) {
      try {
        await cancelEvent(eventObj.id || eventObj._id)
        showToast('Event cancelled.')
      } catch (err) {
        showToast(err.message || 'Failed to cancel event.', 'error')
      }
    }
  }

  async function handleDeleteEvent(eventObj) {
    if (window.confirm(`Are you sure you want to delete "${eventObj.title}"? This action cannot be undone.`)) {
      try {
        await deleteEvent(eventObj.id || eventObj._id)
        showToast('Event deleted.')
      } catch (err) {
        showToast(err.message || 'Cannot delete event with active bookings.', 'error')
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="eyebrow">Organizer Control Center</p>
            {isUsingFallback && (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">
                Demo Mode
              </span>
            )}
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Organizer Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your events, analyze ticket sales, and view attendee rosters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard"
            className="btn-secondary !py-2.5 !px-4 text-xs font-semibold"
          >
            ← My Attendee Tickets
          </Link>
          <button
            onClick={handleOpenCreate}
            className="btn-primary !py-2.5 !px-5 text-sm font-semibold shadow-lift"
          >
            + Create New Event
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Events */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:shadow-lift">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Total Events</p>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent">
              🎪
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold">{metrics.totalEvents}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{metrics.publishedCount} active</span>
            <span>·</span>
            <span>{metrics.draftCount} draft</span>
          </div>
        </div>

        {/* Card 2: Total Tickets Sold */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:shadow-lift">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Tickets Sold</p>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              🎟️
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold">{metrics.totalSeatsBooked}</p>
          <p className="mt-2 text-xs text-muted">
            Out of {metrics.totalSeatsCapacity} total seats
          </p>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:shadow-lift">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Total Revenue</p>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
              💰
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold">
            {formatPrice(metrics.totalRevenue)}
          </p>
          <p className="mt-2 text-xs text-muted">
            Across active events
          </p>
        </div>

        {/* Card 4: Average Occupancy */}
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:shadow-lift">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Avg Occupancy</p>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-500">
              📊
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold">{metrics.avgOccupancy}%</p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-offset">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${metrics.avgOccupancy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Analytics Pill Breakdown */}
      {Object.keys(metrics.categoryCounts).length > 0 && (
        <div className="mt-6 rounded-2xl border border-line bg-offset/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow">Events by Category</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics.categoryCounts).map(([cat, count]) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {cat}: <span className="font-mono text-muted">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events Management Workspace */}
      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'All', label: 'All Events', count: metrics.totalEvents },
              { id: 'Published', label: 'Published', count: metrics.publishedCount },
              { id: 'Draft', label: 'Drafts', count: metrics.draftCount },
              { id: 'Cancelled', label: 'Cancelled', count: metrics.cancelledCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`chip ${activeTab === tab.id ? 'chip-active' : ''}`}
              >
                {tab.label}
                <span className="ml-1.5 font-mono text-xs opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search filter */}
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 sm:w-72">
            <span className="text-muted">⌕</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, city..."
              className="w-full text-xs sm:text-sm outline-none placeholder:text-muted bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-muted hover:text-ink"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-20 text-center text-sm text-muted">
            <span className="spinner !h-8 !w-8 border-accent" />
            <p className="mt-4 font-medium">Loading your events dashboard...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="mt-6 rounded-2xl border border-dashed border-line py-12 text-center">
            <p className="font-display text-lg font-semibold">Could not load events</p>
            <p className="mt-2 text-sm text-muted">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-line p-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-2xl text-accent">
              ✨
            </div>
            <p className="mt-4 font-display text-lg font-bold">No events found</p>
            <p className="mt-1 text-sm text-muted max-w-sm mx-auto">
              {searchQuery || activeTab !== 'All'
                ? 'No events match your selected filters or search keyword.'
                : 'You have not created any events yet. Click below to host your first event!'}
            </p>
            <button
              onClick={handleOpenCreate}
              className="btn-primary mt-6 !py-2.5 !px-6"
            >
              + Create Event Now
            </button>
          </div>
        )}

        {/* Event List / Cards Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-6 space-y-4">
            {filteredEvents.map((evt) => {
              const booked = evt.seatsBooked ?? ((evt.totalSeats || 0) - (evt.seatsAvailable || 0))
              const capacity = evt.totalSeats || 1
              const percent = Math.min(100, Math.round((booked / capacity) * 100))
              const isCancelled = evt.status === 'cancelled'
              const isDraft = evt.status === 'draft'

              return (
                <div
                  key={evt.id || evt._id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:border-ink/20 hover:shadow-lift sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Left info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="chip !py-0.5 !px-2.5 text-[11px] font-bold uppercase tracking-wider">
                        {evt.category}
                      </span>
                      {isCancelled ? (
                        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-accent-dark">
                          Cancelled
                        </span>
                      ) : isDraft ? (
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-amber-600 dark:text-amber-400">
                          Draft
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                          Published
                        </span>
                      )}
                      <span className="text-xs text-muted">
                        📍 {evt.city}{evt.state ? `, ${evt.state}` : ''} · {evt.venue}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-ink group-hover:text-accent transition">
                      {evt.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
                      <span>🗓️ {formatDate(evt.date || evt.dateTime?.slice(0, 10))}</span>
                      {evt.time && <span>⏰ {evt.time}</span>}
                      <span className="font-semibold text-ink">
                        🏷️ {formatPrice(evt.price)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="pt-1 sm:max-w-md">
                      <div className="flex justify-between text-[11px] font-mono text-muted mb-1">
                        <span>Booked: {booked} / {capacity} seats</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-offset">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCancelled
                              ? 'bg-muted'
                              : percent >= 90
                              ? 'bg-accent'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4 sm:mt-0 sm:border-t-0 sm:pt-0 sm:pl-6 sm:border-l">
                    <button
                      onClick={() => setRosterEventId(evt.id || evt._id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-offset px-3.5 py-2 text-xs font-semibold text-ink transition hover:border-ink hover:bg-surface"
                      title="View attendee list and download CSV"
                    >
                      👥 Attendees ({booked})
                    </button>

                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-ink"
                      title="Edit event details"
                    >
                      ✏️ Edit
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelEvent(evt)}
                        className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-accent-dark transition hover:bg-accent/10"
                        title="Cancel this event"
                      >
                        🛑 Cancel
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteEvent(evt)}
                      className="inline-flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold text-muted hover:text-accent-dark transition"
                      title="Delete event"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEvent}
      />

      {/* Attendee Roster Modal */}
      <AttendeeRosterModal
        isOpen={Boolean(rosterEventId)}
        onClose={() => setRosterEventId(null)}
        eventId={rosterEventId}
        fetchAttendees={getEventAttendees}
      />
    </div>
  )
}
