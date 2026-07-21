const router = require('express').Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const requireAuth = require('../middleware/requireAuth')
const requireRole = require('../middleware/requireRole')
const {
  createEvent,
  listOrganizerEvents,
  updateEvent,
  cancelEvent,
  deleteEvent,
  getEventAttendees,
} = require('../controllers/organizerController')

// All organizer routes require auth + organizer role
router.use(requireAuth, requireRole('organizer', 'admin'))

const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .isIn(['Workshop', 'Meetup', 'Show', 'Concert', 'Conference'])
    .withMessage('Invalid category'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('dateTime').isISO8601().withMessage('Valid dateTime required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0'),
  body('totalSeats').isInt({ min: 1 }).withMessage('totalSeats must be >= 1'),
]

router.post('/', eventValidation, validate, createEvent)
router.get('/', listOrganizerEvents)
router.patch('/:id', validate, updateEvent)
router.patch('/:id/cancel', cancelEvent)
router.delete('/:id', deleteEvent)
router.get('/:id/attendees', getEventAttendees)

module.exports = router
