import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-offset">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent font-display text-sm font-bold text-white">
                V
              </span>
              <span className="font-display text-base font-bold">Venue</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Workshops, meetups and shows, from every city that's hosting one.
            </p>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-ink/75">
              <li>Workshops</li>
              <li>Meetups</li>
              <li>Live shows</li>
              <li>Conferences</li>
              <li><Link to="/contact" className="hover:text-ink">Contact us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-line pt-6 text-xs text-muted">
          <p>&copy; 2026 Venue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
