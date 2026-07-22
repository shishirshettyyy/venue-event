import React, { useState, useEffect } from 'react'

const CATEGORIES = ['Workshop', 'Meetup', 'Show', 'Concert', 'Conference']
const PRESET_IMAGES = [
  { label: 'Workshop', value: 'workshop' },
  { label: 'Meetup', value: 'meetup' },
  { label: 'Show', value: 'show' },
  { label: 'Concert', value: 'concert' },
  { label: 'Conference', value: 'conference' },
]

export default function EventFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEditing = Boolean(initialData)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Workshop')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [venue, setVenue] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [price, setPrice] = useState('0')
  const [totalSeats, setTotalSeats] = useState('100')
  const [status, setStatus] = useState('published')
  const [bannerImage, setBannerImage] = useState('workshop')
  const [customImage, setCustomImage] = useState('')

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setCategory(initialData.category || 'Workshop')
      setDescription(initialData.description || '')
      setCity(initialData.city || '')
      setState(initialData.state || '')
      setVenue(initialData.venue || '')
      
      // Format ISO or Date for datetime-local input
      if (initialData.dateTime) {
        const d = new Date(initialData.dateTime)
        const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
        setDateTime(localIso)
      } else if (initialData.date) {
        setDateTime(`${initialData.date}T10:00`)
      } else {
        setDateTime('')
      }

      setPrice(String(initialData.price ?? 0))
      setTotalSeats(String(initialData.totalSeats ?? 100))
      setStatus(initialData.status || 'published')
      if (initialData.bannerImage && initialData.bannerImage.startsWith('http')) {
        setCustomImage(initialData.bannerImage)
        setBannerImage('custom')
      } else {
        setBannerImage(initialData.image || initialData.bannerImage || 'workshop')
      }
    } else {
      // Default reset
      setTitle('')
      setCategory('Workshop')
      setDescription('')
      setCity('')
      setState('')
      setVenue('')
      const now = new Date()
      now.setDate(now.getDate() + 7)
      const defaultDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      setDateTime(defaultDate)
      setPrice('0')
      setTotalSeats('100')
      setStatus('published')
      setBannerImage('workshop')
      setCustomImage('')
    }
    setErrors({})
    setSubmitError('')
  }, [initialData, isOpen])

  if (!isOpen) return null

  function validate() {
    const errs = {}
    if (!title.trim()) errs.title = 'Event title is required.'
    if (!description.trim()) errs.description = 'Description is required.'
    if (!category) errs.category = 'Select a category.'
    if (!city.trim()) errs.city = 'City is required.'
    if (!venue.trim()) errs.venue = 'Venue name/address is required.'
    if (!dateTime) errs.dateTime = 'Date and time are required.'
    if (price === '' || Number(price) < 0) errs.price = 'Price must be 0 or greater.'
    if (!totalSeats || Number(totalSeats) < 1) errs.totalSeats = 'Total seats must be at least 1.'

    if (isEditing && initialData?.seatsBooked && Number(totalSeats) < initialData.seatsBooked) {
      errs.totalSeats = `Total seats cannot be less than seats already booked (${initialData.seatsBooked}).`
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitError('')
    setSubmitting(true)

    const finalImage = bannerImage === 'custom' ? customImage : bannerImage

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        city: city.trim(),
        state: state.trim() || 'Gujarat',
        venue: venue.trim(),
        dateTime: new Date(dateTime).toISOString(),
        price: Number(price),
        totalSeats: Number(totalSeats),
        status,
        bannerImage: finalImage,
      })
      onClose()
    } catch (err) {
      setSubmitError(err.message || 'Failed to save event. Please check inputs.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="eyebrow">{isEditing ? 'Update Details' : 'New Event'}</p>
            <h2 className="text-xl font-bold sm:text-2xl">
              {isEditing ? 'Edit Event' : 'Create an Event'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:bg-offset hover:text-ink"
          >
            ✕
          </button>
        </div>

        {submitError && (
          <div className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent-dark">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label className="form-label" htmlFor="event-title">Event Title *</label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js Masterclass 2026"
              className={`form-input mt-1.5 ${errors.title ? 'form-input-error' : ''}`}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          {/* Category & Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="event-category">Category *</label>
              <select
                id="event-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  if (bannerImage !== 'custom') setBannerImage(e.target.value.toLowerCase())
                }}
                className={`form-input mt-1.5 ${errors.category ? 'form-input-error' : ''}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="form-error">{errors.category}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="event-status">Publish Status</label>
              <select
                id="event-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-input mt-1.5"
              >
                <option value="published">Published (Visible to Attendees)</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label" htmlFor="event-description">Description *</label>
            <textarea
              id="event-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of what attendees can expect..."
              className={`form-input mt-1.5 resize-none ${errors.description ? 'form-input-error' : ''}`}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Location: City, State, Venue */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label" htmlFor="event-city">City *</label>
              <input
                id="event-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className={`form-input mt-1.5 ${errors.city ? 'form-input-error' : ''}`}
              />
              {errors.city && <p className="form-error">{errors.city}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="event-state">State</label>
              <input
                id="event-state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="form-input mt-1.5"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="event-venue">Venue Name / Address *</label>
              <input
                id="event-venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. NSCI Dome"
                className={`form-input mt-1.5 ${errors.venue ? 'form-input-error' : ''}`}
              />
              {errors.venue && <p className="form-error">{errors.venue}</p>}
            </div>
          </div>

          {/* Date/Time, Price, Total Seats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label" htmlFor="event-datetime">Date &amp; Start Time *</label>
              <input
                id="event-datetime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className={`form-input mt-1.5 ${errors.dateTime ? 'form-input-error' : ''}`}
              />
              {errors.dateTime && <p className="form-error">{errors.dateTime}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="event-price">Ticket Price (₹) *</label>
              <input
                id="event-price"
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0 for free"
                className={`form-input mt-1.5 ${errors.price ? 'form-input-error' : ''}`}
              />
              {errors.price && <p className="form-error">{errors.price}</p>}
            </div>

            <div>
              <label className="form-label" htmlFor="event-seats">Total Capacity (Seats) *</label>
              <input
                id="event-seats"
                type="number"
                min="1"
                step="1"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                placeholder="e.g. 100"
                className={`form-input mt-1.5 ${errors.totalSeats ? 'form-input-error' : ''}`}
              />
              {errors.totalSeats && <p className="form-error">{errors.totalSeats}</p>}
            </div>
          </div>

          {/* Banner Preset / Custom Image */}
          <div>
            <label className="form-label">Banner Style / Preset</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESET_IMAGES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    setBannerImage(p.value)
                    setCustomImage('')
                  }}
                  className={`chip ${bannerImage === p.value ? 'chip-active' : ''}`}
                >
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setBannerImage('custom')}
                className={`chip ${bannerImage === 'custom' ? 'chip-active' : ''}`}
              >
                Custom Image URL
              </button>
            </div>

            {bannerImage === 'custom' && (
              <div className="mt-3">
                <input
                  type="url"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="form-input"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary !py-2.5 !px-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary !py-2.5 !px-6"
            >
              {submitting ? <span className="spinner" /> : null}
              {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
