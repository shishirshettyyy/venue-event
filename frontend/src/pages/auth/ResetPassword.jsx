import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { isRequired, minLength } from '../../utils/validate.js'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const { email, otp } = location.state || {}
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  if (!email || !otp) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center sm:px-8">
        <h1 className="font-display text-2xl font-semibold">Nothing to reset yet</h1>
        <p className="mt-2 text-sm text-muted">Start from "Forgot password" to reset your password.</p>
        <Link to="/forgot-password" className="btn-primary mt-6 inline-flex">Go there</Link>
      </div>
    )
  }

  function validate() {
    const next = {}
    if (!isRequired(password))        next.password = 'Password is required.'
    else if (!minLength(password, 6)) next.password = 'Password should be at least 6 characters.'
    if (!isRequired(confirm))         next.confirm  = 'Confirm your new password.'
    else if (password !== confirm)    next.confirm  = "Passwords don't match."
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setApiError('')
    setSubmitting(true)
    try {
      await resetPassword(email, otp, password)
      setDone(true)
    } catch (err) {
      setApiError(err.message || 'Password reset failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center sm:px-8">
        <span className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-success/10 text-success">✓</span>
        <h1 className="mt-4 font-display text-2xl font-semibold">Password updated</h1>
        <p className="mt-2 text-sm text-muted">You can now log in with your new password.</p>
        <Link to="/login" className="btn-primary mt-6 inline-flex">Go to login</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
      <p className="eyebrow text-center">Almost done</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Set a new password</h1>

      <form onSubmit={handleSubmit} noValidate className="auth-card mt-8 space-y-5">
        {apiError && (
          <div className="rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent-dark">
            {apiError}
          </div>
        )}
        <div>
          <label className="form-label" htmlFor="password">New password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters" aria-invalid={!!errors.password}
            className={`form-input mt-1.5 ${errors.password ? 'form-input-error' : ''}`} />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>
        <div>
          <label className="form-label" htmlFor="confirm">Confirm new password</label>
          <input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password" aria-invalid={!!errors.confirm}
            className={`form-input mt-1.5 ${errors.confirm ? 'form-input-error' : ''}`} />
          {errors.confirm && <p className="form-error">{errors.confirm}</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <span className="spinner" /> : null}
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
