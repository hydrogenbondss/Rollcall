import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router'

// CSS-only page fade (no gsap on the critical path). The first render paints
// immediately with no animation class so first contentful paint isn't delayed;
// subsequent navigations replay the fade via the remount key.
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isFirst = useRef(true)
  const cls = isFirst.current ? undefined : 'page-fade'

  useEffect(() => { isFirst.current = false }, [])

  return (
    <div key={location.pathname} className={cls}>
      {children}
    </div>
  )
}
