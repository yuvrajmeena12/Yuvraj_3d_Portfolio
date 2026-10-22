import { useRef, useEffect } from 'react'
import { useAnimationControls, useInView, useReducedMotion } from 'framer-motion'
import type { UseInViewOptions } from 'framer-motion'
import { getScrollDirection } from '../utils/scrollDirection'

interface UseScrollDirectionRevealOptions {
  amount?: UseInViewOptions['amount']
  margin?: UseInViewOptions['margin']
}

/**
 * Hook to trigger directional animations ONLY when scrolling DOWN,
 * while keeping elements immediately in their normal visible state when scrolling UP.
 * When the user scrolls all the way back up, elements below the viewport reset to 'hidden',
 * so that scrolling DOWN again replays their entrance animations.
 */
export function useScrollDirectionReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollDirectionRevealOptions = {}
) {
  const { amount = 0.18, margin = '0px 0px -50px 0px' } = options
  const ref = useRef<T>(null)
  const controls = useAnimationControls()
  const inView = useInView(ref, { amount, margin })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    // If user prefers reduced motion, always keep content fully visible immediately
    if (shouldReduceMotion) {
      controls.set('visible')
      return
    }

    if (inView) {
      const direction = getScrollDirection()
      if (direction === 'down') {
        // Entering on downward scroll: trigger full directional reveal with delay
        controls.start('visible')
      } else {
        // Entering on upward scroll: set directly to final visible state (NO animation, NO delay)
        controls.set('visible')
      }
    } else {
      // Element exited the viewport
      if (ref.current && typeof window !== 'undefined') {
        const rect = ref.current.getBoundingClientRect()
        // If the element exited off the bottom (it is below the viewport):
        // Reset to 'hidden' so it will animate next time the user scrolls down to it!
        if (rect.top >= window.innerHeight - 60) {
          controls.set('hidden')
        }
        // If the element exited off the top (rect.bottom <= 60), it remains 'visible'
        // so scrolling up never leaves content hidden.
      }
    }
  }, [inView, controls, shouldReduceMotion])

  return [ref, controls] as const
}
