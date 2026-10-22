// api/contact.js
// Vercel Serverless Function for Portfolio Contact Form

const rateLimitMap = new Map()

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' })
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute window
    const maxRequests = 5 // max 5 submissions per minute per IP

    const timestamps = (rateLimitMap.get(ip) || []).filter((time) => now - time < windowMs)
    if (timestamps.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a minute before submitting again.',
      })
    }
    timestamps.push(now)
    rateLimitMap.set(ip, timestamps)

    const { name, email, phone, message, honeypot } = req.body || {}

    // Honeypot spam trap: if filled, silently discard to frustrate bots
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(200).json({ success: true, message: 'Message received.' })
    }

    // Server-side validation
    const trimmedName = typeof name === 'string' ? name.trim() : ''
    const trimmedEmail = typeof email === 'string' ? email.trim() : ''
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : ''
    const trimmedMessage = typeof message === 'string' ? message.trim() : ''

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({ success: false, error: 'Name must be between 2 and 100 characters.' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' })
    }

    if (trimmedPhone) {
      const phoneRegex = /^[+]?[\d\s\-().]{7,25}$/
      const digitCount = (trimmedPhone.match(/\d/g) || []).length
      if (!phoneRegex.test(trimmedPhone) || digitCount < 7 || digitCount > 15) {
        return res.status(400).json({ success: false, error: 'Phone number format is invalid.' })
      }
    }

    if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 2500) {
      return res.status(400).json({ success: false, error: 'Message must be between 10 and 2500 characters.' })
    }

    // Check if email dispatch service is configured
    const apiKey = process.env.RESEND_API_KEY
    const notificationRecipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'yuvraj925686@gmail.com'

    if (!apiKey) {
      // Service is not yet configured with an API key
      return res.status(503).json({
        success: false,
        code: 'UNCONFIGURED_SERVICE',
        error: 'The contact submission endpoint is awaiting RESEND_API_KEY configuration. You can reach out directly via email.',
      })
    }

    // Dispatch via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
        to: [notificationRecipient],
        reply_to: trimmedEmail,
        subject: `Portfolio Inquiry from ${trimmedName}`,
        text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nPhone: ${trimmedPhone || 'Not provided'}\n\nMessage:\n${trimmedMessage}`,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        error: data.message || 'Email dispatch provider returned an error.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Thanks for reaching out. Your message has been submitted successfully.',
    })
  } catch {
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your message.',
    })
  }
}
