import React from 'react'
import { Link } from 'react-router-dom'
import CategoryArt from './CategoryArt.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatDateParts, formatPrice } from '../utils/format.js'

export default function EventCard({ event }) {
  const { month, day } = formatDateParts(event.date)
  const lowSeats = event.seatsAvailable <= 10
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()
  const favorited = isFavorite(event.id)

  function handleToggle(e) {
    e.preventDefault()
    toggleFavorite(event.id)
    showToast(favorited ? 'Removed from favourites' : 'Saved to favourites')
  }

  return (
    <Link to={`/events/${event.id}`} className="event-card group">
      <div className="relative">
        <CategoryArt category={event.category} className="h-44 w-full" />
        <div className="date-badge">
          <span className="date-badge__month">{month}</span>
          <span className="date-badge__day">{day}</span>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`save-btn ${favorited ? 'text-accent' : ''}`}
          aria-label={favorited ? 'Remove from favourites' : 'Save to favourites'}
          aria-pressed={favorited}
        >
          {favorited ? '♥' : '♡'}
        </button>
      </div>

      <div className="p-4">
        <p className="font-mono text-xs font-semibold text-accent">
          {event.price === 0 ? 'FREE' : `From ${formatPrice(event.price)}`}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-display text-base font-semibold leading-snug text-ink group-hover:text-primary">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-muted">{event.venue}</p>
        <p className="text-sm text-muted">{event.city}, {event.state}</p>
        {lowSeats && (
          <p className="mt-2 text-xs font-semibold text-accent-dark">
            Only {event.seatsAvailable} seats left
          </p>
        )}
      </div>
    </Link>
  )
}
