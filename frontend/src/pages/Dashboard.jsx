import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookings } from '../context/BookingContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useRecentlyViewed } from '../context/RecentlyViewedContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { events } from '../data/events.js'
import EventCard from '../components/EventCard.jsx'
import { formatDate, formatPrice } from '../utils/format.js'

function BookingRow({ booking, onCancel }) {
  const isCancelled = booking.status === 'cancelled'
  return (
    <div className="ticket shadow-card">
      <div className="flex-1 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{booking.city} · {booking.state}</p>
          {isCancelled && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-dark">
              Cancelled
            </span>
          )}
        </div>
        <h3 className="mt-1.5 text-lg font-semibold">{booking.eventTitle}</h3>
        <p className="mt-1.5 font-mono text-sm text-muted">
          {formatDate(booking.date)} · {booking.time}
        </p>
        <p className="mt-1 text-xs text-muted">{booking.seats} seat{booking.seats > 1 ? 's' : ''} · {booking.name}</p>
      </div>
      <div className="ticket-divider" />
      <div className="ticket-notch ticket-notch--top" aria-hidden="true" />
      <div className="ticket-notch ticket-notch--bottom" aria-hidden="true" />
      <div className="flex flex-row items-center justify-between gap-3 p-5 sm:w-44 sm:flex-col sm:items-center sm:justify-center">
        <div className="text-left sm:text-center">
          <p className="eyebrow">Total</p>
          <p className="font-display text-lg font-semibold">{formatPrice(booking.total)}</p>
        </div>
        <div className="flex flex-col items-end gap-2 sm:items-center">
          <Link
            to={`/bookings/${booking.bookingId}/confirmation`}
            className="font-mono text-xs font-semibold uppercase tracking-wide text-primary"
          >
            View ticket →
          </Link>
          {!isCancelled && (
            <button
              onClick={() => onCancel(booking.bookingId)}
              className="text-xs font-semibold text-accent-dark hover:underline"
            >
              Cancel booking
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { bookings, cancelBooking } = useBookings()
  const { favorites } = useFavorites()
  const { viewed } = useRecentlyViewed()
  const { showToast } = useToast()

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = bookings.filter((b) => b.date >= today && b.status !== 'cancelled')
  const favoriteEvents = favorites.map((id) => events.find((e) => e.id === id)).filter(Boolean)
  const viewedEvents = viewed.map((id) => events.find((e) => e.id === id)).filter(Boolean)

  function handleCancel(bookingId) {
    if (window.confirm('Cancel this booking? This can\'t be undone.')) {
      cancelBooking(bookingId)
      showToast('Booking cancelled')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="eyebrow">Your dashboard</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
        Welcome{user ? `, ${user.name}` : ''}
      </h1>

      {!user && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-offset px-5 py-4 text-sm">
          <span className="text-muted">Log in to sync your bookings and favourites across devices.</span>
          <Link to="/login" className="font-semibold text-accent">Log in →</Link>
        </div>
      )}

      {/* Upcoming bookings */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Upcoming bookings</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No upcoming bookings yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {upcoming.map((b) => (
              <BookingRow key={b.bookingId} booking={b} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </section>

      {/* Booking history */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Booking history</h2>
        {bookings.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line py-12 text-center">
            <p className="font-display text-lg font-semibold">No bookings yet</p>
            <p className="mt-2 text-sm text-muted">Book your first event and it'll show up here.</p>
            <Link to="/events" className="btn-primary mt-6 inline-flex">Browse events</Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {bookings.map((b) => (
              <BookingRow key={b.bookingId} booking={b} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </section>

      {/* Favourite events */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Favourite events</h2>
        {favoriteEvents.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Tap the heart on any event to save it here.
          </p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {/* Recently viewed */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Recently viewed</h2>
        {viewedEvents.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Events you look at will show up here.</p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {viewedEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
