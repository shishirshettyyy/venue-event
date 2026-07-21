import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../utils/api.js'
import { useAuth } from './AuthContext.jsx'

const BookingContext = createContext(null)

// ─── Normalise backend booking → shape the existing UI components expect ──────
function normalizeBooking(b) {
  const event = b.event && typeof b.event === 'object' ? b.event : {}
  const dt = event.dateTime ? new Date(event.dateTime) : null
  return {
    ...b,
    bookingId: b._id || b.bookingId,
    eventId:   event._id || event.id || (typeof b.event === 'string' ? b.event : ''),
    eventTitle: event.title  || b.eventTitle || 'Event',
    city:       event.city   || b.city       || '',
    state:      event.state  || b.state      || '',
    venue:      event.venue  || b.venue      || '',
    date: dt
      ? dt.toISOString().slice(0, 10)
      : b.date || '',
    time: dt
      ? dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      : b.time || '',
    seats:  b.seats  || 1,
    total:  b.totalAmount ?? b.total ?? 0,
    name:   (b.attendeeDetails && b.attendeeDetails[0]?.name)  || b.name  || '',
    email:  (b.attendeeDetails && b.attendeeDetails[0]?.email) || b.email || '',
    status: b.status || 'confirmed',
    bookingCode: b.bookingCode || b.bookingId || b._id || '',
    paymentMethod: b.payment?.method || b.paymentMethod || null,
  }
}

export function BookingProvider({ children }) {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  // ─── Fetch bookings from API whenever the user logs in / out ────────────
  const fetchBookings = useCallback(async () => {
    if (!token) {
      setBookings([])
      return
    }
    setLoading(true)
    try {
      const data = await api.get('/bookings/me')
      setBookings(Array.isArray(data) ? data.map(normalizeBooking) : [])
    } catch (err) {
      console.error('BookingContext: failed to fetch bookings:', err.message)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // ─── Create booking — POST /api/bookings ─────────────────────────────────
  async function addBooking({ eventId, seats, attendeeDetails }) {
    const data = await api.post('/bookings', { eventId, seats, attendeeDetails })
    const normalized = normalizeBooking(data.booking)
    setBookings(prev => [normalized, ...prev])
    return normalized
  }

  // ─── Cancel booking — PATCH /api/bookings/:id/cancel ─────────────────────
  async function cancelBooking(bookingId) {
    await api.patch(`/bookings/${bookingId}/cancel`)
    setBookings(prev =>
      prev.map(b => b.bookingId === bookingId ? { ...b, status: 'cancelled' } : b)
    )
  }

  return (
    <BookingContext.Provider value={{ bookings, loading, addBooking, cancelBooking, refetch: fetchBookings }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookings must be used within BookingProvider')
  return ctx
}
