import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'

// CSS-only page fade (no gsap on the critical path). The first paint has no
// animation class (so first contentful paint isn't delayed); once the visitor
// navigates, the fade replays on each route change via the remount key.
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isFirst = useRef(true)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    if (!animate) setAnimate(true)
  }, [location.pathname, animate])

  return (
    <div key={location.pathname} className={animate ? 'page-fade' : undefined}>
      {children}
    </div>
  )
}
