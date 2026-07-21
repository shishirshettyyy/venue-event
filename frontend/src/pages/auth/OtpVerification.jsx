import React, { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const LENGTH = 6

export default function OtpVerification() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()
  const { email, name, mode } = location.state || {}
  const [digits, setDigits] = useState(Array(LENGTH).fill(''))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputs = useRef([])

  if (!email) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">Nothing to verify yet</h1>
        <p className="mt-2 text-sm text-muted">Start from login or registration to get a code.</p>
        <Link to="/login" className="btn-primary mt-6 inline-flex">Go to login</Link>
      </div>
    )
  }

  function handleChange(i, value) {
    const v = value.replace(/[^0-9]/g, '').slice(-1)
    const next = [...digits]
    next[i] = v
    setDigits(next)
    if (error) setError('')
    if (v && i < LENGTH - 1) inputs.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length !== LENGTH) {
      setError('Enter the full 6-digit code.')
      return
    }
    setError('')
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      if (mode === 'reset') {
        navigate('/reset-password', { state: { email } })
      } else {
        login({ name, email })
        navigate('/dashboard')
      }
    }, 500)
  }

  function handleResend() {
    setDigits(Array(LENGTH).fill(''))
    setError('')
    inputs.current[0]?.focus()
    showToast('A new code has been sent')
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
      <p className="eyebrow text-center">Verify it's you</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Enter the code</h1>
      <p className="mt-3 text-center text-sm text-muted">
        We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>
      </p>

      <form onSubmit={handleSubmit} noValidate className="auth-card mt-8 space-y-6">
        <div className="flex justify-center gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              aria-invalid={!!error}
              className={`otp-box ${error ? 'form-input-error' : ''}`}
            />
          ))}
        </div>

        {error && <p className="text-center text-sm font-medium text-accent-dark">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <span className="spinner" /> : null}
          {submitting ? 'Verifying…' : 'Verify code'}
        </button>
        <p className="text-center text-sm text-muted">
          Didn't get it?{' '}
          <button type="button" onClick={handleResend} className="font-semibold text-accent">
            Resend code
          </button>
        </p>
      </form>
    </div>
  )
}
