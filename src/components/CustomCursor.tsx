import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export const CustomCursor = () => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isEligible, setIsEligible] = useState(false)

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Verify fine-pointer and hover capability on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const checkEligibility = () => {
      setIsEligible(mediaQuery.matches && !prefersReducedMotion)
    }

    checkEligibility()
    mediaQuery.addEventListener('change', checkEligibility)

    return () => {
      mediaQuery.removeEventListener('change', checkEligibility)
    }
  }, [prefersReducedMotion])

  // Execute efficient rAF animation loop and pointer tracking
  useEffect(() => {
    if (!isEligible) return

    document.body.classList.add('custom-cursor-active')

    const mouse = { x: -100, y: -100 }
    const ring = { x: -100, y: -100 }
    let isHovered = false
    let isVisible = false
    let animFrameId: number

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY

      if (!isVisible) {
        isVisible = true
        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }

      // Check if hovering over actual interactive elements
      const target = e.target as HTMLElement | null
      const interactiveEl = target?.closest('a, button, [role="button"], .project-card, .pillar-card, .skill-category-card')
      const nowHovered = Boolean(interactiveEl)

      if (nowHovered !== isHovered) {
        isHovered = nowHovered
        if (ringRef.current) {
          if (isHovered) {
            ringRef.current.classList.add('cursor-ring--hover')
          } else {
            ringRef.current.classList.remove('cursor-ring--hover')
          }
        }
      }

      // Position the precise center dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`
      }
    }

    const onPointerLeave = () => {
      isVisible = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    const onPointerEnter = () => {
      isVisible = true
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }

    // Smooth lerp frame loop for the trailing ring
    const renderLoop = () => {
      // Smooth interpolation factor (0.16)
      ring.x += (mouse.x - ring.x) * 0.16
      ring.y += (mouse.y - ring.y) * 0.16

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }

      animFrameId = requestAnimationFrame(renderLoop)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)
    document.addEventListener('mouseenter', onPointerEnter)
    animFrameId = requestAnimationFrame(renderLoop)

    return () => {
      document.body.classList.remove('custom-cursor-active')
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onPointerLeave)
      document.removeEventListener('mouseenter', onPointerEnter)
      cancelAnimationFrame(animFrameId)
    }
  }, [isEligible])

  if (!isEligible) {
    return null
  }

  return (
    <div className="custom-cursor-root" aria-hidden="true">
      {/* High-precision center dot */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Smoothly damped trailing ring */}
      <div ref={ringRef} className="cursor-ring" />
    </div>
  )
}
