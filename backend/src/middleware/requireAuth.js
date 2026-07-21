const { verifyToken } = require('../utils/generateToken')
const User = require('../models/User')

/**
 * Middleware: ensures the request carries a valid JWT.
 * Attaches `req.user` (the User document, without sensitive fields) on success.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided — please log in' })
    }

    const token = authHeader.slice(7)
    const payload = verifyToken(token)

    const user = await User.findById(payload.id).select('-passwordHash -otp -otpExpiresAt -resetOtp -resetOtpExpiresAt')
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired — please log in again' })
    }
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = requireAuth
