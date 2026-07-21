const router = require('express').Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const requireAuth = require('../middleware/requireAuth')
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBooking,
} = require('../controllers/bookingController')

// All booking routes require authentication
router.use(requireAuth)

// Create booking
router.post(
  '/',
  [
    body('eventId').notEmpty().withMessage('eventId is required'),
    body('seats').isInt({ min: 1 }).withMessage('seats must be a positive integer'),
    body('attendeeDetails').optional().isArray(),
  ],
  validate,
  createBooking
)

// My bookings list
router.get('/me', getMyBookings)

// Single booking (for ticket/confirmation page)
router.get('/:id', getBooking)

// Cancel booking
router.patch('/:id/cancel', cancelBooking)

module.exports = router
