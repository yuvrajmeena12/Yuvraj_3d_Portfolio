import { useEffect, useRef } from 'react'

/**
 * Hook to track normalized window scroll progress (0.0 to 1.0)
 * directly in a mutable ref, preventing React component re-renders
 * during frame-by-frame 3D updates.
 */
export function useScrollProgress(): React.RefObject<number> {
  const progressRef = useRef<number>(0)

  useEffect(() => {
    let ticking = false

    const updateScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        const rawProgress = window.scrollY / scrollHeight
        progressRef.current = Math.min(Math.max(rawProgress, 0), 1)
      } else {
        progressRef.current = 0
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return progressRef
}
