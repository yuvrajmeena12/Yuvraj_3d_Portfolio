import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { cinematicEase } from '../utils/motion'

// Deterministic Assembly Particles targeting perimeter anchor points
interface ScatterParticle {
  id: number
  targetPanel: 'portrait' | 'narrative'
  originX: number
  originY: number
  targetLeft: string
  targetTop: string
  size: number
  delay: number
}

const HERO_SCATTER_PARTICLES: ScatterParticle[] = [
  // Portrait card perimeter anchors
  { id: 1, targetPanel: 'portrait', originX: -70, originY: -50, targetLeft: '0%', targetTop: '0%', size: 3, delay: 0.10 },
  { id: 2, targetPanel: 'portrait', originX: -60, originY: 60, targetLeft: '0%', targetTop: '100%', size: 3.5, delay: 0.14 },
  { id: 3, targetPanel: 'portrait', originX: 60, originY: -60, targetLeft: '100%', targetTop: '0%', size: 2.5, delay: 0.18 },
  { id: 4, targetPanel: 'portrait', originX: 75, originY: 65, targetLeft: '100%', targetTop: '100%', size: 3, delay: 0.12 },
  { id: 5, targetPanel: 'portrait', originX: 0, originY: -70, targetLeft: '50%', targetTop: '0%', size: 2.5, delay: 0.16 },
  { id: 6, targetPanel: 'portrait', originX: 0, originY: 75, targetLeft: '50%', targetTop: '100%', size: 3, delay: 0.20 },

  // Narrative card perimeter anchors
  { id: 7, targetPanel: 'narrative', originX: 45, originY: -55, targetLeft: '50%', targetTop: '0%', size: 2.5, delay: 0.16 },
  { id: 8, targetPanel: 'narrative', originX: 80, originY: -30, targetLeft: '100%', targetTop: '20%', size: 3, delay: 0.15 },
  { id: 9, targetPanel: 'narrative', originX: 85, originY: 55, targetLeft: '100%', targetTop: '100%', size: 3.5, delay: 0.22 },
  { id: 10, targetPanel: 'narrative', originX: -45, originY: 70, targetLeft: '20%', targetTop: '100%', size: 2.5, delay: 0.24 },
]

const scatterParticleVariants: Variants = {
  hidden: (p: ScatterParticle) => ({
    opacity: 0,
    x: p.originX,
    y: p.originY,
    scale: 0.6,
  }),
  visible: (p: ScatterParticle) => ({
    opacity: [0, 0.95, 0],
    x: [p.originX, p.originX * 0.35, 0],
    y: [p.originY, p.originY * 0.35, 0],
    scale: [0.6, 1.25, 0.2],
    transition: {
      delay: p.delay,
      duration: 0.55,
      ease: cinematicEase,
      times: [0, 0.6, 1],
    },
  }),
}

// ============================================================================
// STAGE F SEQUENTIAL REVEAL QUEUE (Choreographed Timing)
// 1. Subtle background/ambient reveal (0.05s)
// 2. Portrait card enters smoothly (0.15s)
// 3. Developer-role label appears (0.30s)
// 4. Headline reveals with a refined mask transition (0.42s)
// 5. Introductory paragraph fades and moves into place (0.55s)
// 6. Technical stack metadata appears (0.68s)
// 7. "Explore Projects" button appears (0.80s)
// 8. "Get in Touch" button appears last (0.92s)
// ============================================================================

// 1. Ambient Grid Reveal
const ambientGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.05,
      duration: 0.60,
      ease: cinematicEase,
    },
  },
}

// 2. Portrait Card Entrance (Left Column)
const portraitCardVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: 0.15,
      duration: 0.65,
      ease: cinematicEase,
    },
  },
}

const portraitImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.25,
      duration: 0.55,
      ease: cinematicEase,
    },
  },
}

const portraitBadgeVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.35,
      duration: 0.45,
      ease: cinematicEase,
    },
  },
}

// Narrative Panel Shell
const narrativePanelVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 24,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: 0.20,
      duration: 0.65,
      ease: cinematicEase,
    },
  },
}

// 3. Developer-Role Label Entrance
const roleLabelVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.30,
      duration: 0.45,
      ease: cinematicEase,
    },
  },
}

// 4. Headline Masked Reveal
const headlineLineVariants: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      delay: 0.42,
      duration: 0.55,
      ease: cinematicEase,
    },
  },
}

// 5. Introductory Paragraph
const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.55,
      duration: 0.50,
      ease: cinematicEase,
    },
  },
}

// 6. Technical Stack Metadata Taxonomy
const taxonomyVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.68,
      duration: 0.45,
      ease: cinematicEase,
    },
  },
}

// 7. "Explore Projects" CTA (Primary)
const ctaPrimaryVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.80,
      duration: 0.40,
      ease: cinematicEase,
    },
  },
}

// 8. "Get in Touch" CTA (Secondary - Appears Last)
const ctaSecondaryVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.92,
      duration: 0.40,
      ease: cinematicEase,
    },
  },
}

// Reduced Motion Immediate Fallback
const reducedVariants: Variants = {
  hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0, delay: 0 } },
}

export const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion()
  const [useLowPoly, setUseLowPoly] = useState(true)

  const activeAmbient = shouldReduceMotion ? reducedVariants : ambientGridVariants
  const activePortraitCard = shouldReduceMotion ? reducedVariants : portraitCardVariants
  const activePortraitImg = shouldReduceMotion ? reducedVariants : portraitImageVariants
  const activePortraitBadge = shouldReduceMotion ? reducedVariants : portraitBadgeVariants
  const activeNarrative = shouldReduceMotion ? reducedVariants : narrativePanelVariants
  const activeRoleLabel = shouldReduceMotion ? reducedVariants : roleLabelVariants
  const activeHeadline = shouldReduceMotion ? reducedVariants : headlineLineVariants
  const activeSubtitle = shouldReduceMotion ? reducedVariants : subtitleVariants
  const activeTaxonomy = shouldReduceMotion ? reducedVariants : taxonomyVariants
  const activeCtaPrimary = shouldReduceMotion ? reducedVariants : ctaPrimaryVariants
  const activeCtaSecondary = shouldReduceMotion ? reducedVariants : ctaSecondaryVariants

  // Smooth scroll handler accounting for fixed navbar offset
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      e.preventDefault()
      element.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
      window.history.pushState(null, '', `#${targetId}`)
      element.focus({ preventScroll: true })
    }
  }

  return (
    <section id="hero" className="hero-section" aria-label="Introduction">
      <div className="hero-container">
        {/* Step 1: Ambient Grid Reveal */}
        <motion.div
          className="hero-grid"
          variants={activeAmbient}
          initial="hidden"
          animate="visible"
        >
          {/* =================================================================
              LEFT COLUMN: Portrait Card (Aligned top/bottom with right column)
              ================================================================= */}
          <div className="hero-portrait-col">
            <motion.div
              className="hero-portrait-card"
              variants={activePortraitCard}
              initial="hidden"
              animate="visible"
            >
              {/* Scatter-In Particles for Portrait Frame */}
              {!shouldReduceMotion && (
                <div className="hero-scatter-container" aria-hidden="true">
                  {HERO_SCATTER_PARTICLES.filter((p) => p.targetPanel === 'portrait').map((p) => (
                    <motion.span
                      key={p.id}
                      className="hero-scatter-particle"
                      custom={p}
                      variants={scatterParticleVariants}
                      initial="hidden"
                      animate="visible"
                      style={{
                        left: p.targetLeft,
                        top: p.targetTop,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Portrait Image Frame */}
              <div className="hero-portrait-frame">
                <motion.img
                  src={useLowPoly ? '/images/profile-portrait-lowpoly.png' : '/images/profile-portrait.png'}
                  onError={() => setUseLowPoly(false)}
                  alt={useLowPoly ? 'Yuvraj — Geometric Low-Poly Faceted Developer Portrait' : 'Yuvraj — Authentic Developer Portrait'}
                  className="hero-portrait-img"
                  width={340}
                  height={425}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  variants={activePortraitImg}
                  initial="hidden"
                  animate="visible"
                />
                <div className="hero-portrait-overlay" aria-hidden="true" />
              </div>

              {/* Architectural Badge & Caption with Toggle */}
              <motion.div
                variants={activePortraitBadge}
                initial="hidden"
                animate="visible"
                className="hero-portrait-badge"
              >
                <span className="portrait-badge-dot" aria-hidden="true" />
                <div className="portrait-badge-text">
                  <span className="badge-name">YUVRAJ MEENA</span>
                  <span className="badge-role">FULL-STACK &amp; 3D DEVELOPER</span>
                </div>
                <button
                  type="button"
                  className="portrait-style-toggle"
                  onClick={() => setUseLowPoly((prev) => !prev)}
                  title={useLowPoly ? 'Switch to authentic photograph' : 'Switch to geometric low-poly illustration'}
                  aria-label="Toggle between low-poly and original portrait"
                >
                  {useLowPoly ? 'Low-Poly' : 'Photo'}
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* =================================================================
              RIGHT COLUMN: Introduction / Narrative Card
              ================================================================= */}
          <div className="hero-narrative-wrapper">
            <motion.div
              className="hero-narrative-col"
              variants={activeNarrative}
              initial="hidden"
              animate="visible"
            >
              {/* Scatter-In Particles for Narrative Panel */}
              {!shouldReduceMotion && (
                <div className="hero-scatter-container" aria-hidden="true">
                  {HERO_SCATTER_PARTICLES.filter((p) => p.targetPanel === 'narrative').map((p) => (
                    <motion.span
                      key={p.id}
                      className="hero-scatter-particle"
                      custom={p}
                      variants={scatterParticleVariants}
                      initial="hidden"
                      animate="visible"
                      style={{
                        left: p.targetLeft,
                        top: p.targetTop,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="narrative-content-top">
                {/* Step 3: Developer-Role Label */}
                <motion.div
                  variants={activeRoleLabel}
                  initial="hidden"
                  animate="visible"
                  className="hero-status-pill"
                  role="status"
                >
                  <span className="hero-status-dot" aria-hidden="true" />
                  <span>Software Developer // Full-Stack &amp; 3D Web</span>
                </motion.div>

                {/* Step 4: Headline with Refined Mask */}
                <h1 className="hero-title">
                  <span className="reveal-mask">
                    <motion.span
                      className="reveal-line"
                      variants={activeHeadline}
                      initial="hidden"
                      animate="visible"
                    >
                      Hi, I&apos;m <span className="hero-highlight silver-gradient-text">Yuvraj</span>.
                    </motion.span>
                  </span>
                </h1>

                {/* Step 5: Introductory Paragraph */}
                <motion.p
                  variants={activeSubtitle}
                  initial="hidden"
                  animate="visible"
                  className="hero-subtitle"
                >
                  Software engineer crafting resilient full-stack systems, structured backend architectures, and interactive real-time 3D web applications with modern technologies.
                </motion.p>
              </div>

              <div className="narrative-content-bottom">
                {/* Step 6: Technical Stack Metadata */}
                <motion.div
                  variants={activeTaxonomy}
                  initial="hidden"
                  animate="visible"
                  className="hero-meta-taxonomy"
                >
                  <div className="taxonomy-pill">
                    <span className="taxonomy-label">STACK //</span>
                    <span className="taxonomy-value">React 19 · TypeScript · Node.js</span>
                  </div>
                  <div className="taxonomy-pill">
                    <span className="taxonomy-label">3D //</span>
                    <span className="taxonomy-value">Three.js · R3F · WebGL</span>
                  </div>
                  <div className="taxonomy-pill">
                    <span className="taxonomy-label">BASED //</span>
                    <span className="taxonomy-value">Jaipur, India</span>
                  </div>
                </motion.div>

                {/* Step 7 & 8: Sequenced CTA Buttons */}
                <div className="hero-cta-group">
                  {/* Step 7: Explore Projects */}
                  <motion.a
                    href="#projects"
                    onClick={(e) => handleNavClick(e, 'projects')}
                    className="btn btn-primary"
                    variants={activeCtaPrimary}
                    initial="hidden"
                    animate="visible"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    aria-label="Explore Projects section"
                  >
                    Explore Projects
                  </motion.a>

                  {/* Step 8: Get in Touch (Appears Last) */}
                  <motion.a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                    className="btn btn-secondary"
                    variants={activeCtaSecondary}
                    initial="hidden"
                    animate="visible"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    aria-label="Navigate to contact section"
                  >
                    Get in Touch
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Scroll Affordance */}
      <motion.a
        href="#projects"
        onClick={(e) => handleNavClick(e, 'projects')}
        className="scroll-indicator"
        aria-label="Scroll down to projects"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <span className="scroll-mouse" aria-hidden="true">
          <span className="scroll-wheel" />
        </span>
        <span className="scroll-label">Scroll to Explore</span>
      </motion.a>
    </section>
  )
}
