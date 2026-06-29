import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { specimenCount, countryCount } from '../data/stats'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollUnroll() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Pin the section during scroll
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress
          setProgress(self.progress)
        },
      })

      gsap.fromTo(section.querySelectorAll('.unroll-item'),
        { opacity: 0, y: 20 },
        { scrollTrigger: { trigger: section, start: 'top 60%' },
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  // Calculate paper path based on scroll progress (0-1)
  const paperLength = 600
  const unrolledLength = progress * paperLength
  const rollAngle = progress * 720 // 2 full rotations
  const wave = Math.sin(progress * Math.PI * 4) * 3

  return (
    <section ref={sectionRef} className="min-h-screen bg-[#0d0d0d] relative overflow-hidden flex items-center justify-center">
      {/* Background text that appears as paper unrolls */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: Math.min(1, progress * 3) }}
      >
        <div className="text-center max-w-xl px-8">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223] mb-4 transition-all duration-300"
            style={{ opacity: progress > 0.3 ? 1 : 0, transform: `translateY(${(1 - Math.min(1, (progress - 0.3) * 3)) * 20}px)` }}
          >
            Material Culture Archive
          </p>
          <h2
            className="font-display text-5xl sm:text-6xl text-[#f0ece8]/5 leading-[0.9] mb-6 transition-all duration-300"
            style={{ opacity: progress > 0.4 ? 1 : 0, transform: `translateY(${(1 - Math.min(1, (progress - 0.4) * 3)) * 20}px)` }}
          >
            Every roll<br />tells a story
          </h2>
          <p
            className="font-body text-sm text-[#f0ece8]/30 leading-relaxed transition-all duration-300"
            style={{ opacity: progress > 0.5 ? 1 : 0, transform: `translateY(${(1 - Math.min(1, (progress - 0.5) * 3)) * 20}px)` }}
          >
            Scroll to unfurl the archive. {specimenCount} specimens. {countryCount} countries. One object that everyone uses but no one documents.
          </p>
        </div>
      </div>

      {/* Paper unroll SVG */}
      <div className="relative w-full max-w-4xl mx-auto px-8">
        <svg
          viewBox="0 0 800 300"
          className="w-full h-auto"
          style={{ opacity: 1 - progress * 0.3 }}
        >
          <defs>
            {/* Paper texture gradient */}
            <linearGradient id="paperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0ece8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e0d8cc" stopOpacity="0.9" />
            </linearGradient>
            {/* Shadow for depth */}
            <filter id="paperShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
            {/* Fiber pattern */}
            <pattern id="fiber" x="0" y="0" width="8" height="4" patternUnits="userSpaceOnUse">
              <line x1="0" y1="2" x2="8" y2="2" stroke="#d0c8b8" strokeWidth="0.3" opacity="0.3" />
            </pattern>
          </defs>

          {/* The roll (left side) */}
          <g transform={`translate(${150 + unrolledLength * 0.6}, 150)`}>
            {/* Roll shadow */}
            <ellipse cx="0" cy="8" rx="42" ry="42" fill="#0a0a0a" opacity="0.3" />
            
            {/* Main roll */}
            <circle r="40" fill="url(#paperGrad)" filter="url(#paperShadow)" />
            
            {/* Roll layers (concentric circles) */}
            <circle r="32" fill="none" stroke="#d8d0c4" strokeWidth="0.5" opacity="0.4" />
            <circle r="24" fill="none" stroke="#d8d0c4" strokeWidth="0.5" opacity="0.4" />
            <circle r="16" fill="none" stroke="#d8d0c4" strokeWidth="0.5" opacity="0.4" />
            
            {/* Inner tube */}
            <circle r="10" fill="#c4a97d" />
            <circle r="8" fill="#b8a070" opacity="0.5" />
            
            {/* Rotation marker */}
            <line
              x1="0" y1="0" x2="0" y2="-35"
              stroke="#c28223"
              strokeWidth="1.5"
              opacity="0.4"
              transform={`rotate(${rollAngle})`}
            />
          </g>

          {/* The unrolling paper sheet */}
          {progress > 0.01 && (
            <g>
              {/* Paper path with slight wave */}
              <path
                d={`
                  M ${150 + unrolledLength * 0.6 + 38}, ${150 - 38}
                  Q ${150 + unrolledLength * 0.4 + 38}, ${150 - 38 + wave} 
                    ${150 + 40}, ${150 - 35 + wave * 0.5}
                  L ${150 + 40}, ${150 + 35 + wave * 0.5}
                  Q ${150 + unrolledLength * 0.4 + 38}, ${150 + 38 + wave}
                    ${150 + unrolledLength * 0.6 + 38}, ${150 + 38}
                  Z
                `}
                fill="url(#paperGrad)"
                filter="url(#paperShadow)"
              />
              
              {/* Fiber texture overlay on unrolled portion */}
              <path
                d={`
                  M ${150 + unrolledLength * 0.6 + 38}, ${150 - 38}
                  Q ${150 + unrolledLength * 0.4 + 38}, ${150 - 38 + wave} 
                    ${150 + 40}, ${150 - 35 + wave * 0.5}
                  L ${150 + 40}, ${150 + 35 + wave * 0.5}
                  Q ${150 + unrolledLength * 0.4 + 38}, ${150 + 38 + wave}
                    ${150 + unrolledLength * 0.6 + 38}, ${150 + 38}
                  Z
                `}
                fill="url(#fiber)"
                opacity="0.3"
              />

              {/* Quilted pattern on unrolled paper */}
              <g opacity={Math.min(1, progress * 2)}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={150 + unrolledLength * 0.3 + i * 40}
                    cy={150 + Math.sin(i * 0.8) * 5}
                    r="3"
                    fill="none"
                    stroke="#c28223"
                    strokeWidth="0.5"
                    opacity="0.15"
                  />
                ))}
              </g>
            </g>
          )}

          {/* Specimen dots appearing along the paper */}
          {progress > 0.2 && Array.from({ length: 8 }).map((_, i) => {
            const dotProgress = Math.min(1, Math.max(0, (progress - 0.2 - i * 0.08) * 5))
            if (dotProgress <= 0) return null
            return (
              <g key={i} opacity={dotProgress}>
                <circle
                  cx={150 + unrolledLength * 0.5 - i * 45}
                  cy={150}
                  r="6"
                  fill={['#c28223', '#c4728e', '#c85a32', '#228b68', '#8b7ec8'][i % 5]}
                  opacity="0.6"
                />
                <text
                  x={150 + unrolledLength * 0.5 - i * 45}
                  y={150 - 12}
                  textAnchor="middle"
                  className="font-mono"
                  fill="#888"
                  fontSize="8"
                  opacity="0.7"
                >
                  {String(i + 1).padStart(2, '0')}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="w-32 h-1 bg-[#141414] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c28223] rounded-full transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="font-mono text-[9px] text-[#888] uppercase tracking-wider">
          {progress < 0.95 ? 'Keep scrolling' : 'Archive unfurled'}
        </p>
      </div>

      {/* Corner stats that appear */}
      <div
        className="absolute top-20 right-8 text-right transition-all duration-500"
        style={{ opacity: progress > 0.6 ? 1 : 0 }}
      >
        <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider mb-1">Specimens unfurled</p>
        <p className="font-display text-3xl text-[#c28223]">{Math.round(progress * specimenCount)}<span className="text-[#888] text-lg">/{specimenCount}</span></p>
      </div>
    </section>
  )
}
