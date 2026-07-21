import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/contact', label: 'Contact' },
  { to: '/team', label: 'About us' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  function handleSearch(e) {
    e.preventDefault()
    navigate(query ? `/events?q=${encodeURIComponent(query)}` : '/events')
    setOpen(false)
  }

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5 sm:px-8">
        <NavLink to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-display text-base font-bold text-white">
            V
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Venue</span>
        </NavLink>

        <form onSubmit={handleSearch} className="hidden flex-1 items-center sm:flex">
          <div className="flex w-full items-center rounded-full border border-line px-4 py-2 focus-within:border-ink">
            <span className="mr-2 text-muted">⌕</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, cities, categories"
              className="w-full text-sm outline-none placeholder:text-muted"
            />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? 'text-accent' : 'text-ink/75 hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition hover:border-ink"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-sm font-bold text-white"
                aria-label="Account menu"
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-line bg-surface p-2 shadow-lift">
                  <p className="truncate px-3 py-1.5 text-xs text-muted">{user.email}</p>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-offset"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-accent-dark hover:bg-offset"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="text-sm font-semibold text-ink/75 hover:text-ink">
              Log in
            </NavLink>
          )}

          <NavLink to="/events" className="btn-primary !py-2.5 !px-5 text-sm">
            Find events
          </NavLink>
        </nav>

        <button
          className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-line sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="font-mono text-sm">{open ? '×' : '≡'}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface px-5 py-4 sm:hidden">
          <form onSubmit={handleSearch} className="mb-4 flex items-center rounded-full border border-line px-4 py-2">
            <span className="mr-2 text-muted">⌕</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, cities…"
              className="w-full text-sm outline-none placeholder:text-muted"
            />
          </form>
          <div className="flex flex-col gap-4">
            <NavLink to="/events" onClick={() => setOpen(false)} className="text-sm font-semibold text-ink/80">
              Browse events
            </NavLink>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-ink/80"
              >
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              className="text-left text-sm font-semibold text-ink/80"
            >
              {theme === 'dark' ? '☀ Switch to light mode' : '☾ Switch to dark mode'}
            </button>
            {user ? (
              <button onClick={handleLogout} className="text-left text-sm font-semibold text-accent-dark">
                Log out ({user.name})
              </button>
            ) : (
              <NavLink to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-ink/80">
                Log in
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
