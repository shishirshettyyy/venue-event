import React, { createContext, useContext, useEffect, useState } from 'react'

const BookingContext = createContext(null)
const STORAGE_KEY = 'venue.bookings'

function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(loadBookings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  }, [bookings])

  function addBooking(booking) {
    const record = {
      ...booking,
      bookingId: 'BK' + Math.random().toString(36).slice(2, 9).toUpperCase(),
      bookedAt: new Date().toISOString(),
      status: 'confirmed',
    }
    setBookings((prev) => [record, ...prev])
    return record
  }

  function cancelBooking(bookingId) {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, status: 'cancelled' } : b))
    )
  }

  return (
    <BookingContext.Provider value={{ bookings, addBooking, cancelBooking }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBookings must be used within BookingProvider')
  return ctx
}
