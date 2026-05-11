import { useState, useRef, useEffect, type ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

export function MagneticButton({ children, className = '', strength = 0.3, onClick }: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.sqrt(distX * distX + distY * distY)
      const maxDist = 100

      if (distance < maxDist) {
        const factor = (1 - distance / maxDist) * strength
        setPosition({ x: distX * factor, y: distY * factor })
      } else {
        setPosition({ x: 0, y: 0 })
      }
    }

    const handleLeave = () => setPosition({ x: 0, y: 0 })

    window.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={className}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </button>
  )
}
