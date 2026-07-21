import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBookings } from '../context/BookingContext.jsx'
import { formatDate, formatPrice } from '../utils/format.js'

export default function Confirmation() {
  const { bookingId } = useParams()
  const { bookings } = useBookings()
  const booking = bookings.find((b) => b.bookingId === bookingId)

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">We can't find that booking</h1>
        <Link to="/events" className="btn-primary mt-6 inline-flex">Browse events</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-14 sm:px-8">
      <div className="text-center">
        <span className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-success/10 text-success">
          ✓
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">You're booked</h1>
        <p className="mt-2 text-sm text-muted">
          A confirmation has been sent to {booking.email}
        </p>
      </div>

      <div className="mt-8 ticket shadow-lift">
        <div className="flex-1 bg-gradient-to-br from-primary to-primary-light p-6 sm:rounded-l-[13px]">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">Admit {booking.seats}</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white">{booking.eventTitle}</h2>
          <p className="mt-3 font-mono text-sm text-white/85">{formatDate(booking.date)} · {booking.time}</p>
          <p className="mt-1 font-mono text-sm text-white/85">{booking.venue}, {booking.city}</p>
          <p className="mt-4 text-sm text-white/90">Ticket holder: {booking.name}</p>
          {booking.paymentMethod && (
            <p className="mt-1 text-xs text-white/70">Paid via {booking.paymentMethod}</p>
          )}
        </div>
        <div className="ticket-divider" />
        <div className="ticket-notch ticket-notch--top" aria-hidden="true" />
        <div className="ticket-notch ticket-notch--bottom" aria-hidden="true" />
        <div className="flex flex-col items-center justify-center gap-2 p-6 sm:w-36">
          <p className="eyebrow">Total</p>
          <p className="font-display text-lg font-semibold">{formatPrice(booking.total)}</p>
          <p className="mt-3 font-mono text-xs tracking-widest text-muted">{booking.bookingId}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/dashboard" className="btn-secondary">View all my tickets</Link>
        <Link to="/events" className="btn-primary">Find another event</Link>
      </div>
    </div>
  )
}
