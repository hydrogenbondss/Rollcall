import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

type CursorMode = 'default' | 'link' | 'view' | 'text'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<CursorMode>('default')
  const [label, setLabel] = useState('')

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    let mouseX = 0, mouseY = 0
    let isHidden = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (isHidden) { isHidden = false; gsap.to([cursor, dot], { opacity: 1, duration: 0.2 }) }
    }

    const onLeave = () => { isHidden = true; gsap.to([cursor, dot], { opacity: 0, duration: 0.2 }) }
    const onEnter = () => { if (isHidden) { isHidden = false; gsap.to([cursor, dot], { opacity: 1, duration: 0.2 }) } }

    const detectMode = (target: Element): CursorMode => {
      if (target.closest('a, button, [role="button"], input, select, textarea, [data-cursor="link"]')) return 'link'
      if (target.closest('[data-cursor="view"]')) return 'view'
      if (target.closest('p, h1, h2, h3, h4, h5, h6, span, .essay-para')) return 'text'
      return 'default'
    }

    const getLabel = (target: Element): string => {
      const viewEl = target.closest('[data-cursor="view"]') as HTMLElement | null
      if (viewEl?.dataset.cursorLabel) return viewEl.dataset.cursorLabel
      if (target.closest('a, button, [role="button"]')) return ''
      return ''
    }

    const onOver = (e: MouseEvent) => {
      const newMode = detectMode(e.target as Element)
      const newLabel = getLabel(e.target as Element)
      setMode(newMode)
      setLabel(newLabel)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver)

    let raf: number
    const pos = { x: 0, y: 0 }
    const dotPos = { x: 0, y: 0 }

    const animate = () => {
      pos.x += (mouseX - pos.x) * 0.12
      pos.y += (mouseY - pos.y) * 0.12
      cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`

      dotPos.x += (mouseX - dotPos.x) * 0.25
      dotPos.y += (mouseY - dotPos.y) * 0.25
      dot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%, -50%)`

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Animate cursor size based on mode
  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    switch (mode) {
      case 'link':
        gsap.to(cursor, { width: 48, height: 48, borderColor: 'rgba(240,236,232,0.5)', duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { scale: 0.4, duration: 0.3, ease: 'power2.out' })
        break
      case 'view':
        gsap.to(cursor, { width: 80, height: 80, borderColor: 'rgba(240,236,232,0.4)', duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { scale: 0, duration: 0.3, ease: 'power2.out' })
        break
      case 'text':
        gsap.to(cursor, { width: 2, height: 28, borderRadius: 1, borderColor: 'rgba(240,236,232,0.6)', duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { scale: 0, duration: 0.3, ease: 'power2.out' })
        break
      default:
        gsap.to(cursor, { width: 32, height: 32, borderRadius: '50%', borderColor: 'rgba(240,236,232,0.35)', duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }
  }, [mode])

  useEffect(() => {
    const labelEl = labelRef.current
    if (!labelEl) return
    if (label) {
      gsap.to(labelEl, { opacity: 1, scale: 1, duration: 0.2 })
    } else {
      gsap.to(labelEl, { opacity: 0, scale: 0.8, duration: 0.2 })
    }
  }, [label])

  return (
    <>
      {/* Main ring cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          border: '1px solid rgba(240,236,232,0.35)',
          borderRadius: '50%',
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      >
        <span
          ref={labelRef}
          className="font-body text-[8px] uppercase tracking-wider text-white/90 opacity-0"
        >
          {label}
        </span>
      </div>
      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#f0ece8]/50 pointer-events-none z-[9999] hidden lg:block"
        style={{ willChange: 'transform' }}
      />
      <style>{`
        @media (min-width: 1024px) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  )
}
