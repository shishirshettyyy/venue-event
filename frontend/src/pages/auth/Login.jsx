import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { isValidEmail, isRequired } from '../../utils/validate.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const next = {}
    if (!isRequired(email)) next.email = 'Email is required.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!isRequired(password)) next.password = 'Password is required.'
    else if (!minLen(password)) next.password = 'Password should be at least 4 characters.'
    return next
  }

  function minLen(v) {
    return v.trim().length >= 4
  }

  function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    setTimeout(() => {
      login({ email })
      setSubmitting(false)
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
      <p className="eyebrow text-center">Welcome back</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Log in to Venue</h1>

      <form onSubmit={handleSubmit} noValidate className="auth-card mt-8 space-y-5">
        <div>
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={`form-input mt-1.5 ${errors.email ? 'form-input-error' : ''}`}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="form-label" htmlFor="password">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-accent">Forgot password?</Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            className={`form-input mt-1.5 ${errors.password ? 'form-input-error' : ''}`}
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <span className="spinner" /> : null}
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
        <p className="text-center text-sm text-muted">
          New to Venue? <Link to="/register" className="font-semibold text-accent">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
