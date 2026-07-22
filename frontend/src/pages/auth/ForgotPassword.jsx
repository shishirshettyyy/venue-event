import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { isValidEmail, isRequired, minLength } from '../../utils/validate.js'

// Multi-step forgot password: Email → OTP → New Password (all on one page)
export default function ForgotPassword() {
  const { forgotPassword, verifyResetOtp, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [step, setStep]         = useState(1)   // 1=email, 2=otp, 3=new password
  const [email, setEmail]       = useState('')
  const [otp, setOtp]           = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]         = useState(false)

  // ── Step 1: send OTP ─────────────────────────────────────────────────────
  async function handleSendOtp(e) {
    e.preventDefault()
    if (!isRequired(email))    { setError('Email is required.'); return }
    if (!isValidEmail(email))  { setError('Enter a valid email address.'); return }
    setError('')
    setSubmitting(true)
    try {
      await forgotPassword(email)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Step 2: verify OTP ───────────────────────────────────────────────────
  async function handleVerifyOtp(e) {
    e.preventDefault()
    if (!isRequired(otp)) { setError('Please enter the OTP.'); return }
    setError('')
    setSubmitting(true)
    try {
      await verifyResetOtp(email, otp)
      setStep(3)
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Step 3: set new password ─────────────────────────────────────────────
  async function handleReset(e) {
    e.preventDefault()
    if (!isRequired(password))        { setError('Password is required.'); return }
    if (!minLength(password, 6))      { setError('At least 6 characters.'); return }
    if (password !== confirm)         { setError("Passwords don't match."); return }
    setError('')
    setSubmitting(true)
    try {
      await resetPassword(email, otp, password)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ───────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center sm:px-8">
        <span className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-success/10 text-success text-2xl">✓</span>
        <h1 className="mt-4 font-display text-2xl font-semibold">Password updated!</h1>
        <p className="mt-2 text-sm text-muted">You can now log in with your new password.</p>
        <Link to="/login" className="btn-primary mt-6 inline-flex">Go to login</Link>
      </div>
    )
  }

  const stepLabel = step === 1 ? 'Step 1 of 3 — Enter email'
                  : step === 2 ? 'Step 2 of 3 — Enter OTP'
                  :              'Step 3 of 3 — New password'

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
      <p className="eyebrow text-center">Account recovery</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Forgot your password?</h1>
      <p className="mt-3 text-center text-sm text-muted">{stepLabel}</p>

      {/* ── Progress bar ── */}
      <div className="mt-5 flex gap-1.5">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-accent' : 'bg-line'}`} />
        ))}
      </div>

      <div className="auth-card mt-6 space-y-5">
        {error && (
          <div className="rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent-dark">
            {error}
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} noValidate className="space-y-5">
            <div>
              <label className="form-label" htmlFor="fp-email">Email address</label>
              <input
                id="fp-email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input mt-1.5"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <span className="spinner" /> : null}
              {submitting ? 'Sending code…' : 'Send reset code'}
            </button>
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} noValidate className="space-y-5">
            <p className="text-sm text-muted">
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
            </p>
            <div>
              <label className="form-label" htmlFor="fp-otp">One-time code</label>
              <input
                id="fp-otp" type="text" inputMode="numeric" maxLength={6}
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="form-input mt-1.5 tracking-widest text-center text-lg"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <span className="spinner" /> : null}
              {submitting ? 'Verifying…' : 'Verify code'}
            </button>
            <button type="button" onClick={() => { setStep(1); setOtp(''); setError('') }}
              className="w-full text-center text-sm text-muted hover:text-ink">
              ← Change email
            </button>
          </form>
        )}

        {/* ── Step 3: New password ── */}
        {step === 3 && (
          <form onSubmit={handleReset} noValidate className="space-y-5">
            <div>
              <label className="form-label" htmlFor="fp-password">New password</label>
              <input
                id="fp-password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="form-input mt-1.5"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="fp-confirm">Confirm new password</label>
              <input
                id="fp-confirm" type="password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className="form-input mt-1.5"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <span className="spinner" /> : null}
              {submitting ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-muted">
          Remembered it? <Link to="/login" className="font-semibold text-accent">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
