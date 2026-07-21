const router = require('express').Router()
const { body } = require('express-validator')
const validate = require('../middleware/validate')
const requireAuth = require('../middleware/requireAuth')
const { createPayment, getPayment } = require('../controllers/paymentController')

router.use(requireAuth)

router.post(
  '/',
  [
    body('bookingId').notEmpty().withMessage('bookingId is required'),
    body('method').isIn(['upi', 'card']).withMessage('method must be upi or card'),
  ],
  validate,
  createPayment
)

router.get('/:id', getPayment)

module.exports = router
