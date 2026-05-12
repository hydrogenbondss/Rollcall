import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    let mouseX = 0, mouseY = 0
    let currentX = 0, currentY = 0
    let raf: number
    let hideTimeout: ReturnType<typeof setTimeout>

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.opacity = '1'

      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => {
        dot.style.opacity = '0'
      }, 2000)
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.18
      currentY += (mouseY - currentY) * 0.18
      dot.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      clearTimeout(hideTimeout)
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#f0ece8]/70 pointer-events-none z-[9999] hidden lg:block"
      style={{
        willChange: 'transform',
        transition: 'opacity 0.3s ease',
      }}
    />
  )
}
