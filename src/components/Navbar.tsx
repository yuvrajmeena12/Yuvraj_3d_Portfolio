import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Monogram } from './Monogram'

const NAV_LINKS = [
  { label: 'Home', href: '#hero', id: 'hero' },
  { label: 'Projects', href: '#projects', id: 'projects' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Skills', href: '#skills', id: 'skills' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const shouldReduceMotion = useReducedMotion()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.slice(1)
      const element = document.getElementById(targetId)
      if (element) {
        e.preventDefault()
        element.scrollIntoView({
          behavior: shouldReduceMotion ? 'auto' : 'smooth',
          block: 'start',
        })
        window.history.pushState(null, '', href)
        element.focus({ preventScroll: true })
      }
    }
    setMobileMenuOpen(false)
  }

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      // Near top of document always defaults to hero
      if (window.scrollY < 120) {
        setActiveSection('hero')
        return
      }

      // If at or near bottom of page, highlight contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact')
        return
      }

      // Check sections from bottom up or by proximity to upper-middle viewport
      const viewportTrigger = window.innerHeight * 0.35
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(NAV_LINKS[i].id)
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect()
          if (rect.top <= viewportTrigger && rect.bottom >= 0) {
            setActiveSection(NAV_LINKS[i].id)
            return
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on Escape key for accessibility
  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  return (
    <header className="site-header">
      <div className="header-container">
        <motion.a
          href="#hero"
          className="brand-logo"
          aria-label="Yuvraj — Return to top of portfolio"
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
        >
          <Monogram size={28} className="brand-monogram" title="Yuvraj Monogram" />
          <span className="logo-text">YUVRAJ</span>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Primary Navigation">
          <ul className="nav-list">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id
              return (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    whileHover={shouldReduceMotion ? {} : { y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
          <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-navigation-drawer"
            className="mobile-nav"
            aria-label="Mobile Navigation"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <ul className="mobile-nav-list">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

