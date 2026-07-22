import React, { createContext, useContext, useState } from 'react'
import { api } from '../utils/api.js'

const AuthContext = createContext(null)

function loadAuth() {
  try {
    return {
      token: localStorage.getItem('venue.token'),
      user: JSON.parse(localStorage.getItem('venue.user') || 'null'),
    }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const initial = loadAuth()
  const [user, setUser] = useState(initial.user)
  const [token, setToken] = useState(initial.token)

  // ─── Persist / clear auth ────────────────────────────────────────────────
  function setAuth(userData, tokenData) {
    setUser(userData)
    setToken(tokenData)
    if (userData && tokenData) {
      localStorage.setItem('venue.user', JSON.stringify(userData))
      localStorage.setItem('venue.token', tokenData)
    } else {
      localStorage.removeItem('venue.user')
      localStorage.removeItem('venue.token')
    }
  }

  // ─── Register → creates account, logs in immediately ────────────────────────
  async function register(name, email, password, role = 'attendee') {
    const data = await api.post('/auth/register', { name, email, password, role })
    setAuth(data.user, data.token)
    return data
  }


  // ─── Verify OTP (email verification after register) ──────────────────────
  async function verifyOtp(email, otp) {
    const data = await api.post('/auth/verify-otp', { email, otp })
    setAuth(data.user, data.token)
    return data
  }

  // ─── Login ───────────────────────────────────────────────────────────────
  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password })
    setAuth(data.user, data.token)
    return data
  }

  // ─── Forgot password ─────────────────────────────────────────────────────
  async function forgotPassword(email) {
    return api.post('/auth/forgot-password', { email })
  }

  // ─── Verify reset OTP ─────────────────────────────────────────────────────
  async function verifyResetOtp(email, otp) {
    return api.post('/auth/verify-reset-otp', { email, otp })
  }

  // ─── Reset password ───────────────────────────────────────────────────────
  async function resetPassword(email, otp, newPassword) {
    return api.post('/auth/reset-password', { email, otp, newPassword })
  }

  // ─── Logout ───────────────────────────────────────────────────────────────
  function logout() {
    setAuth(null, null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, verifyOtp, forgotPassword, verifyResetOtp, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
