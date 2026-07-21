const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['attendee', 'organizer', 'admin'],
      default: 'attendee',
    },
    phone: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    // OTP fields
    otp: String,
    otpExpiresAt: Date,
    // Password reset OTP
    resetOtp: String,
    resetOtpExpiresAt: Date,
  },
  { timestamps: true }
)

// Virtual: never expose passwordHash in JSON responses
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash
    delete ret.otp
    delete ret.otpExpiresAt
    delete ret.resetOtp
    delete ret.resetOtpExpiresAt
    return ret
  },
})

// Instance method: compare raw password with stored hash
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

// Static method: hash a plain password
userSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(plain, salt)
}

module.exports = mongoose.model('User', userSchema)
