import { Monogram } from './Monogram'

export const Footer = () => {
  return (
    <footer className="exact-site-footer">
      <div className="exact-footer-container">
        {/* Left: Branding & Tagline */}
        <div className="exact-footer-brand">
          <a href="#hero" className="exact-footer-logo-link" aria-label="Yuvraj — Return to top">
            <Monogram size={20} className="exact-footer-monogram" title="Yuvraj Monogram" />
            <span className="exact-footer-brand-title">YUVRAJ</span>
          </a>
          <span className="exact-footer-tagline">Build · Code · Create</span>
        </div>

        {/* Center / Nav Links */}
        <nav className="exact-footer-nav" aria-label="Footer Navigation">
          <a href="#hero" className="exact-footer-link">Home</a>
          <a href="#projects" className="exact-footer-link">Projects</a>
          <a href="#about" className="exact-footer-link">About</a>
          <a href="#skills" className="exact-footer-link">Skills</a>
          <a href="#contact" className="exact-footer-link">Contact</a>
        </nav>

        {/* Right: Copyright */}
        <div className="exact-footer-copyright">
          <span className="exact-footer-divider-bar" aria-hidden="true">|</span>
          <span className="exact-copyright-text">© 2026 Yuvraj Meena. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
