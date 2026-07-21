const nodemailer = require('nodemailer')

// Build the transporter once
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/**
 * Send an OTP email.
 * If SMTP is not configured (dev mode), it prints the OTP to the console instead.
 *
 * @param {string} to   Recipient email
 * @param {string} otp  The 6-digit OTP to send
 * @param {string} [subject='Your Venue OTP']
 */
async function sendOtpEmail(to, otp, subject = 'Your Venue OTP') {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <h2 style="color: #1a1a2e; margin-bottom: 8px;">Venue Platform</h2>
      <p style="color: #4b5563;">Use the OTP below to verify your account. It expires in ${process.env.OTP_EXPIRES_MIN || 10} minutes.</p>
      <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; margin: 24px 0; text-align: center;">
        ${otp}
      </div>
      <p style="color: #9ca3af; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `

  // Dev fallback — no SMTP configured
  if (!process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.mailtrap.io') {
    console.log(`\n📧 [DEV] OTP for ${to}: ${otp}\n`)
    return
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@venue.app',
    to,
    subject,
    html,
  })
}

module.exports = { sendOtpEmail }
