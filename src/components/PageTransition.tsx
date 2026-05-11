import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { gsap } from 'gsap'

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const el = containerRef.current
    if (!el) return

    // Fade in
    gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
  }, [location.pathname])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}
