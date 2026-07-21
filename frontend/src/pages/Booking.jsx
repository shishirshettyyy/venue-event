import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookings } from '../context/BookingContext.jsx'
import { useEvent } from '../hooks/useEvents.js'
import { isValidEmail, isRequired } from '../utils/validate.js'
import { formatDate, formatPrice } from '../utils/format.js'
import EventCardSkeleton from '../components/EventCardSkeleton.jsx'

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addBooking } = useBookings()
  const { event, loading } = useEvent(id)

  const [name, setName]     = useState(user?.name  || '')
  const [email, setEmail]   = useState(user?.email || '')
  const [seats, setSeats]   = useState(1)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ─── Loading / not found states ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="h-6 w-32 animate-pulse rounded bg-line" />
        <div className="mt-6 h-8 w-2/3 animate-pulse rounded bg-line" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">This event isn't listed</h1>
        <Link to="/events" className="btn-primary mt-6 inline-flex">Browse other events</Link>
      </div>
    )
  }

  // ─── Must be logged in to book ────────────────────────────────────────────
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">Log in to book</h1>
        <p className="mt-2 text-sm text-muted">You need an account to reserve seats.</p>
        <Link
          to="/login"
          state={{ from: `/events/${id}/book` }}
          className="btn-primary mt-6 inline-flex"
        >
          Log in
        </Link>
      </div>
    )
  }

  const maxSeats = Math.min(6, event.seatsAvailable ?? 0)
  const total    = event.price * seats

  function validate() {
    const next = {}
    if (!isRequired(name))          next.name  = 'Your name is required.'
    if (!isRequired(email))         next.email = 'Email is required.'
    else if (!isValidEmail(email))  next.email = 'Enter a valid email address.'
    if (seats < 1)                  next.seats = 'Select at least 1 seat.'
    if (seats > maxSeats)           next.seats = `Only ${maxSeats} seats available.`
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setApiError('')
    setSubmitting(true)
    try {
      const booking = await addBooking({
        eventId: event.id,
        seats,
        attendeeDetails: [{ name, email, phone: '' }],
      })
      // Navigate to payment carrying the booking + event context
      navigate(`/events/${event.id}/payment`, {
        state: {
          bookingId: booking.bookingId,
          seats,
          total: booking.total || total,
          event: {
            id: event.id,
            title: event.title,
            price: event.price,
          },
        },
      })
    } catch (err) {
      setApiError(err.message || 'Could not create booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <Link to={`/events/${event.id}`} className="text-sm font-medium text-muted hover:text-ink">
        ← Back to event
      </Link>

      <p className="eyebrow mt-5">Booking</p>
      <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{event.title}</h1>
      <p className="mt-1 font-mono text-sm text-muted">
        {formatDate(event.date)} · {event.time} · {event.city}
      </p>

      {apiError && (
        <div className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent-dark">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-8 sm:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <div>
            <label className="form-label" htmlFor="name">Full name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="As you'd like it on your ticket" aria-invalid={!!errors.name}
              className={`form-input mt-1.5 ${errors.name ? 'form-input-error' : ''}`} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" aria-invalid={!!errors.email}
              className={`form-input mt-1.5 ${errors.email ? 'form-input-error' : ''}`} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="seats">Number of seats</label>
            <div className="mt-1.5 flex w-fit items-center gap-4 rounded-xl border border-line px-4 py-2.5">
              <button type="button" onClick={() => setSeats((s) => Math.max(1, s - 1))}
                className="text-lg text-ink/60 hover:text-ink" aria-label="Decrease seats">−</button>
              <span className="w-6 text-center font-mono text-sm">{seats}</span>
              <button type="button" onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
                className="text-lg text-ink/60 hover:text-ink" aria-label="Increase seats">+</button>
            </div>
            <p className="mt-1.5 text-xs text-muted">Up to {maxSeats} seats per booking</p>
            {errors.seats && <p className="form-error">{errors.seats}</p>}
          </div>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-2xl border border-line bg-surface p-6 shadow-card">
          <p className="eyebrow">Order summary</p>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted">Price per seat</span>
            <span>{formatPrice(event.price)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-muted">Seats</span>
            <span>× {seats}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button type="submit" disabled={submitting || maxSeats === 0} className="btn-primary mt-6 w-full">
            {submitting ? <span className="spinner" /> : null}
            {submitting ? 'Reserving seats…' : maxSeats === 0 ? 'Sold out' : 'Continue to payment'}
          </button>
        </div>
      </form>
    </div>
  )
}
