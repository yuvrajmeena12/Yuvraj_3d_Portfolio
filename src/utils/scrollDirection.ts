let scrollDirection: 'down' | 'up' = 'down'
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0

if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY
      if (Math.abs(delta) > 2) {
        scrollDirection = delta > 0 ? 'down' : 'up'
        lastScrollY = currentScrollY
      }
    },
    { passive: true }
  )
}

/**
 * Returns the current active scroll direction ('down' | 'up').
 * Powered by a zero-overhead passive window scroll listener.
 */
export function getScrollDirection(): 'down' | 'up' {
  return scrollDirection
}
