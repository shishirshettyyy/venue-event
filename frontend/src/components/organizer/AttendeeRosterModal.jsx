import React, { useState, useEffect } from 'react'
import { formatDate, formatPrice } from '../../utils/format.js'

export default function AttendeeRosterModal({ isOpen, onClose, eventId, fetchAttendees }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (isOpen && eventId) {
      setLoading(true)
      setError(null)
      fetchAttendees(eventId)
        .then((res) => {
          setData(res)
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message || 'Failed to load attendee roster.')
          setLoading(false)
        })
    } else {
      setData(null)
      setQuery('')
    }
  }, [isOpen, eventId, fetchAttendees])

  if (!isOpen) return null

  const bookings = data?.bookings || []
  const filteredBookings = bookings.filter((b) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    const name = b.user?.name || b.name || ''
    const email = b.user?.email || b.email || ''
    const phone = b.user?.phone || b.phone || ''
    return (
      name.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q) ||
      phone.toLowerCase().includes(q)
    )
  })

  const totalSeats = data?.totalSeats || 1
  const totalBooked = data?.totalBooked || 0
  const occupancyPercent = Math.min(100, Math.round((totalBooked / totalSeats) * 100))

  function handleExportCSV() {
    if (!bookings.length) return
    const headers = ['Attendee Name', 'Email', 'Phone', 'Seats Booked', 'Total Paid (INR)', 'Status', 'Booking Date']
    const rows = bookings.map((b) => {
      const name = `"${(b.user?.name || b.name || 'Anonymous').replace(/"/g, '""')}"`
      const email = `"${(b.user?.email || b.email || '').replace(/"/g, '""')}"`
      const phone = `"${(b.user?.phone || b.phone || '').replace(/"/g, '""')}"`
      const seats = b.seats || 1
      const totalPaid = b.totalPaid ?? b.total ?? 0
      const status = b.status || 'confirmed'
      const date = b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'
      return [name, email, phone, seats, totalPaid, status, date].join(',')
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    const sanitizedTitle = (data?.eventTitle || 'Event').replace(/[^a-z0-9]/gi, '_').toLowerCase()
    link.setAttribute('download', `${sanitizedTitle}_attendees.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div>
            <p className="eyebrow">Event Guest List</p>
            <h2 className="text-xl font-bold sm:text-2xl">
              {data?.eventTitle || 'Attendee Roster'}
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

        {/* Capacity Summary & Actions */}
        {!loading && !error && data && (
          <div className="mt-4 flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Occupancy bar */}
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted">Capacity Occupancy</span>
                <span className="font-mono text-ink">
                  {totalBooked} / {totalSeats} seats ({occupancyPercent}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-offset">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
            </div>

            {/* CSV Download Button */}
            <button
              onClick={handleExportCSV}
              disabled={bookings.length === 0}
              className="btn-secondary !py-2 !px-4 text-xs font-semibold"
            >
              📥 Export Roster (.csv)
            </button>
          </div>
        )}

        {/* Search Input */}
        {!loading && !error && bookings.length > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-full border border-line px-4 py-2">
            <span className="text-muted">⌕</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search attendees by name, email, or phone..."
              className="w-full text-sm outline-none placeholder:text-muted"
            />
          </div>
        )}

        {/* Content area */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {loading && (
            <div className="py-16 text-center text-sm text-muted">
              <span className="spinner !h-6 !w-6 border-accent" />
              <p className="mt-3 font-medium">Loading attendee roster...</p>
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-sm font-medium text-accent-dark">
              {error}
            </div>
          )}

          {!loading && !error && filteredBookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line py-12 text-center">
              <p className="font-display text-base font-semibold">No attendees found</p>
              <p className="mt-1 text-xs text-muted">
                {query ? 'No matching guests found for your search query.' : 'No seats have been booked for this event yet.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredBookings.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-offset text-muted font-mono uppercase tracking-wider text-[11px] border-b border-line">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Attendee</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold text-center">Seats</th>
                    <th className="px-4 py-3 font-semibold text-right">Amount Paid</th>
                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredBookings.map((b) => {
                    const name = b.user?.name || b.name || 'Attendee'
                    const email = b.user?.email || b.email || 'N/A'
                    const phone = b.user?.phone || b.phone || 'N/A'
                    const isCancelled = b.status === 'cancelled'

                    return (
                      <tr key={b._id || b.id} className="hover:bg-offset/50 transition">
                        <td className="px-4 py-3 font-medium text-ink">
                          {name}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          <div>{email}</div>
                          {phone !== 'N/A' && <div className="text-[11px] text-muted/80">{phone}</div>}
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-semibold">
                          {b.seats || 1}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-ink">
                          {formatPrice(b.totalPaid ?? b.total ?? 0)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                              isCancelled
                                ? 'bg-accent/10 text-accent-dark'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {b.status || 'confirmed'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
