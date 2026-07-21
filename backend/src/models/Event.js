const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Workshop', 'Meetup', 'Show', 'Concert', 'Conference'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and time are required'],
    },
    bannerImage: {
      type: String,
      default: '',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [1, 'Must have at least 1 seat'],
    },
    seatsBooked: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled', 'completed'],
      default: 'draft',
    },
  },
  { timestamps: true }
)

// Virtual: seats available
eventSchema.virtual('seatsAvailable').get(function () {
  return this.totalSeats - this.seatsBooked
})

// Include virtuals in JSON
eventSchema.set('toJSON', { virtuals: true })
eventSchema.set('toObject', { virtuals: true })

// Index for common query patterns
eventSchema.index({ city: 1, category: 1, status: 1, dateTime: 1 })
eventSchema.index({ organizer: 1 })

module.exports = mongoose.model('Event', eventSchema)
