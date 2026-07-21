const Event = require('../models/Event')
const Booking = require('../models/Booking')

// ─── Create event ─────────────────────────────────────────────────────────────
async function createEvent(req, res, next) {
  try {
    const {
      title, description, category, city, state,
      venue, dateTime, price, totalSeats, status, bannerImage,
    } = req.body

    const event = await Event.create({
      title,
      description,
      category,
      city,
      state,
      venue,
      dateTime,
      price,
      totalSeats,
      status: status || 'draft',
      bannerImage: bannerImage || '',
      organizer: req.user._id,
    })

    res.status(201).json({ event })
  } catch (err) {
    next(err)
  }
}

// ─── List organizer's own events ──────────────────────────────────────────────
async function listOrganizerEvents(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const filter = { organizer: req.user._id }
    if (status) filter.status = status

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Event.countDocuments(filter),
    ])

    res.json({ events, total, page: parseInt(page, 10) })
  } catch (err) {
    next(err)
  }
}

// ─── Update event ─────────────────────────────────────────────────────────────
async function updateEvent(req, res, next) {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id })
    if (!event) {
      return res.status(404).json({ message: 'Event not found or you are not the organizer' })
    }

    const updatable = [
      'title', 'description', 'category', 'city', 'state',
      'venue', 'dateTime', 'price', 'totalSeats', 'status', 'bannerImage',
    ]
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field]
    })

    // Prevent totalSeats from going below seatsBooked
    if (event.totalSeats < event.seatsBooked) {
      return res.status(400).json({
        message: `Cannot set totalSeats (${event.totalSeats}) below already-booked seats (${event.seatsBooked})`,
      })
    }

    await event.save()
    res.json({ event })
  } catch (err) {
    next(err)
  }
}

// ─── Cancel event (cascades to bookings) ──────────────────────────────────────
async function cancelEvent(req, res, next) {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    if (event.status === 'cancelled') {
      return res.status(400).json({ message: 'Event is already cancelled' })
    }

    event.status = 'cancelled'
    await event.save()

    // Cancel all confirmed bookings for this event
    await Booking.updateMany(
      { event: event._id, status: 'confirmed' },
      { status: 'cancelled' }
    )

    res.json({ message: 'Event cancelled and all bookings updated', event })
  } catch (err) {
    next(err)
  }
}

// ─── Delete event ─────────────────────────────────────────────────────────────
async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const bookingCount = await Booking.countDocuments({ event: event._id, status: 'confirmed' })
    if (bookingCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete an event with active bookings. Cancel the event instead.',
      })
    }

    await event.deleteOne()
    res.json({ message: 'Event deleted' })
  } catch (err) {
    next(err)
  }
}

// ─── Get attendees for an event ────────────────────────────────────────────────
async function getEventAttendees(req, res, next) {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user._id })
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const bookings = await Booking.find({ event: event._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })

    res.json({
      eventTitle: event.title,
      totalBooked: event.seatsBooked,
      totalSeats: event.totalSeats,
      bookings,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createEvent,
  listOrganizerEvents,
  updateEvent,
  cancelEvent,
  deleteEvent,
  getEventAttendees,
}
