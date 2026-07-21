import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isValidEmail, isRequired } from '../../utils/validate.js'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!isRequired(email)) {
      setError('Email is required.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      navigate('/verify-otp', { state: { email, mode: 'reset' } })
    }, 500)
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
      <p className="eyebrow text-center">Account recovery</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Forgot your password?</h1>
      <p className="mt-3 text-center text-sm text-muted">
        Enter your email and we'll send a one-time code to verify it's you.
      </p>

      <form onSubmit={handleSubmit} noValidate className="auth-card mt-8 space-y-5">
        <div>
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={!!error}
            className={`form-input mt-1.5 ${error ? 'form-input-error' : ''}`}
          />
          {error && <p className="form-error">{error}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <span className="spinner" /> : null}
          {submitting ? 'Sending code…' : 'Send code'}
        </button>
        <p className="text-center text-sm text-muted">
          Remembered it? <Link to="/login" className="font-semibold text-accent">Back to login</Link>
        </p>
      </form>
    </div>
  )
}
