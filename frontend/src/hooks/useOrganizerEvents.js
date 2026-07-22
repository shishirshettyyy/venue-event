import { useState, useEffect, useCallback } from 'react'
import { api, normalizeEvent } from '../utils/api.js'
import { events as initialMockEvents } from '../data/events.js'
import { useAuth } from '../context/AuthContext.jsx'

const STORAGE_KEY = 'venue.organizer_events'
const ATTENDEES_KEY = 'venue.mock_attendees'

function loadLocalEvents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (err) {
    console.error('Failed to load local organizer events:', err)
  }
  // Default mock organizer events
  const defaultEvents = initialMockEvents.map((e, idx) => ({
    ...e,
    _id: e.id,
    status: idx === 3 ? 'draft' : idx === 5 ? 'cancelled' : 'published',
    seatsBooked: e.totalSeats - e.seatsAvailable,
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents))
  return defaultEvents
}

function saveLocalEvents(eventsList) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsList))
  } catch (err) {
    console.error('Failed to save local organizer events:', err)
  }
}

function loadLocalAttendees() {
  try {
    const stored = localStorage.getItem(ATTENDEES_KEY)
    if (stored) return JSON.parse(stored)
  } catch (err) {
    console.error('Failed to load local attendees:', err)
  }
  // Mock default attendees generator
  const mockAttendees = {
    'evt-001': [
      { id: 'att-101', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', seats: 2, totalPaid: 998, status: 'confirmed', createdAt: '2026-07-15T10:30:00Z' },
      { id: 'att-102', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 98123 45678', seats: 1, totalPaid: 499, status: 'confirmed', createdAt: '2026-07-18T14:20:00Z' },
      { id: 'att-103', name: 'Rohan Gupta', email: 'rohan.g@example.com', phone: '+91 97111 22334', seats: 3, totalPaid: 1497, status: 'confirmed', createdAt: '2026-07-20T09:15:00Z' },
    ],
    'evt-002': [
      { id: 'att-201', name: 'Neha Verma', email: 'neha.verma@example.com', phone: '+91 99887 76655', seats: 1, totalPaid: 0, status: 'confirmed', createdAt: '2026-07-19T11:00:00Z' },
      { id: 'att-202', name: 'Vikram Joshi', email: 'v.joshi@example.com', phone: '+91 98989 12345', seats: 2, totalPaid: 0, status: 'confirmed', createdAt: '2026-07-21T16:45:00Z' },
    ],
  }
  localStorage.setItem(ATTENDEES_KEY, JSON.stringify(mockAttendees))
  return mockAttendees
}

export function useOrganizerEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Try backend endpoint first if user is logged in
    if (user) {
      try {
        const res = await api.get('/organizer/events')
        if (res && res.events) {
          setEvents(res.events.map(normalizeEvent))
          setIsUsingFallback(false)
          setLoading(false)
          return
        }
      } catch (err) {
        console.warn('Backend organizer endpoint unreachable, using local fallback:', err.message)
      }
    }

    // Fallback to local storage
    const local = loadLocalEvents()
    setEvents(local.map(normalizeEvent))
    setIsUsingFallback(true)
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // ─── Create Event ─────────────────────────────────────────────────────────────
  const createEvent = async (eventData) => {
    if (!isUsingFallback && user) {
      try {
        const res = await api.post('/organizer/events', eventData)
        await fetchEvents()
        return normalizeEvent(res.event)
      } catch (err) {
        console.warn('Backend event create failed, performing local creation:', err.message)
      }
    }

    // Local fallback
    const localEvents = loadLocalEvents()
    const newId = `evt-${Date.now().toString().slice(-6)}`
    const newEvent = {
      id: newId,
      _id: newId,
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      city: eventData.city,
      state: eventData.state || 'Gujarat',
      venue: eventData.venue,
      date: eventData.dateTime ? eventData.dateTime.slice(0, 10) : new Date().toISOString().slice(0, 10),
      time: eventData.dateTime ? new Date(eventData.dateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '10:00 AM',
      dateTime: eventData.dateTime || new Date().toISOString(),
      price: Number(eventData.price) || 0,
      totalSeats: Number(eventData.totalSeats) || 50,
      seatsBooked: 0,
      seatsAvailable: Number(eventData.totalSeats) || 50,
      status: eventData.status || 'published',
      bannerImage: eventData.bannerImage || '',
      image: eventData.category ? eventData.category.toLowerCase() : 'workshop',
      organizer: user?.name || 'Organizer',
      createdAt: new Date().toISOString(),
    }

    const updated = [newEvent, ...localEvents]
    saveLocalEvents(updated)
    setEvents(updated.map(normalizeEvent))
    return normalizeEvent(newEvent)
  }

  // ─── Update Event ─────────────────────────────────────────────────────────────
  const updateEvent = async (id, eventData) => {
    if (!isUsingFallback && user) {
      try {
        const res = await api.patch(`/organizer/events/${id}`, eventData)
        await fetchEvents()
        return normalizeEvent(res.event)
      } catch (err) {
        console.warn('Backend event update failed, updating locally:', err.message)
      }
    }

    // Local fallback
    const localEvents = loadLocalEvents()
    const index = localEvents.findIndex((e) => e._id === id || e.id === id)
    if (index === -1) throw new Error('Event not found')

    const existing = localEvents[index]
    const updatedSeats = eventData.totalSeats !== undefined ? Number(eventData.totalSeats) : existing.totalSeats
    if (updatedSeats < (existing.seatsBooked || 0)) {
      throw new Error(`Cannot set totalSeats (${updatedSeats}) below booked seats (${existing.seatsBooked || 0})`)
    }

    const updatedEvent = {
      ...existing,
      ...eventData,
      totalSeats: updatedSeats,
      seatsAvailable: updatedSeats - (existing.seatsBooked || 0),
      date: eventData.dateTime ? eventData.dateTime.slice(0, 10) : existing.date,
    }

    localEvents[index] = updatedEvent
    saveLocalEvents(localEvents)
    setEvents(localEvents.map(normalizeEvent))
    return normalizeEvent(updatedEvent)
  }

  // ─── Cancel Event ─────────────────────────────────────────────────────────────
  const cancelEvent = async (id) => {
    if (!isUsingFallback && user) {
      try {
        const res = await api.patch(`/organizer/events/${id}/cancel`)
        await fetchEvents()
        return res
      } catch (err) {
        console.warn('Backend event cancel failed, cancelling locally:', err.message)
      }
    }

    // Local fallback
    const localEvents = loadLocalEvents()
    const index = localEvents.findIndex((e) => e._id === id || e.id === id)
    if (index !== -1) {
      localEvents[index].status = 'cancelled'
      saveLocalEvents(localEvents)
      setEvents(localEvents.map(normalizeEvent))
    }
  }

  // ─── Delete Event ─────────────────────────────────────────────────────────────
  const deleteEvent = async (id) => {
    if (!isUsingFallback && user) {
      try {
        const res = await api.delete(`/organizer/events/${id}`)
        await fetchEvents()
        return res
      } catch (err) {
        console.warn('Backend event delete failed, deleting locally:', err.message)
      }
    }

    // Local fallback
    const localEvents = loadLocalEvents()
    const filtered = localEvents.filter((e) => e._id !== id && e.id !== id)
    saveLocalEvents(filtered)
    setEvents(filtered.map(normalizeEvent))
  }

  // ─── Get Attendees for an Event ───────────────────────────────────────────────
  const getEventAttendees = async (id) => {
    if (!isUsingFallback && user) {
      try {
        const res = await api.get(`/organizer/events/${id}/attendees`)
        return res
      } catch (err) {
        console.warn('Backend attendee list failed, using local attendee fallback:', err.message)
      }
    }

    // Local fallback
    const allAttendees = loadLocalAttendees()
    const targetEvent = events.find((e) => e.id === id || e._id === id)
    const list = allAttendees[id] || [
      { id: `att-${id}-1`, name: 'Ananya Sharma', email: 'ananya@example.com', phone: '+91 98765 00112', seats: 2, totalPaid: (targetEvent?.price || 0) * 2, status: 'confirmed', createdAt: new Date().toISOString() },
      { id: `att-${id}-2`, name: 'Devendra Mehta', email: 'dev.m@example.com', phone: '+91 98223 99881', seats: 1, totalPaid: targetEvent?.price || 0, status: 'confirmed', createdAt: new Date().toISOString() },
    ]

    return {
      eventTitle: targetEvent?.title || 'Event Roster',
      totalBooked: targetEvent?.seatsBooked || list.reduce((acc, a) => acc + a.seats, 0),
      totalSeats: targetEvent?.totalSeats || 100,
      bookings: list.map((a) => ({
        _id: a.id,
        user: { name: a.name, email: a.email, phone: a.phone },
        seats: a.seats,
        totalPaid: a.totalPaid,
        status: a.status,
        createdAt: a.createdAt,
      })),
    }
  }

  return {
    events,
    loading,
    error,
    isUsingFallback,
    fetchEvents,
    createEvent,
    updateEvent,
    cancelEvent,
    deleteEvent,
    getEventAttendees,
  }
}
