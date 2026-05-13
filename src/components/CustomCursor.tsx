import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    let mouseX = 0, mouseY = 0
    let currentX = 0, currentY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.15
      currentY += (mouseY - currentY) * 0.15
      dot.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-3 h-3 rounded-full bg-white/80 pointer-events-none z-[9999] hidden lg:block"
      style={{
        willChange: 'transform',
        mixBlendMode: 'difference',
      }}
    />
  )
}
