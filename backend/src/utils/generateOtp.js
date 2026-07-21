/**
 * Generate a 6-digit numeric OTP and its expiry timestamp.
 * @returns {{ otp: string, expiresAt: Date }}
 */
function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const minutes = parseInt(process.env.OTP_EXPIRES_MIN || '10', 10)
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000)
  return { otp, expiresAt }
}

module.exports = { generateOtp }
