import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  headingRevealVariants,
  scrollStaggerContainerVariants,
  slideInRightVariants,
  maskedLineVariants,
  reducedMotionVariants,
  cinematicEase,
} from '../utils/motion'
import { useScrollDirectionReveal } from '../hooks/useScrollDirectionReveal'

interface AssemblyParticle {
  id: number
  x: number
  y: number
  targetX: string
  targetY: string
  size: number
  delay: number
}

const ASSEMBLY_PARTICLES: AssemblyParticle[] = [
  { id: 1, x: -60, y: -45, targetX: '0%', targetY: '0%', size: 3, delay: 0 },
  { id: 2, x: 70, y: -55, targetX: '100%', targetY: '0%', size: 3.5, delay: 0.04 },
  { id: 3, x: -80, y: 55, targetX: '0%', targetY: '100%', size: 3, delay: 0.08 },
  { id: 4, x: 85, y: 65, targetX: '100%', targetY: '100%', size: 3.5, delay: 0.02 },
  { id: 5, x: -50, y: -10, targetX: '0%', targetY: '35%', size: 2.5, delay: 0.06 },
  { id: 6, x: 60, y: 15, targetX: '100%', targetY: '45%', size: 3, delay: 0.1 },
  { id: 7, x: -10, y: -65, targetX: '30%', targetY: '0%', size: 2.5, delay: 0.05 },
  { id: 8, x: 25, y: -60, targetX: '70%', targetY: '0%', size: 3, delay: 0.07 },
  { id: 9, x: -20, y: 70, targetX: '25%', targetY: '100%', size: 3, delay: 0.03 },
  { id: 10, x: 35, y: 75, targetX: '75%', targetY: '100%', size: 2.5, delay: 0.09 },
  { id: 11, x: -75, y: 25, targetX: '0%', targetY: '70%', size: 3, delay: 0.11 },
  { id: 12, x: 75, y: -20, targetX: '100%', targetY: '20%', size: 2.5, delay: 0.04 },
  { id: 13, x: -40, y: -35, targetX: '15%', targetY: '15%', size: 2, delay: 0.08 },
  { id: 14, x: 45, y: -30, targetX: '85%', targetY: '15%', size: 2.5, delay: 0.06 },
  { id: 15, x: -30, y: 50, targetX: '15%', targetY: '85%', size: 3, delay: 0.02 },
  { id: 16, x: 40, y: 45, targetX: '85%', targetY: '85%', size: 2, delay: 0.07 },
]

const particleVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: ASSEMBLY_PARTICLES[i].x,
    y: ASSEMBLY_PARTICLES[i].y,
    scale: 0.6,
    transition: { duration: 0.2, delay: 0 },
  }),
  visible: (i: number) => ({
    opacity: [0, 0.95, 0],
    x: [ASSEMBLY_PARTICLES[i].x, ASSEMBLY_PARTICLES[i].x * 0.3, 0],
    y: [ASSEMBLY_PARTICLES[i].y, ASSEMBLY_PARTICLES[i].y * 0.3, 0],
    scale: [0.6, 1.25, 0.3],
    transition: {
      delay: 0.5 + ASSEMBLY_PARTICLES[i].delay,
      duration: 0.85,
      ease: cinematicEase,
      times: [0, 0.5, 1],
    },
  }),
}

const introBoxVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -36,
    y: 10,
    borderColor: 'rgba(255, 255, 255, 0)',
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    transition: { duration: 0.25, delay: 0 },
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 44px rgba(0, 0, 0, 0.45)',
    transition: {
      delay: 0.5,
      duration: 0.85,
      ease: cinematicEase,
    },
  },
}


const metaVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    transition: { duration: 0.2, delay: 0 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.7,
      duration: 0.78,
      ease: cinematicEase,
    },
  },
}

const bioTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
    transition: { duration: 0.2, delay: 0 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.78,
      duration: 0.78,
      ease: cinematicEase,
    },
  },
}

export const AboutSection = () => {
  const shouldReduceMotion = useReducedMotion()
  const [headerRef, headerControls] = useScrollDirectionReveal<HTMLElement>()
  const [introRef, introControls] = useScrollDirectionReveal<HTMLDivElement>()
  const [pillarsRef, pillarsControls] = useScrollDirectionReveal<HTMLDivElement>()

  const activeHeader = shouldReduceMotion ? reducedMotionVariants : headingRevealVariants
  const activeMaskedLine = shouldReduceMotion ? reducedMotionVariants : maskedLineVariants
  const activeContainer = shouldReduceMotion ? reducedMotionVariants : scrollStaggerContainerVariants
  const activePillar = shouldReduceMotion ? reducedMotionVariants : slideInRightVariants

  const activeIntroBox = shouldReduceMotion ? reducedMotionVariants : introBoxVariants
  const activeMeta = shouldReduceMotion ? reducedMotionVariants : metaVariants
  const activeBio = shouldReduceMotion ? reducedMotionVariants : bioTextVariants

  return (
    <section id="about" className="content-section" aria-label="About Yuvraj">
      <div className="section-container">
        <motion.header
          ref={headerRef}
          className="section-header"
          initial="hidden"
          animate={headerControls}
          variants={activeHeader}
        >
          <span className="section-eyebrow">02 // Background</span>
          <h2 className="section-title">
            <span className="reveal-mask">
              <motion.span className="reveal-line silver-gradient-text" variants={activeMaskedLine}>
                Engineering &amp; Philosophy
              </motion.span>
            </span>
          </h2>
          <p className="section-lead">
            Bridging robust full-stack software architecture with real-time digital craftsmanship.
          </p>
        </motion.header>

        <div className="about-grid">
          {/* Introduction Box with Particle-Assembly entrance, Portrait & Editorial Typography */}
          <motion.div
            ref={introRef}
            className="about-intro-box"
            initial="hidden"
            animate={introControls}
            variants={activeIntroBox}
          >
            {/* Decorative Particle Assembly Layer (hidden after assembly, disabled on reduced motion) */}
            {!shouldReduceMotion && (
              <div className="intro-particles-container" aria-hidden="true">
                {ASSEMBLY_PARTICLES.map((particle, idx) => (
                  <motion.span
                    key={particle.id}
                    className="intro-particle"
                    custom={idx}
                    variants={particleVariants}
                    style={{
                      left: particle.targetX,
                      top: particle.targetY,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Introduction Header: Architectural Statement + Editorial Meta */}
            <div className="about-intro-header">
              <motion.div className="about-statement-mark" variants={activeMeta} aria-hidden="true">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="44" height="44" rx="10" fill="rgba(56, 189, 248, 0.06)" stroke="rgba(56, 189, 248, 0.25)" />
                  <path d="M13 31L22 13L31 31" stroke="#38bdf8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.5 25H27.5" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>

              <motion.div className="about-intro-meta" variants={activeMeta}>
                <span className="about-intro-badge">Architectural Statement</span>
                <h3 className="about-intro-name silver-gradient-text">Engineering with Purpose</h3>
                <span className="about-intro-role">Full-Stack Architecture &amp; Real-Time 3D</span>
                <p className="about-intro-location">
                  <span className="location-dot" aria-hidden="true" />
                  <span>Jaipur, India · Open for Global Roles</span>
                </p>
              </motion.div>
            </div>

            {/* Preserved Narrative Biography */}
            <motion.div className="about-intro-body" variants={activeBio}>
              <p className="about-bio-text">
                I am a software developer driven by the challenge of building useful, dependable applications that solve real-world problems. My development focus spans designing maintainable backend services, modeling structured relational and document databases, and crafting accessible, responsive frontends.
              </p>
              <p className="about-bio-text">
                I treat software engineering as an ongoing discipline of continuous learning. Whether mastering strict type systems in TypeScript, optimizing full-stack data flows, or experimenting with real-time 3D graphics using Three.js and React Three Fiber, I focus on writing clean, purposeful code that delivers a genuine user experience.
              </p>
            </motion.div>
          </motion.div>

          {/* Pillars enter in complementary staggered sequence from right after 0.5s delay when scrolling DOWN */}
          <motion.div
            ref={pillarsRef}
            className="about-pillars"
            initial="hidden"
            animate={pillarsControls}
            variants={activeContainer}
          >
            <motion.div
              className="pillar-card"
              variants={activePillar}
              whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: 0.2 } }}
            >
              <span className="pillar-index">01</span>
              <h3 className="pillar-title">Building Useful Applications</h3>
              <p className="pillar-description">
                Focusing on real user workflows—from collaborative skill exchanges to ordering and management systems—translating requirements into functional software.
              </p>
            </motion.div>

            <motion.div
              className="pillar-card"
              variants={activePillar}
              whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: 0.2 } }}
            >
              <span className="pillar-index">02</span>
              <h3 className="pillar-title">Technical Problem Solving</h3>
              <p className="pillar-description">
                Diagnosing edge cases, structuring predictable state lifecycles, and leveraging TypeScript schemas to eliminate regressions early in development.
              </p>
            </motion.div>

            <motion.div
              className="pillar-card"
              variants={activePillar}
              whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: 0.2 } }}
            >
              <span className="pillar-index">03</span>
              <h3 className="pillar-title">Continuous Learning &amp; 3D Web</h3>
              <p className="pillar-description">
                Actively expanding expertise into real-time WebGL graphics, modern framework ecosystems, and clean architectural patterns with every project built.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
