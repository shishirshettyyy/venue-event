import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categories } from '../data/events.js'
import { useEvents } from '../hooks/useEvents.js'
import EventCard from '../components/EventCard.jsx'
import EventCardSkeleton from '../components/EventCardSkeleton.jsx'
import CategoryArt from '../components/CategoryArt.jsx'

const categoryIcons = {
  Workshop: '⌁',
  Meetup: '◎',
  Show: '✶',
  Concert: '♪',
  Conference: '▢',
}

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { events, loading } = useEvents()
  const featured = events.slice(0, 4)

  function handleSearch(e) {
    e.preventDefault()
    navigate(query ? `/events?q=${encodeURIComponent(query)}` : '/events')
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-offset">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
          <div className="grid gap-10 sm:grid-cols-[1.05fr_0.95fr] sm:items-center">
            <div>
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
                Discover events <span className="text-accent">worth showing up for.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                Workshops, meetups, shows and conferences — book a seat anywhere in the country,
                from a single platform built to make it painless.
              </p>

              <form onSubmit={handleSearch} className="mt-8 flex max-w-lg items-center gap-2 rounded-full bg-surface p-2 shadow-card">
                <span className="pl-3 text-muted">⌕</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by event, city, or category"
                  className="w-full py-2 text-sm outline-none placeholder:text-muted"
                />
                <button type="submit" className="btn-primary !py-2.5 !px-5 text-sm shrink-0">
                  Search
                </button>
              </form>

              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link key={c} to={`/events?category=${encodeURIComponent(c)}`} className="chip">
                    <span className="mr-1.5">{categoryIcons[c]}</span>
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            {/* Collage of category art, standing in for a photo grid */}
            <div className="grid grid-cols-2 gap-3">
              <CategoryArt category="Show" className="col-span-2 h-32 rounded-2xl shadow-card" />
              <CategoryArt category="Concert" className="h-32 rounded-2xl shadow-card" />
              <CategoryArt category="Workshop" className="h-32 rounded-2xl shadow-card" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Happening soon</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Featured across India</h2>
            </div>
            <Link to="/events" className="hidden text-sm font-semibold text-accent sm:block">
              See all events →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
              : featured.map((e) => <EventCard key={e.id} event={e} />)}
          </div>

          <Link to="/events" className="mt-8 block text-center text-sm font-semibold text-accent sm:hidden">
            See all events →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line bg-offset">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="eyebrow">How booking works</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Three steps, one ticket</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { title: 'Find your event', body: 'Search or filter by city, state, or category to see what\'s on near you.' },
              { title: 'Pick your seats', body: 'Choose how many seats you need and review the details before you confirm.' },
              { title: 'Get your ticket', body: 'A digital ticket lands in your bookings, ready to show at the door.' },
            ].map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-line bg-surface p-6">
                <p className="font-mono text-sm font-bold text-accent">0{i + 1}</p>
                <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
