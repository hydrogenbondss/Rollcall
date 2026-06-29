export default function ExhibitionFloorPlan2D() {
  const zones = [
    { id: 'archive', n: 1, label: 'The Archive Wall', x: 12, y: 18, w: 76, h: 12, color: '#c28223' },
    { id: 'living', n: 2, label: 'Living Specimen', x: 39, y: 44, w: 22, h: 18, color: '#c4728e' },
    { id: 'extinction', n: 3, label: 'The Extinction Corner', x: 70, y: 70, w: 18, h: 16, color: '#c85a32' },
    { id: 'submission', n: 4, label: 'Submission Desk', x: 12, y: 72, w: 20, h: 12, color: '#f0ece8' },
    { id: 'entrance', n: 5, label: 'Entrance', x: 45, y: 90, w: 10, h: 6, color: '#555' },
  ]

  return (
    <div className="w-full bg-[#141414] rounded-2xl border border-white/[0.04] p-6 sm:p-8">
      <svg viewBox="0 0 100 100" className="w-full h-auto" style={{ maxHeight: 400 }}>
        {/* Room outline */}
        <rect x="8" y="8" width="84" height="84" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />

        {/* Visitor path: Entrance -> Archive Wall -> Living Specimen -> Extinction Corner */}
        <path
          d="M 50 90 L 50 30 L 50 53 L 79 78"
          fill="none"
          stroke="rgba(194,130,35,0.25)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <circle cx="50" cy="90" r="1.4" fill="#555" />
        <circle cx="79" cy="78" r="1.6" fill="#c85a32" />

        {/* Zones — numbered markers keyed to the legend below */}
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
