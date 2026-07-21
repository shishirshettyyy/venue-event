const mongoose = require('mongoose')
const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const Event = require('../models/Event')
const { generateBookingCode } = require('../utils/bookingCode')

// ─── Create booking ───────────────────────────────────────────────────────────
/**
 * Atomically checks seat availability and decrements seatsBooked.
 * Uses findOneAndUpdate with a conditional filter to prevent overbooking
 * under concurrent requests (no separate Mongoose transaction needed).
 */
async function createBooking(req, res, next) {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { eventId, seats, attendeeDetails } = req.body

    // Atomically decrement seats — only if enough are available
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        status: 'published',
        $expr: { $gte: [{ $subtract: ['$totalSeats', '$seatsBooked'] }, seats] },
      },
      { $inc: { seatsBooked: seats } },
      { new: true, session }
    )

    if (!event) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: 'Not enough seats available or event is unavailable' })
    }

    const bookingCode = generateBookingCode()
    const totalAmount = event.price * seats

    const [booking] = await Booking.create(
      [
        {
          event: eventId,
          user: req.user._id,
          seats,
          attendeeDetails: attendeeDetails || [],
          bookingCode,
          totalAmount,
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    // Populate for the response
    await booking.populate('event', 'title dateTime venue city bannerImage price')

    res.status(201).json({ booking })
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    next(err)
  }
}

// ─── Get my bookings ──────────────────────────────────────────────────────────
async function getMyBookings(req, res, next) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title dateTime venue city bannerImage price category status')
      .populate('payment', 'method amount status transactionRef')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    next(err)
  }
}

// ─── Cancel booking ───────────────────────────────────────────────────────────
async function cancelBooking(req, res, next) {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).session(session)

    if (!booking) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ message: 'Booking not found' })
    }
    if (booking.status === 'cancelled') {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ message: 'Booking is already cancelled' })
    }

    // Return seats
    await Event.findByIdAndUpdate(
      booking.event,
      { $inc: { seatsBooked: -booking.seats } },
      { session }
    )

    booking.status = 'cancelled'
    await booking.save({ session })

    await session.commitTransaction()
    session.endSession()

    res.json({ message: 'Booking cancelled', booking })
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    next(err)
  }
}

// ─── Get single booking (ticket page) ────────────────────────────────────────
async function getBooking(req, res, next) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate('event', 'title dateTime venue city bannerImage price category')
      .populate('payment')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }
    res.json(booking)
  } catch (err) {
    next(err)
  }
}

module.exports = { createBooking, getMyBookings, cancelBooking, getBooking }
