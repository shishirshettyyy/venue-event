const User = require('../models/User')
const { generateToken } = require('../utils/generateToken')
const { generateOtp } = require('../utils/generateOtp')
const { sendOtpEmail } = require('../utils/sendOtp')

// ─── Register ────────────────────────────────────────────────────────────────
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const passwordHash = await User.hashPassword(password)
    const { otp, expiresAt } = generateOtp()

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role === 'organizer' ? 'organizer' : 'attendee',
      otp,
      otpExpiresAt: expiresAt,
    })

    await sendOtpEmail(email, otp, 'Verify your Venue account')

    res.status(201).json({
      message: 'Registration successful. Check your email for the OTP.',
      userId: user._id,
    })
  } catch (err) {
    next(err)
  }
}

// ─── Verify OTP (email verification) ─────────────────────────────────────────
async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' })
    }

    user.isVerified = true
    user.otp = undefined
    user.otpExpiresAt = undefined
    await user.save()

    const token = generateToken(user)
    res.json({ message: 'Email verified', token, user })
  } catch (err) {
    next(err)
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!user.isVerified) {
      // Re-send OTP so the user can complete verification
      const { otp, expiresAt } = generateOtp()
      user.otp = otp
      user.otpExpiresAt = expiresAt
      await user.save()
      await sendOtpEmail(email, otp, 'Verify your Venue account')
      return res.status(403).json({
        message: 'Email not verified. A new OTP has been sent.',
        requiresVerification: true,
      })
    }

    const token = generateToken(user)
    res.json({ token, user })
  } catch (err) {
    next(err)
  }
}

// ─── Forgot password — send reset OTP ────────────────────────────────────────
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      // Return success anyway to avoid email enumeration
      return res.json({ message: 'If that email is registered, an OTP has been sent.' })
    }

    const { otp, expiresAt } = generateOtp()
    user.resetOtp = otp
    user.resetOtpExpiresAt = expiresAt
    await user.save()

    await sendOtpEmail(email, otp, 'Reset your Venue password')
    res.json({ message: 'Password reset OTP sent to your email.' })
  } catch (err) {
    next(err)
  }
}

// ─── Verify reset OTP ─────────────────────────────────────────────────────────
async function verifyResetOtp(req, res, next) {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user || !user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }
    if (user.resetOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' })
    }

    res.json({ message: 'OTP verified. Proceed to reset password.' })
  } catch (err) {
    next(err)
  }
}

// ─── Reset password ───────────────────────────────────────────────────────────
async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body

    const user = await User.findOne({ email })
    if (!user || !user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }
    if (user.resetOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' })
    }

    user.passwordHash = await User.hashPassword(newPassword)
    user.resetOtp = undefined
    user.resetOtpExpiresAt = undefined
    await user.save()

    res.json({ message: 'Password reset successful. Please log in.' })
  } catch (err) {
    next(err)
  }
}

// ─── Get current user profile ─────────────────────────────────────────────────
async function getMe(req, res) {
  res.json(req.user)
}

// ─── Update profile ───────────────────────────────────────────────────────────
async function updateMe(req, res, next) {
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-passwordHash')
    res.json(user)
  } catch (err) {
    next(err)
  }
}

// ─── Toggle favorite ──────────────────────────────────────────────────────────
async function toggleFavorite(req, res, next) {
  try {
    const { eventId } = req.params
    const user = req.user
    const mongoose = require('mongoose')
    const oid = new mongoose.Types.ObjectId(eventId)

    const alreadyFav = user.favorites.some((id) => id.equals(oid))
    if (alreadyFav) {
      await User.findByIdAndUpdate(user._id, { $pull: { favorites: oid } })
      return res.json({ favorited: false })
    } else {
      await User.findByIdAndUpdate(user._id, { $addToSet: { favorites: oid } })
      return res.json({ favorited: true })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  verifyOtp,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getMe,
  updateMe,
  toggleFavorite,
}
