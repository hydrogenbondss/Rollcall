export default function ExhibitionFloorPlan2D() {
  const zones = [
    { id: 'vitrine', label: 'Vitrine Wall', x: 12, y: 20, w: 76, h: 12, color: '#c28223' },
    { id: 'extinction', label: 'Extinction Corner', x: 70, y: 45, w: 18, h: 18, color: '#c85a32' },
    { id: 'submission', label: 'Submission Desk', x: 12, y: 55, w: 20, h: 12, color: '#f0ece8' },
    { id: 'entrance', label: 'Entrance', x: 45, y: 90, w: 10, h: 6, color: '#555' },
  ]

  return (
    <div className="w-full bg-[#141414] rounded-2xl border border-white/[0.04] p-6 sm:p-8">
      <svg viewBox="0 0 100 100" className="w-full h-auto" style={{ maxHeight: 400 }}>
        {/* Room outline */}
        <rect x="8" y="8" width="84" height="84" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />

        {/* Zones */}
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
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2 + 1.5}
              textAnchor="middle"
              fill={z.color}
              fontSize="3.2"
              fontFamily="monospace"
            >
              {z.label}
            </text>
          </g>
        ))}

        {/* Visitor path */}
        <path
          d="M 50 90 L 50 70 L 30 70 L 30 40 L 70 40 L 70 60"
          fill="none"
          stroke="rgba(194,130,35,0.25)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
        />
        <circle cx="50" cy="90" r="1.5" fill="#c28223" />
        <circle cx="70" cy="60" r="1.5" fill="#c28223" />
      </svg>

      <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-6">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: z.color }} />
            <span className="font-body text-[11px] text-[#888]">{z.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
