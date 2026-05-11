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

    return () => { tl.kill() }
  }, [])

  const handleEnter = useCallback(() => {
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => onEnter(),
    })
  }, [onEnter])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[150] bg-[#080808] flex flex-col items-center justify-center"
      onClick={handleEnter}
    >
      {/* Very subtle warm glow */}
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
          Roll<br />Call
        </h1>

        <div
          ref={lineRef}
          className="w-16 h-px bg-[#c28223]/40 mx-auto mt-10 mb-8 origin-left"
        />

        <p
          ref={subtitleRef}
          className="font-body text-[10px] uppercase tracking-[0.6em] text-[#f0ece8]/25 opacity-0"
        >
          Material culture of contemporary Asia
        </p>
      </div>

      {/* Click hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-100">
        <p className="font-body text-[9px] uppercase tracking-[0.4em] text-white/15">
          Touch anywhere
        </p>
      </div>
    </div>
  )
}
