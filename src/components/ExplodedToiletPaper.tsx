import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Layer {
  num: string
  label: string
  material: string
  color: string
  width: number
  desc: string
  glow: string
}

const layers: Layer[] = [
  { num: '01', label: '4-PLY', material: 'Virgin Pulp + Lotion', color: '#00ff9d', width: 260, desc: 'Embossed quilt · Premium markets', glow: 'rgba(0,255,157,0.15)' },
  { num: '02', label: '3-PLY', material: 'Bamboo Fiber', color: '#00d4ff', width: 240, desc: 'Naturally antimicrobial · East Asia', glow: 'rgba(0,212,255,0.15)' },
  { num: '03', label: '2-PLY', material: 'Recycled Fiber', color: '#a78bfa', width: 220, desc: 'Eco-conscious · Global standard', glow: 'rgba(167,139,250,0.15)' },
  { num: '04', label: '1-PLY', material: 'Wood Pulp', color: '#fbbf24', width: 200, desc: 'Budget · Fast-dissolving', glow: 'rgba(251,191,36,0.15)' },
]

const coreTube = { num: '05', label: 'CORE', material: 'Cardboard Tube', color: '#c4a97d', width: 80, desc: 'Post-consumer recycled' }

export default function ExplodedToiletPaper() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Layers slide in from center
      gsap.fromTo('.tp-layer-ellipse',
        { opacity: 0, scaleX: 0.2 },
        {
          opacity: 1, scaleX: 1,
          duration: 0.7, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )

      // Number callouts
      gsap.fromTo('.tp-num-badge',
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.5, stagger: 0.08, delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )

      // Right-side labels
      gsap.fromTo('.tp-label-bar',
        { opacity: 0, x: 20 },
        {
          opacity: 1, x: 0,
          duration: 0.5, stagger: 0.08, delay: 0.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )

      // Connecting lines draw
      gsap.fromTo('.tp-conn-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.4, stagger: 0.08, delay: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )

      // Core tube
      gsap.fromTo('.tp-core-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="relative select-none overflow-hidden rounded-2xl border border-white/[0.04] bg-[#0a0a0a]/60">
      {/* Matrix grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,157,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-[#00ff9d]/15 pointer-events-none" />
      <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-[#00ff9d]/15 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-[#00ff9d]/15 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-[#00ff9d]/15 pointer-events-none" />

      <div className="flex flex-col items-center py-10 px-4 relative">
        {/* Section title */}
        <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-[#00ff9d]/40 mb-8">
          Exploded Cross-Section
        </p>

        {/* Main diagram - horizontal layout */}
        <div className="flex items-center gap-0 w-full max-w-[700px]">
          {/* Left: Number column */}
          <div className="flex flex-col items-end gap-6 pr-3 shrink-0">
            {layers.map((layer, i) => (
              <div
                key={layer.num}
                className="tp-num-badge flex items-center justify-center w-7 h-7 rounded border font-mono text-[9px] font-bold tracking-wider transition-all duration-300"
                style={{
                  borderColor: activeIdx === i ? layer.color : `${layer.color}40`,
                  color: activeIdx === i ? layer.color : `${layer.color}99`,
                  backgroundColor: activeIdx === i ? `${layer.color}15` : `${layer.color}08`,
                  marginTop: i === 0 ? 0 : 0,
                  marginBottom: i === layers.length - 1 ? 0 : 0,
                }}
              >
                {layer.num}
              </div>
            ))}
            <div
              className="tp-num-badge flex items-center justify-center w-7 h-7 rounded border font-mono text-[9px] font-bold tracking-wider"
              style={{
                borderColor: `${coreTube.color}40`,
                color: `${coreTube.color}99`,
                backgroundColor: `${coreTube.color}08`,
              }}
            >
              {coreTube.num}
            </div>
          </div>

          {/* Center: Connecting lines + Ellipses */}
          <div className="flex flex-col items-center gap-6 shrink-0">
            {layers.map((layer, i) => (
              <div key={i} className="flex items-center gap-0">
                {/* Left connecting line */}
                <div
                  className="tp-conn-line h-px w-4 origin-right"
                  style={{ backgroundColor: `${layer.color}30` }}
                />
                {/* Ellipse */}
                <div
                  className="tp-layer-ellipse relative cursor-pointer transition-all duration-300"
                  style={{ width: `${layer.width * 0.55}px`, height: '32px' }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  <div
                    className="absolute inset-0 rounded-[50%] border transition-all duration-300"
                    style={{
                      borderColor: activeIdx === i ? layer.color : `${layer.color}50`,
                      backgroundColor: activeIdx === i ? `${layer.color}12` : `${layer.color}06`,
                      boxShadow: activeIdx === i
                        ? `0 0 20px ${layer.glow}, inset 0 0 10px ${layer.glow}`
                        : `0 2px 8px rgba(0,0,0,0.4)`,
                    }}
                  />
                  {/* Fiber texture overlay */}
                  <div className="absolute inset-0 rounded-[50%] opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, ${layer.color}12 2px, ${layer.color}12 3px)`,
                    }}
                  />
                  {/* Label inside ellipse */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className="font-mono text-[8px] font-bold tracking-[0.2em] transition-colors"
                      style={{ color: activeIdx === i ? layer.color : `${layer.color}aa` }}
                    >
                      {layer.label}
                    </span>
                  </div>
                </div>
                {/* Right connecting line */}
                <div
                  className="tp-conn-line h-px w-4 origin-left"
                  style={{ backgroundColor: `${layer.color}30` }}
                />
              </div>
            ))}

            {/* Core tube */}
            <div className="tp-core-item flex items-center gap-0">
              <div className="h-px w-4" style={{ backgroundColor: `${coreTube.color}30` }} />
              <div
                className="relative"
                style={{ width: `${coreTube.width * 0.55}px`, height: '28px' }}
              >
                <div
                  className="absolute inset-0 rounded-[50%] border"
                  style={{
                    borderColor: `${coreTube.color}50`,
                    backgroundColor: `${coreTube.color}10`,
                    backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 3px, ${coreTube.color}08 3px, ${coreTube.color}08 5px)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[7px] font-bold tracking-wider text-[#c4a97d]/60">{coreTube.label}</span>
                </div>
              </div>
              <div className="h-px w-4" style={{ backgroundColor: `${coreTube.color}30` }} />
            </div>
          </div>

          {/* Right: Label bars */}
          <div className="flex flex-col gap-6 pl-3 flex-1 min-w-0">
            {layers.map((layer, i) => (
              <div
                key={i}
                className={`tp-label-bar transition-all duration-300 ${activeIdx === i ? 'opacity-100' : 'opacity-70'}`}
              >
                <div className="flex items-center gap-2">
                  {/* Colored accent bar */}
                  <div
                    className="w-1 h-8 rounded-full shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: activeIdx === i ? layer.color : `${layer.color}50`,
                      boxShadow: activeIdx === i ? `0 0 8px ${layer.glow}` : 'none',
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-body text-[11px] text-[#f0ece8] truncate">{layer.material}</p>
                    <p className="font-mono text-[8px] truncate" style={{ color: `${layer.color}90` }}>{layer.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="tp-label-bar opacity-70">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: `${coreTube.color}50` }} />
                <div>
                  <p className="font-body text-[11px] text-[#f0ece8]">{coreTube.material}</p>
                  <p className="font-mono text-[8px] text-[#c4a97d]/60">{coreTube.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Spec note */}
        <div className="mt-8 px-4 py-2 bg-[#141414]/50 rounded-lg border border-white/[0.03]">
          <p className="font-mono text-[8px] text-[#555] uppercase tracking-wider text-center">
            Not to scale · Specimen: RC-EA-JP-26-4-01 · Nepia Premium Soft
          </p>
        </div>
      </div>
    </div>
  )
}
