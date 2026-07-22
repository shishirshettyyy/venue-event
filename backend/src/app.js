require('dotenv').config()
const express = require('express')
const cors = require('cors')

const errorHandler = require('./middleware/errorHandler')

const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const organizerRoutes = require('./routes/organizerRoutes')
const teamRoutes = require('./routes/teamRoutes')

const app = express()

// ─── CORS ──────────────────────────────────────────────────────────────────────
// Trim any trailing slash from CLIENT_URL so exact-match always works
const ALLOWED_ORIGIN = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server / curl requests (no origin header)
      if (!origin) return callback(null, true)
      // Strip trailing slash from incoming origin just in case
      const clean = origin.replace(/\/$/, '')
      // Allow the configured production URL
      if (clean === ALLOWED_ORIGIN) return callback(null, true)
      // Allow any localhost port for local development
      if (/^http:\/\/localhost(:\d+)?$/.test(clean)) return callback(null, true)
      callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  })
)

// ─── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/users', authRoutes)   // /api/users/me, /api/users/me/favorites/:id
app.use('/api/events', eventRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/organizer/events', organizerRoutes)
app.use('/api/team', teamRoutes)

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// ─── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler)

module.exports = app
