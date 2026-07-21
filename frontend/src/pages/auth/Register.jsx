import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isValidEmail, isRequired, minLength } from '../../utils/validate.js'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const next = {}
    if (!isRequired(name)) next.name = 'Your name is required.'
    if (!isRequired(email)) next.email = 'Email is required.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!isRequired(password)) next.password = 'Password is required.'
    else if (!minLength(password, 6)) next.password = 'Password should be at least 6 characters.'
    if (!isRequired(confirm)) next.confirm = 'Confirm your password.'
    else if (password !== confirm) next.confirm = 'Passwords don\'t match.'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      navigate('/verify-otp', { state: { email, name, mode: 'register' } })
    }, 500)
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
      <p className="eyebrow text-center">Get started</p>
      <h1 className="mt-2 text-center text-3xl font-bold">Create your account</h1>

      <form onSubmit={handleSubmit} noValidate className="auth-card mt-8 space-y-5">
        <div>
          <label className="form-label" htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className={`form-input mt-1.5 ${errors.name ? 'form-input-error' : ''}`}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>
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
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            aria-invalid={!!errors.password}
            className={`form-input mt-1.5 ${errors.password ? 'form-input-error' : ''}`}
          />
          {errors.password && <p className="form-error">{errors.password}</p>}
        </div>
        <div>
          <label className="form-label" htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            aria-invalid={!!errors.confirm}
            className={`form-input mt-1.5 ${errors.confirm ? 'form-input-error' : ''}`}
          />
          {errors.confirm && <p className="form-error">{errors.confirm}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <span className="spinner" /> : null}
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="font-semibold text-accent">Log in</Link>
        </p>
      </form>
    </div>
  )
}
