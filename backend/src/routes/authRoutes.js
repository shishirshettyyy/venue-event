const router = require('express').Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const requireAuth = require('../middleware/requireAuth')
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getMe,
  updateMe,
  toggleFavorite,
} = require('../controllers/authController')

// ── Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['attendee', 'organizer']),
  ],
  validate,
  register
)

// ── Verify OTP (email verification)
router.post(
  '/verify-otp',
  [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validate,
  verifyOtp
)

// ── Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

// ── Forgot password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email required')],
  validate,
  forgotPassword
)

// ── Verify reset OTP
router.post(
  '/verify-reset-otp',
  [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
  ],
  validate,
  verifyResetOtp
)

// ── Reset password
router.post(
  '/reset-password',
  [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  resetPassword
)

// ── Profile (authenticated)
router.get('/users/me', requireAuth, getMe)
router.patch('/users/me', requireAuth, updateMe)
router.post('/users/me/favorites/:eventId', requireAuth, toggleFavorite)

module.exports = router
