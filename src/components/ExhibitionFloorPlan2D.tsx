export default function ExhibitionFloorPlan2D() {
  // The exhibition is three parts. The entrance is shown for orientation only
  // (it's where visitors arrive, not a part of the work).
  const zones = [
    { id: 'archive', n: 1, label: 'The Archive Wall', x: 12, y: 18, w: 76, h: 12, color: '#c28223' },
    { id: 'living', n: 2, label: 'The Living Specimen', x: 39, y: 43, w: 22, h: 18, color: '#c4728e' },
    { id: 'extinction', n: 3, label: 'The Extinction Corner', x: 64, y: 70, w: 24, h: 14, color: '#c85a32' },
  ]
  const entrance = { x: 50, y: 90 }

  return (
    <div className="w-full bg-[#141414] rounded-2xl border border-white/[0.04] p-6 sm:p-8">
      <svg viewBox="0 0 100 100" className="w-full h-auto" style={{ maxHeight: 400 }}>
        {/* Room outline */}
        <rect x="8" y="8" width="84" height="84" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />

        {/* Visitor path: Entrance -> Archive Wall -> Living Specimen -> Extinction Corner */}
        <path
          d="M 50 90 L 50 30 L 50 52 L 76 77"
          fill="none"
          stroke="rgba(194,130,35,0.25)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />

        {/* Entrance — orientation marker, unnumbered */}
        <circle cx={entrance.x} cy={entrance.y} r="1.4" fill="#555" />
        <text x={entrance.x} y={entrance.y + 4} textAnchor="middle" fill="#6b6b6b" fontSize="2.6" fontFamily="monospace" letterSpacing="0.3">ENTRANCE</text>

        {/* The three parts — numbered markers keyed to the legend below */}
        {zones.map((z) => (
          <g key={z.id}>
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              fill={`${z.color}12`}
              stroke={z.color}
              strokeWidth="0.3"
              rx="1"
            />
            <circle cx={z.x + z.w / 2} cy={z.y + z.h / 2} r="3.4" fill="#0d0d0d" stroke={z.color} strokeWidth="0.3" />
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2 + 1.6}
              textAnchor="middle"
              fill={z.color}
              fontSize="4"
              fontWeight="bold"
              fontFamily="monospace"
            >
              {z.n}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ color: z.color, border: `1px solid ${z.color}` }}>{z.n}</span>
            <span className="font-body text-[11px] text-[#a8a29a]">{z.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
