import React from 'react'
import { mission, stats, values, techStack } from '../data/about.js'
import { useTeam } from '../hooks/useTeam.js'

// ─── Initials avatar fallback ──────────────────────────────────────────────────
function InitialsAvatar({ name }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  // Deterministic hue from the name so each person gets a consistent colour
  const hue = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360

  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-full font-display text-2xl font-bold text-white"
      style={{ background: `hsl(${hue} 55% 40%)` }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

// ─── Social icon link ──────────────────────────────────────────────────────────
function SocialLink({ href, label, children }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-ink hover:text-ink"
    >
      {children}
    </a>
  )
}

// ─── Team member card ──────────────────────────────────────────────────────────
function TeamCard({ member }) {
  const { name, role, bio, photo, links = {} } = member

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lift">
      {/* Avatar */}
      <div className="flex items-center justify-center bg-offset px-6 pt-8 pb-6">
        <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-line">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
            />
          ) : null}
          {/* Always render the initials fallback; CSS display controls visibility */}
          <div style={{ display: photo ? 'none' : 'flex' }} className="h-full w-full">
            <InitialsAvatar name={name} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-6">
        <h3 className="font-display text-base font-semibold text-ink">{name}</h3>
        <p className="mt-0.5 font-mono text-xs uppercase tracking-[0.1em] text-muted">{role}</p>
        {bio && (
          <p className="mt-3 text-sm leading-relaxed text-muted flex-1">{bio}</p>
        )}

        {/* Social links — only rendered if non-empty */}
        {(links.github || links.linkedin || links.portfolio) && (
          <div className="mt-4 flex gap-2">
            <SocialLink href={links.github} label={`${name} on GitHub`}>
              {/* GitHub icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </SocialLink>

            <SocialLink href={links.linkedin} label={`${name} on LinkedIn`}>
              {/* LinkedIn icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </SocialLink>

            <SocialLink href={links.portfolio} label={`${name}'s portfolio`}>
              {/* Globe / portfolio icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </SocialLink>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Skeleton card for loading state ──────────────────────────────────────────
function TeamCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex justify-center bg-offset px-6 pt-8 pb-6">
        <div className="skeleton h-20 w-20 rounded-full" />
      </div>
      <div className="px-5 pb-6">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton mt-2 h-3 w-24 rounded" />
        <div className="skeleton mt-4 h-3 w-full rounded" />
        <div className="skeleton mt-1.5 h-3 w-4/5 rounded" />
        <div className="mt-4 flex gap-2">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Team() {
  const { members, loading, error } = useTeam()

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      {/* ── Mission header (unchanged) ── */}
      <p className="eyebrow">{mission.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{mission.heading}</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{mission.body}</p>

      {/* ── Stats bar (unchanged) ── */}
      <div className="mt-10 flex flex-wrap gap-10 border-y border-line py-6">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Values (unchanged) ── */}
      <div className="mt-12">
        <p className="eyebrow">What we're building</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Team grid (live from /api/team) ── */}
      <div className="mt-12">
        <p className="eyebrow">Meet the team</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink">The people behind Venue</h2>

        {/* Loading */}
        {loading && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <TeamCardSkeleton key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-dashed border-line py-14 text-center">
            <p className="font-display text-base font-semibold text-ink">Couldn't load team members</p>
            <p className="mt-1 text-sm text-muted">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && members.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-line py-14 text-center">
            <p className="font-display text-base font-semibold text-ink">No team members yet</p>
            <p className="mt-1 text-sm text-muted">Check back soon.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && members.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <TeamCard key={m._id} member={m} />
            ))}
          </div>
        )}
      </div>

      {/* ── Tech stack (unchanged) ── */}
      <div className="mt-12 rounded-2xl border border-line bg-surface p-6">
        <p className="eyebrow">Tech stack</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {techStack.map((t) => (
            <span key={t} className="chip cursor-default hover:border-line">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
