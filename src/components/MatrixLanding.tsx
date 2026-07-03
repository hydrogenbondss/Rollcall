import { useCallback, useEffect, useState } from 'react'

interface MatrixLandingProps {
  onEnter: () => void
}

interface RollEntry {
  id: string
  brand: string
}

// Landing gate. Reveal is pure CSS (see .ml-* in index.css) so the entry
// bundle ships no animation library on first paint.
export default function MatrixLanding({ onEnter }: MatrixLandingProps) {
  // The roll call: the archive takes attendance, one specimen at a time.
  // Data is loaded via dynamic import AFTER first paint so the landing keeps
  // its minimal critical bundle; if the import fails, the line simply stays
  // empty (fixed height, no layout shift).
  const [roll, setRoll] = useState<RollEntry[]>([])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setInterval> | undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    Promise.all([import('../data/products'), import('../data/accession')])
      .then(([p, a]) => {
        if (cancelled) return
        const entries = p.products.map((prod) => ({ id: a.accessionId(prod.id), brand: prod.brand }))
        setRoll(entries)
        if (!reduced && entries.length > 1) {
          timer = setInterval(() => setTick((n) => (n + 1) % entries.length), 2400)
        }
      })
      .catch(() => {})
    return () => { cancelled = true; if (timer) clearInterval(timer) }
  }, [])

  const current = roll.length ? roll[tick] : null

  const handleEnter = useCallback(() => {
    onEnter()
  }, [onEnter])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Enter Roll Call"
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center focus:outline-none"
      style={{ backgroundColor: '#080808' }}
      onClick={handleEnter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEnter() }
      }}
    >
      {/* Subtle warm glow */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(194,130,35,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="relative text-center px-8">
        <h1
          className="ml-title font-display text-[18vw] sm:text-[14vw] md:text-[11vw] text-[#f0ece8] tracking-tighter leading-[0.82] uppercase"
          style={{ letterSpacing: '-0.04em' }}
        >
          ROLL<br />CALL
        </h1>

        <div className="ml-line w-16 h-px bg-[#c28223]/40 mx-auto mt-10 mb-8" />

        <p className="ml-sub font-body text-[10px] uppercase tracking-[0.6em] text-[#f0ece8]/50">
          Material culture of contemporary Asia
        </p>

        {/* The roll call — attendance, one specimen at a time */}
        <div className="h-5 mt-7" aria-hidden="true">
          {current && (
            <p
              key={current.id}
              className="ml-tick font-mono text-[10px] uppercase tracking-[0.3em] text-[#f0ece8]/35"
            >
              {current.id} · {current.brand} — <span className="text-[#c28223]/75">present</span>
            </p>
          )}
        </div>
      </div>

      {/* Click hint */}
      <div className="ml-hint absolute bottom-16 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-[#c28223] rounded-full" />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ccc]">
            Click to enter
          </p>
        </div>
      </div>
    </div>
  )
}
