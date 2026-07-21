import React, { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import CategoryArt from '../components/CategoryArt.jsx'
import { useEvent } from '../hooks/useEvents.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useRecentlyViewed } from '../context/RecentlyViewedContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatDateLong, formatPrice } from '../utils/format.js'

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="skeleton h-4 w-16 rounded" />
      <div className="mt-5 grid gap-10 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="skeleton h-56 w-full rounded-2xl sm:h-72" />
          <div className="skeleton mt-6 h-3 w-32 rounded" />
          <div className="skeleton mt-3 h-8 w-3/4 rounded" />
          <div className="skeleton mt-5 h-4 w-1/2 rounded" />
        </div>
        <div className="skeleton h-64 w-full rounded-2xl" />
      </div>
    </div>
  )
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { event, loading } = useEvent(id)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addViewed } = useRecentlyViewed()
  const { showToast } = useToast()

  useEffect(() => {
    if (event) addViewed(event.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id])

  if (loading) return <DetailSkeleton />

  if (!event) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">This event isn't listed</h1>
        <p className="mt-2 text-sm text-muted">It may have wrapped up or been removed.</p>
        <Link to="/events" className="btn-primary mt-6 inline-flex">Browse other events</Link>
      </div>
    )
  }

  const soldFraction = 1 - event.seatsAvailable / event.totalSeats
  const favorited = isFavorite(event.id)

  function handleFavorite() {
    toggleFavorite(event.id)
    showToast(favorited ? 'Removed from favourites' : 'Saved to favourites')
  }

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      showToast('Link copied to clipboard')
    } catch {
      showToast('Could not copy the link')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <button onClick={() => navigate(-1)} className="text-sm font-medium text-muted hover:text-ink">
        ← Back
      </button>

      <div className="mt-5 grid gap-10 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="relative">
            <CategoryArt category={event.category} className="h-56 w-full rounded-2xl sm:h-72" />
            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="save-btn static"
                aria-label="Share this event"
              >
                ⤴
              </button>
              <button
                type="button"
                onClick={handleFavorite}
                className={`save-btn static ${favorited ? 'text-accent' : ''}`}
                aria-label={favorited ? 'Remove from favourites' : 'Save to favourites'}
                aria-pressed={favorited}
              >
                {favorited ? '♥' : '♡'}
              </button>
            </div>
          </div>

          <p className="eyebrow mt-6">{event.city} · {event.state}</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">{event.title}</h1>

          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm text-muted">
            <span>{formatDateLong(event.date)}</span>
            <span>{event.time}</span>
            <span>{event.venue}</span>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h2 className="font-display text-lg font-semibold">About this event</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/80">{event.description}</p>
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <h2 className="font-display text-lg font-semibold">Organized by</h2>
            <p className="mt-2 text-sm text-ink/80">{event.organizer}</p>
          </div>
        </div>

        {/* Booking panel */}
        <div className="h-fit rounded-2xl border border-line bg-surface p-6 shadow-card sm:sticky sm:top-24">
          <p className="eyebrow">Price per seat</p>
          <p className="mt-1 font-display text-3xl font-semibold">{formatPrice(event.price)}</p>

          <div className="mt-5">
            <div className="flex justify-between text-xs text-muted">
              <span>{event.seatsAvailable} seats left</span>
              <span>{event.totalSeats} total</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.min(100, soldFraction * 100)}%` }}
              />
            </div>
          </div>

          <Link to={`/events/${event.id}/book`} className="btn-primary mt-6 w-full">
            Book seats
          </Link>
          <p className="mt-3 text-center text-xs text-muted">
            Pay by UPI/QR or card on the next step
          </p>
        </div>
      </div>
    </div>
  )
}
