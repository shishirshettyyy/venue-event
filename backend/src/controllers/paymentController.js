const Payment = require('../models/Payment')
const Booking = require('../models/Booking')
const { v4: uuidv4 } = require('uuid')

// ─── Create payment (mock gateway) ───────────────────────────────────────────
async function createPayment(req, res, next) {
  try {
    const { bookingId, method, upiId, cardDetails } = req.body

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
    })

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.payment) {
      return res.status(400).json({ message: 'Payment already exists for this booking' })
    }

    // Mock: always succeed
    const transactionRef = 'TXN-' + uuidv4().slice(0, 12).toUpperCase()

    const payment = await Payment.create({
      booking: bookingId,
      method,
      amount: booking.totalAmount,
      status: 'success',
      transactionRef,
      meta: method === 'upi' ? { upiId } : { last4: cardDetails?.cardNumber?.slice(-4) },
    })

    // Link payment to booking
    booking.payment = payment._id
    await booking.save()

    res.status(201).json({ payment })
  } catch (err) {
    next(err)
  }
}

// ─── Get payment for a booking ────────────────────────────────────────────────
async function getPayment(req, res, next) {
  try {
    const payment = await Payment.findById(req.params.id).populate('booking')
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }
    res.json(payment)
  } catch (err) {
    next(err)
  }
}

module.exports = { createPayment, getPayment }
