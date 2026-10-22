import { useState, useId } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
  honeypot: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
  honeypot: '',
}

// Crisp, lightweight inline SVG icons matching reference design
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
)

const ExternalArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
)

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MessageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

export const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Unique accessible IDs
  const nameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const messageId = useId()
  const honeypotId = useId()

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'name': {
        const trimmed = value.trim()
        if (!trimmed) return 'Name is required.'
        if (trimmed.length < 2) return 'Please enter at least 2 characters.'
        if (trimmed.length > 100) return 'Name cannot exceed 100 characters.'
        return undefined
      }
      case 'email': {
        const trimmed = value.trim()
        if (!trimmed) return 'Email is required.'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        if (!emailRegex.test(trimmed)) {
          return 'Please enter a valid email address.'
        }
        if (trimmed.length > 150) return 'Email cannot exceed 150 characters.'
        return undefined
      }
      case 'phone': {
        const trimmed = value.trim()
        if (!trimmed) return undefined
        const phoneRegex = /^[+]?[\d\s\-().]{7,25}$/
        const digitCount = (trimmed.match(/\d/g) || []).length
        if (!phoneRegex.test(trimmed) || digitCount < 7 || digitCount > 15) {
          return 'Please enter a valid phone number.'
        }
        return undefined
      }
      case 'message': {
        const trimmed = value.trim()
        if (!trimmed) return 'Message is required.'
        if (trimmed.length < 10) return 'Message must be at least 10 characters long.'
        if (trimmed.length > 2500) return 'Message cannot exceed 2500 characters.'
        return undefined
      }
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const error = validateField(name as keyof FormData, value)
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Silently trap bots
    if (formData.honeypot && formData.honeypot.trim().length > 0) {
      setStatus('success')
      return
    }

    const newErrors: FormErrors = {}
    const nameErr = validateField('name', formData.name)
    const emailErr = validateField('email', formData.email)
    const phoneErr = validateField('phone', formData.phone)
    const messageErr = validateField('message', formData.message)

    if (nameErr) newErrors.name = nameErr
    if (emailErr) newErrors.email = emailErr
    if (phoneErr) newErrors.phone = phoneErr
    if (messageErr) newErrors.message = messageErr

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setStatus('idle')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          message: formData.message.trim(),
          honeypot: formData.honeypot,
        }),
      })

      const data = await response.json().catch(() => null)

      if (response.ok && data?.success !== false) {
        setStatus('success')
        setFormData(INITIAL_FORM_DATA)
        setErrors({})
      } else {
        const message =
          data?.error ||
          (response.status === 503
            ? 'The submission service is currently awaiting RESEND_API_KEY setup in your hosting environment. Please reach out directly via email or phone.'
            : 'Could not deliver message through the serverless endpoint. Please use the direct email link below.')
        setStatus('error')
        setErrorMessage(message)
      }
    } catch {
      setStatus('error')
      setErrorMessage(
        'Unable to connect to the backend serverless endpoint. You can email me directly using the link below.'
      )
    }
  }

  const generateMailtoFallback = () => {
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name.trim() || 'Visitor'}`)
    const bodyContent = [
      `Name: ${formData.name.trim() || 'Not specified'}`,
      `Email: ${formData.email.trim() || 'Not specified'}`,
      `Phone: ${formData.phone.trim() || 'Not provided'}`,
      '',
      'Message:',
      formData.message.trim() || '',
    ].join('\n')

    return `mailto:yuvraj925686@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyContent)}`
  }

  return (
    <section id="contact" className="content-section exact-contact-section" aria-label="Contact">
      <div className="section-container exact-contact-container">
        {/* =================================================================
            LEFT PANEL: Portrait Card + Contact Details
            ================================================================= */}
        <div className="exact-contact-panel exact-contact-panel--left">
          <div className="exact-panel-subgrid">
            {/* Left Column: Portrait Card */}
            <div className="exact-portrait-wrapper">
              <div className="exact-portrait-frame">
                <img
                  src="/images/profile-portrait-lowpoly-color.png"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.src.endsWith('/images/profile-portrait-lowpoly.png')) {
                      target.src = '/images/profile-portrait-lowpoly.png'
                    } else if (!target.src.endsWith('/images/profile-portrait.png')) {
                      target.src = '/images/profile-portrait.png'
                    }
                  }}
                  alt="Yuvraj Meena — Full-Stack & 3D Developer"
                  className="exact-portrait-image"
                  width={240}
                  height={320}
                  loading="eager"
                  decoding="async"
                />
                {/* Overlay Caption at bottom of portrait */}
                <div className="exact-portrait-bottom-overlay">
                  <div className="exact-portrait-name-row">
                    <span className="exact-cyan-status-dot" aria-hidden="true" />
                    <span className="exact-portrait-name">YUVRAJ MEENA</span>
                  </div>
                  <span className="exact-portrait-role">FULL-STACK &amp; 3D DEVELOPER</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Details */}
            <div className="exact-details-col">
              <div className="exact-eyebrow-row">
                <span className="exact-eyebrow-bullet">•</span>
                <span className="exact-eyebrow-text">GET IN TOUCH</span>
                <span className="exact-eyebrow-line" aria-hidden="true" />
              </div>

              <h2 className="exact-contact-heading">
                Let&apos;s Build Something <span className="exact-cyan-accent">Meaningful.</span>
              </h2>

              <p className="exact-contact-lead">
                I&apos;m open to discussing software projects, technical collaborations, and relevant career opportunities. Feel free to reach out — I&apos;d love to connect!
              </p>

              {/* 4 Contact Rows with Icons */}
              <div className="exact-channels-list">
                {/* 1. Phone */}
                <div className="exact-channel-row">
                  <div className="exact-channel-icon-bubble" aria-hidden="true">
                    <PhoneIcon />
                  </div>
                  <div className="exact-channel-info">
                    <span className="exact-channel-label">Phone</span>
                    <a
                      href="tel:9256867715"
                      className="exact-channel-value"
                      aria-label="Call 9256867715"
                    >
                      <span>9256867715</span>
                      <span className="exact-channel-arrow" aria-hidden="true"><ExternalArrowIcon /></span>
                    </a>
                  </div>
                </div>

                {/* 2. Email */}
                <div className="exact-channel-row">
                  <div className="exact-channel-icon-bubble" aria-hidden="true">
                    <MailIcon />
                  </div>
                  <div className="exact-channel-info">
                    <span className="exact-channel-label">Email</span>
                    <a
                      href="mailto:yuvraj925686@gmail.com"
                      className="exact-channel-value"
                      aria-label="Email yuvraj925686@gmail.com"
                    >
                      <span>yuvraj925686@gmail.com</span>
                      <span className="exact-channel-arrow" aria-hidden="true"><ExternalArrowIcon /></span>
                    </a>
                  </div>
                </div>

                {/* 3. GitHub */}
                <div className="exact-channel-row">
                  <div className="exact-channel-icon-bubble" aria-hidden="true">
                    <GitHubIcon />
                  </div>
                  <div className="exact-channel-info">
                    <span className="exact-channel-label">GitHub</span>
                    <a
                      href="https://github.com/yuvrajmeena12"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exact-channel-value"
                      aria-label="Visit Yuvraj GitHub profile (opens in new tab)"
                    >
                      <span>github.com/yuvrajmeena12</span>
                      <span className="exact-channel-arrow" aria-hidden="true"><ExternalArrowIcon /></span>
                    </a>
                  </div>
                </div>

                {/* 4. LinkedIn */}
                <div className="exact-channel-row">
                  <div className="exact-channel-icon-bubble" aria-hidden="true">
                    <LinkedInIcon />
                  </div>
                  <div className="exact-channel-info">
                    <span className="exact-channel-label">LinkedIn</span>
                    <a
                      href="https://www.linkedin.com/in/yuvraj-meena-a52b8b348"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exact-channel-value"
                      aria-label="Visit Yuvraj LinkedIn profile (opens in new tab)"
                    >
                      <span>linkedin.com/in/yuvraj-meena-a52b8b348</span>
                      <span className="exact-channel-arrow" aria-hidden="true"><ExternalArrowIcon /></span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            RIGHT PANEL: Send a Message Form
            ================================================================= */}
        <div className="exact-contact-panel exact-contact-panel--right">
          <div className="exact-eyebrow-row">
            <span className="exact-eyebrow-text">SEND A MESSAGE</span>
            <span className="exact-eyebrow-line" aria-hidden="true" />
          </div>

          {status === 'success' ? (
            <div className="exact-form-success" role="status" aria-live="polite">
              <div className="exact-success-icon" aria-hidden="true">✓</div>
              <h3 className="exact-success-title">Message Submitted</h3>
              <p className="exact-success-description">
                Thanks for reaching out! Your message has been received.
              </p>
              <button
                type="button"
                className="exact-submit-btn"
                onClick={() => {
                  setStatus('idle')
                  setFormData(INITIAL_FORM_DATA)
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              className="exact-contact-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
            >
              {/* Anti-spam honeypot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  opacity: 0,
                  height: 0,
                  width: 0,
                  overflow: 'hidden',
                }}
                aria-hidden="true"
              >
                <label htmlFor={honeypotId}>Do not fill this</label>
                <input
                  type="text"
                  id={honeypotId}
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={handleChange}
                />
              </div>

              {/* Row 1: Name and Email side-by-side on desktop */}
              <div className="exact-form-row exact-form-row--two-col">
                {/* Name Field */}
                <div className="exact-field-group">
                  <label htmlFor={nameId} className="exact-field-label">
                    Name <span className="exact-required-star" aria-hidden="true">*</span>
                  </label>
                  <div className={`exact-input-container ${errors.name ? 'exact-input--error' : ''}`}>
                    <span className="exact-input-icon" aria-hidden="true"><UserIcon /></span>
                    <input
                      type="text"
                      id={nameId}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your full name"
                      maxLength={100}
                      disabled={status === 'submitting'}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? `${nameId}-err` : undefined}
                      className="exact-input"
                    />
                  </div>
                  {errors.name && (
                    <span id={`${nameId}-err`} className="exact-field-error" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Email Field */}
                <div className="exact-field-group">
                  <label htmlFor={emailId} className="exact-field-label">
                    Email <span className="exact-required-star" aria-hidden="true">*</span>
                  </label>
                  <div className={`exact-input-container ${errors.email ? 'exact-input--error' : ''}`}>
                    <span className="exact-input-icon" aria-hidden="true"><MailIcon /></span>
                    <input
                      type="email"
                      id={emailId}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="you@example.com"
                      maxLength={150}
                      disabled={status === 'submitting'}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? `${emailId}-err` : undefined}
                      className="exact-input"
                    />
                  </div>
                  {errors.email && (
                    <span id={`${emailId}-err`} className="exact-field-error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Phone (optional) */}
              <div className="exact-field-group">
                <label htmlFor={phoneId} className="exact-field-label">
                  Phone <span className="exact-optional-text">(optional)</span>
                </label>
                <div className={`exact-input-container ${errors.phone ? 'exact-input--error' : ''}`}>
                  <span className="exact-input-icon" aria-hidden="true"><PhoneIcon /></span>
                  <input
                    type="tel"
                    id={phoneId}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+91 98765 43210"
                    maxLength={25}
                    disabled={status === 'submitting'}
                    aria-required="false"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? `${phoneId}-err` : undefined}
                    className="exact-input"
                  />
                </div>
                {errors.phone && (
                  <span id={`${phoneId}-err`} className="exact-field-error" role="alert">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Row 3: Message (required) */}
              <div className="exact-field-group">
                <label htmlFor={messageId} className="exact-field-label">
                  Message <span className="exact-required-star" aria-hidden="true">*</span>
                </label>
                <div className={`exact-input-container exact-textarea-container ${errors.message ? 'exact-input--error' : ''}`}>
                  <span className="exact-input-icon exact-textarea-icon" aria-hidden="true"><MessageIcon /></span>
                  <textarea
                    id={messageId}
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell me about your project, collaboration idea, or just say hi..."
                    maxLength={2500}
                    disabled={status === 'submitting'}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? `${messageId}-err` : undefined}
                    className="exact-textarea"
                  />
                </div>
                {errors.message && (
                  <span id={`${messageId}-err`} className="exact-field-error" role="alert">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Error Banner with Direct Email Fallback */}
              {status === 'error' && (
                <div className="exact-error-banner" role="alert">
                  <p className="exact-error-text">{errorMessage}</p>
                  <a
                    href={generateMailtoFallback()}
                    className="exact-mailto-fallback-link"
                    aria-label="Send message directly using your default email client"
                  >
                    Email Directly Instead ↗
                  </a>
                </div>
              )}

              {/* Full-Width Submit Button */}
              <button
                type="submit"
                className="exact-submit-btn"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <span className="exact-btn-content">
                    <span className="exact-btn-spinner" aria-hidden="true" />
                    <span>Sending Message...</span>
                  </span>
                ) : (
                  <span className="exact-btn-content">
                    <span className="exact-btn-icon" aria-hidden="true"><SendIcon /></span>
                    <span className="exact-btn-text">Send Message</span>
                    <span className="exact-btn-arrow" aria-hidden="true"><ArrowRightIcon /></span>
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactSection
