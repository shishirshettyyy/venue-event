import React, { useState } from 'react'
import { isValidEmail, isRequired } from '../utils/validate.js'

const faqs = [
  {
    q: 'How do I get my ticket after booking?',
    a: 'Once your payment is confirmed, a digital ticket is generated instantly and saved to your dashboard under "Upcoming bookings". You can show it at the door from your phone.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes — go to your dashboard, find the booking, and select "Cancel booking". Refund timelines depend on the event organizer\'s policy.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'You can pay by scanning a UPI QR code with any UPI app, or by entering card details on the payment step.',
  },
  {
    q: 'Is Venue available outside Rajasthan?',
    a: 'Yes — events are listed from cities across the country, and more are added regularly.',
  },
  {
    q: 'How do I list my own event?',
    a: 'Event organizers can reach out through this contact form and our team will set up access to the organizer dashboard.',
  },
]

const socials = [
  { label: 'Instagram', href: '#', glyph: '◐' },
  { label: 'X', href: '#', glyph: '✕' },
  { label: 'LinkedIn', href: '#', glyph: 'in' },
  { label: 'Facebook', href: '#', glyph: 'f' },
]

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="border-b border-line py-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-ink">{item.q}</span>
        <span className="ml-4 shrink-0 text-lg text-muted">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{item.a}</p>}
    </div>
  )
}

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState({})
  const [openFaq, setOpenFaq] = useState(0)

  function validate() {
    const next = {}
    if (!isRequired(name)) next.name = 'Enter your name.'
    if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!isRequired(message)) next.message = 'Add a message so we know how to help.'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    }, 700)
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <p className="eyebrow">Get in touch</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Contact us</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Questions about a booking, a technical issue, or want to list your own event? Send us a
        message and we'll get back to you.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-[1.1fr_0.9fr]">
        {/* Contact form */}
        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          {sent && (
            <div className="mb-5 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
              Thanks — your message has been sent. We'll reply within a couple of days.
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={`form-input mt-1.5 ${errors.name ? 'form-input-error' : ''}`}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`form-input mt-1.5 ${errors.email ? 'form-input-error' : ''}`}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
          </div>
          <div className="mt-5">
            <label className="form-label" htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              className="form-input mt-1.5"
            />
          </div>
          <div className="mt-5">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more…"
              rows={5}
              className={`form-input mt-1.5 resize-none ${errors.message ? 'form-input-error' : ''}`}
            />
            {errors.message && <p className="form-error">{errors.message}</p>}
          </div>

          <button type="submit" disabled={sending} className="btn-primary mt-6 w-full sm:w-auto">
            {sending ? <span className="spinner" /> : null}
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>

        {/* Map placeholder + socials */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-line">
            <div
              className="relative flex h-56 items-center justify-center bg-offset"
              style={{
                backgroundImage:
                  'linear-gradient(rgb(var(--color-ink) / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-ink) / 0.04) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              <div className="text-center">
                <span className="grid h-11 w-11 mx-auto place-items-center rounded-full bg-accent text-lg text-white">
                  ⚲
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">Map integration coming soon</p>
                <p className="text-xs text-muted">Our office location will appear here</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <p className="eyebrow">Follow us</p>
            <div className="mt-3 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-base"
                >
                  {s.glyph}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <p className="eyebrow">Common questions</p>
        <h2 className="mt-2 text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 max-w-2xl">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
