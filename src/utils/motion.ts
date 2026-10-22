import type { Variants, Transition } from 'framer-motion'

export const cinematicEase = [0.16, 1, 0.3, 1] as const

export const smoothTransition: Transition = {
  duration: 0.8,
  ease: cinematicEase,
}

/**
 * Replay viewport configuration:
 * once: false allows animations to trigger on every entry when scrolling up and down.
 * amount: 0.18 provides a stable trigger threshold.
 * margin creates a buffer preventing edge jitter/flickering.
 */
export const replayViewport = {
  once: false,
  amount: 0.18,
  margin: '0px 0px -50px 0px',
}

// Backward-compatible alias for any legacy usage
export const standardViewport = replayViewport

/**
 * Hero entrance container:
 * Staggers children by 0.2s with a 0.15s initial delay on mount.
 * (Preserved without 1s scroll delay so initial hero loads cleanly and responsively).
 */
export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.15,
    },
  },
}

/**
 * Masked typography reveal for the main hero headline.
 * Glides up from behind an overflow-hidden mask over 0.88s.
 */
export const maskedLineVariants: Variants = {
  hidden: {
    y: '110%',
    opacity: 0,
    transition: { duration: 0.2, delay: 0 },
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.88,
      ease: cinematicEase,
    },
  },
}

/**
 * Upward reveal for section headers with 0.5s entrance delay.
 * Resets cleanly to hidden with 0s delay when leaving viewport.
 */
export const sectionHeaderVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    transition: { duration: 0.25, delay: 0 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.82,
      ease: cinematicEase,
      delayChildren: 0.5,
      staggerChildren: 0.12,
    },
  },
}

export const headingRevealVariants = sectionHeaderVariants

/**
 * Standard upward reveal for content blocks with 0.5s entrance delay.
 */
export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    transition: { duration: 0.25, delay: 0 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.78,
      ease: cinematicEase,
    },
  },
}

/**
 * Stagger container for scroll-triggered card grids.
 * Injects a 0.5s delay before the first card begins,
 * then staggers subsequent siblings by 0.16s.
 */
export const scrollStaggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.2, delay: 0 },
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.16,
    },
  },
}

export const staggerContainerVariants = scrollStaggerContainerVariants

/**
 * Directional entrance from the left (x: -46px).
 * When placed inside scrollStaggerContainerVariants, receives the 0.5s delayChildren cleanly.
 */
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -46,
    y: 10,
    transition: { duration: 0.25, delay: 0 },
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.84,
      ease: cinematicEase,
    },
  },
}

/**
 * Standalone directional entrance from the left with built-in 0.5s delay.
 */
export const standaloneSlideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -46,
    y: 10,
    transition: { duration: 0.25, delay: 0 },
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.84,
      ease: cinematicEase,
    },
  },
}

/**
 * Directional entrance from the right (x: +46px).
 */
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 46,
    y: 10,
    transition: { duration: 0.25, delay: 0 },
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.84,
      ease: cinematicEase,
    },
  },
}

/**
 * Card reveal with subtle upward translation (y: 28px).
 * When used inside scrollStaggerContainerVariants, delays are governed by delayChildren: 0.5.
 */
export const cardRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    transition: { duration: 0.25, delay: 0 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.76,
      ease: cinematicEase,
    },
  },
}

/**
 * Calm, deliberate reveal for standalone contact card with 0.5s delay.
 */
export const calmRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    transition: { duration: 0.25, delay: 0 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.88,
      ease: cinematicEase,
    },
  },
}

/**
 * Reduced-motion fallback: completely eliminates motion offsets and delays.
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 1, x: 0, y: 0 },
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0, delay: 0 } },
}
