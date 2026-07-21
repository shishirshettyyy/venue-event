const Event = require('../models/Event')

// ─── List events (public) ─────────────────────────────────────────────────────
async function listEvents(req, res, next) {
  try {
    const { city, category, search, page = 1, limit = 12, status } = req.query

    const filter = {}

    // Only show published events to the public
    filter.status = status === 'all' ? { $ne: 'draft' } : 'published'

    if (city) filter.city = { $regex: new RegExp(city, 'i') }
    if (category) filter.category = category

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { venue: { $regex: new RegExp(search, 'i') } },
      ]
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10)
    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organizer', 'name email')
        .sort({ dateTime: 1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Event.countDocuments(filter),
    ])

    res.json({
      events,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    })
  } catch (err) {
    next(err)
  }
}

// ─── Get single event (public) ────────────────────────────────────────────────
async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email')
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (err) {
    next(err)
  }
}

// ─── Get unique cities and categories (for filter dropdowns) ──────────────────
async function getMeta(req, res, next) {
  try {
    const [cities, categories, states] = await Promise.all([
      Event.distinct('city', { status: 'published' }),
      Event.distinct('category', { status: 'published' }),
      Event.distinct('state', { status: 'published' }),
    ])
    res.json({ cities: cities.sort(), categories, states: states.sort() })
  } catch (err) {
    next(err)
  }
}

module.exports = { listEvents, getEvent, getMeta }
