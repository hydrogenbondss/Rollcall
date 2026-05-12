import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let dotX = 0, dotY = 0
    let ringX = 0, ringY = 0
    let dotRaf: number
    let ringRaf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animateDot = () => {
      dotX += (mouseX - dotX) * 0.2
      dotY += (mouseY - dotY) * 0.2
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`
      dotRaf = requestAnimationFrame(animateDot)
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      ringRaf = requestAnimationFrame(animateRing)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    dotRaf = requestAnimationFrame(animateDot)
    ringRaf = requestAnimationFrame(animateRing)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(dotRaf)
      cancelAnimationFrame(ringRaf)
    }
  }, [])

  return (
    <>
      {/* Outer ring — visible on dark backgrounds */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[9998] hidden lg:block mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      {/* Inner dot — bright center */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-white pointer-events-none z-[9999] hidden lg:block"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
