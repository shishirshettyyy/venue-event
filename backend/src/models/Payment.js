const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    method: {
      type: String,
      enum: ['upi', 'card'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    // Gateway reference (once a real gateway is wired in)
    transactionRef: {
      type: String,
      default: null,
    },
    // Mock UPI / card details stored for record (never store real card data!)
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
)

paymentSchema.index({ booking: 1 })

module.exports = mongoose.model('Payment', paymentSchema)
