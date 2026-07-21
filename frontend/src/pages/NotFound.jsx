import React from 'react'
import { Link } from 'react-router-dom'

function TornTicketIllustration() {
  return (
    <svg
      width="220"
      height="180"
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="notFoundTicketTitle"
    >
      <title id="notFoundTicketTitle">A torn event ticket</title>

      {/* left half of the ticket */}
      <g transform="rotate(-8 60 90)">
        <path
          d="M10 40 h70 a10 10 0 0 1 10 10 v10 a10 10 0 0 0 0 20 v10 a10 10 0 0 0 0 20 v10 a10 10 0 0 1 -10 10 H10 a10 10 0 0 1 -10 -10 V50 a10 10 0 0 1 10 -10 Z"
          fill="#3D1560"
        />
        <line x1="20" y1="55" x2="65" y2="55" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="68" x2="55" y2="68" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* right half of the ticket */}
      <g transform="rotate(7 160 95)">
        <path
          d="M130 45 h70 a10 10 0 0 1 10 10 v90 a10 10 0 0 1 -10 10 h-70 a10 10 0 0 1 -10 -10 v-10 a10 10 0 0 0 0 -20 v-10 a10 10 0 0 0 0 -20 v-10 a10 10 0 0 1 10 -10 Z"
          fill="#F05537"
        />
        <line x1="150" y1="115" x2="185" y2="115" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
        <line x1="150" y1="128" x2="175" y2="128" stroke="#FFFFFF" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* scattered confetti */}
      <circle cx="20" cy="20" r="4" fill="#F05537" opacity="0.6" />
      <circle cx="200" cy="25" r="3" fill="#3D1560" opacity="0.5" />
      <circle cx="110" cy="12" r="3" fill="#F05537" opacity="0.4" />
      <circle cx="35" cy="160" r="3" fill="#3D1560" opacity="0.4" />
      <circle cx="195" cy="150" r="4" fill="#F05537" opacity="0.5" />
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 text-center sm:px-8">
      <TornTicketIllustration />
      <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        Error 404
      </p>
      <h1 className="mt-2 text-2xl font-bold">This ticket doesn't check out</h1>
      <p className="mt-2 text-sm text-muted">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn-secondary">Go home</Link>
        <Link to="/events" className="btn-primary">Browse events</Link>
      </div>
    </div>
  )
}
