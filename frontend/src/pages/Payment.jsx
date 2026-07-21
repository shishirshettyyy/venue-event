import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { events } from '../data/events.js'
import { useBookings } from '../context/BookingContext.jsx'
import { isRequired } from '../utils/validate.js'
import { formatPrice } from '../utils/format.js'

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length < 3) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export default function Payment() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addBooking } = useBookings()
  const event = events.find((e) => e.id === id)
  const draft = location.state

  const [method, setMethod] = useState('qr')
  const [processing, setProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [errors, setErrors] = useState({})

  if (!event || !draft) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">Nothing to pay for yet</h1>
        <p className="mt-2 text-sm text-muted">Start a booking from the event page first.</p>
        <Link to="/events" className="btn-primary mt-6 inline-flex">Browse events</Link>
      </div>
    )
  }

  const qrPayload = encodeURIComponent(
    `upi://pay?pa=venue.tickets@upi&pn=Venue&am=${draft.total}&cu=INR&tn=${event.id}`
  )
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${qrPayload}`

  function validateCard() {
    const next = {}
    if (!isRequired(cardName)) next.cardName = 'Enter the name on the card.'
    const digits = cardNumber.replace(/\s/g, '')
    if (digits.length !== 16) next.cardNumber = 'Card number should be 16 digits.'
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      next.cardExpiry = 'Use MM/YY.'
    } else {
      const [mm] = cardExpiry.split('/')
      if (Number(mm) < 1 || Number(mm) > 12) next.cardExpiry = 'Enter a valid month.'
    }
    if (!/^\d{3,4}$/.test(cardCvv)) next.cardCvv = '3-4 digits.'
    return next
  }

  function completePayment(e) {
    e.preventDefault()
    if (method === 'card') {
      const next = validateCard()
      setErrors(next)
      if (Object.keys(next).length > 0) return
    } else {
      setErrors({})
    }

    setProcessing(true)
    setTimeout(() => {
      const record = addBooking({
        eventId: event.id,
        eventTitle: event.title,
        city: event.city,
        state: event.state,
        venue: event.venue,
        date: event.date,
        time: event.time,
        seats: draft.seats,
        total: draft.total,
        name: draft.name,
        email: draft.email,
        paymentMethod: method === 'qr' ? 'UPI / QR' : 'Card',
      })
      navigate(`/bookings/${record.bookingId}/confirmation`)
    }, 900)
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <p className="eyebrow">Payment</p>
      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Complete your booking</h1>
      <p className="mt-1 text-sm text-muted">{event.title} · {draft.seats} seat{draft.seats > 1 ? 's' : ''}</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_280px]">
        <div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setMethod('qr'); setErrors({}) }}
              className={`chip ${method === 'qr' ? 'chip-active' : ''}`}
            >
              Scan &amp; pay (UPI / QR)
            </button>
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`chip ${method === 'card' ? 'chip-active' : ''}`}
            >
              Card
            </button>
          </div>

          <form onSubmit={completePayment} noValidate className="mt-6 rounded-2xl border border-line bg-surface p-6">
            {method === 'qr' ? (
              <div className="flex flex-col items-center text-center">
                <img
                  src={qrSrc}
                  alt="Scan this QR code with any UPI app to pay"
                  className="h-48 w-48 rounded-xl border border-line p-2"
                />
                <p className="mt-4 text-sm font-semibold text-ink">Scan with any UPI app</p>
                <p className="mt-1 text-xs text-muted">Google Pay · PhonePe · Paytm · BHIM</p>
                <p className="mt-3 font-mono text-xs text-muted">venue.tickets@upi</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="form-label" htmlFor="cardName">Name on card</label>
                  <input
                    id="cardName"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="As printed on the card"
                    className={`form-input mt-1.5 ${errors.cardName ? 'form-input-error' : ''}`}
                  />
                  {errors.cardName && <p className="form-error">{errors.cardName}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="cardNumber">Card number</label>
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className={`form-input mt-1.5 ${errors.cardNumber ? 'form-input-error' : ''}`}
                  />
                  {errors.cardNumber && <p className="form-error">{errors.cardNumber}</p>}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="form-label" htmlFor="expiry">Expiry</label>
                    <input
                      id="expiry"
                      type="text"
                      inputMode="numeric"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className={`form-input mt-1.5 ${errors.cardExpiry ? 'form-input-error' : ''}`}
                    />
                    {errors.cardExpiry && <p className="form-error">{errors.cardExpiry}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="form-label" htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      className={`form-input mt-1.5 ${errors.cardCvv ? 'form-input-error' : ''}`}
                    />
                    {errors.cardCvv && <p className="form-error">{errors.cardCvv}</p>}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={processing} className="btn-primary mt-6 w-full">
              {processing ? <span className="spinner" /> : null}
              {processing ? 'Confirming payment…' : `Pay ${formatPrice(draft.total)}`}
            </button>
            <p className="mt-3 text-center text-xs text-muted">This is a demo — no real payment is made</p>
          </form>
        </div>

        <div className="h-fit rounded-2xl border border-line bg-offset p-6">
          <p className="eyebrow">Order summary</p>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-muted">Seats</span>
            <span>× {draft.seats}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(draft.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
