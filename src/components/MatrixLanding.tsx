import { useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'

interface MatrixLandingProps {
  onEnter: () => void
}

export default function MatrixLanding({ onEnter }: MatrixLandingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 })

    tl.fromTo(titleRef.current, {
      opacity: 0,
      y: 40,
    }, {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: 'power3.out',
    })
    .fromTo(lineRef.current, {
      scaleX: 0,
    }, {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut',
    }, '-=0.5')
    .fromTo(subtitleRef.current, {
      opacity: 0,
    }, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out',
    }, '-=0.5')
    .fromTo(hintRef.current, {
      opacity: 0,
      y: 10,
    }, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power2.out',
    }, '-=0.5')

    // Pulsing animation for the hint — subtle breathing, never goes too dim
    gsap.to(hintRef.current, {
      opacity: 0.6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 3,
    })

    return () => { tl.kill() }
  }, [])

  const handleEnter = useCallback(() => {
    onEnter()
  }, [onEnter])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#080808' }}
      onClick={handleEnter}
    >
      {/* Subtle warm glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(194,130,35,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative text-center px-8">
        <h1
          ref={titleRef}
          className="font-display text-[18vw] sm:text-[14vw] md:text-[11vw] text-[#f0ece8] tracking-tighter leading-[0.82] uppercase opacity-0"
          style={{ letterSpacing: '-0.04em' }}
        >
          ROLL<br />CALL
        </h1>

        <div
          ref={lineRef}
          className="w-16 h-px bg-[#c28223]/40 mx-auto mt-10 mb-8 origin-left"
        />

        <p
          ref={subtitleRef}
          className="font-body text-[10px] uppercase tracking-[0.6em] text-[#f0ece8]/50 opacity-0"
        >
          Material culture of contemporary Asia
        </p>
      </div>

      {/* Click hint — prominent and animated */}
      <div ref={hintRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 opacity-0">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-[#c28223] rounded-full animate-bounce" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ccc]">
            Click to enter
          </p>
        </div>
      </div>
    </div>
  )
}
