const mongoose = require('mongoose')

const attendeeDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  { _id: false }
)

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: [1, 'Must book at least 1 seat'],
    },
    attendeeDetails: [attendeeDetailSchema],
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    bookingCode: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  { timestamps: true }
)

bookingSchema.index({ user: 1, createdAt: -1 })
bookingSchema.index({ event: 1 })

module.exports = mongoose.model('Booking', bookingSchema)
