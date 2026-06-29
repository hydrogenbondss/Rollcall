const reasons = [
  { label: 'Language', desc: 'Every market prints it in its own tongue, script, and register.' },
  { label: 'Design', desc: 'Graphic conventions, mascots, and colour shift across each border.' },
  { label: 'Manufacturing', desc: 'Fibre, ply, and process reveal what each economy can produce.' },
  { label: 'Economics', desc: 'Price per roll traces income, taxation, and supply chains.' },
  { label: 'Culture', desc: 'Comfort, hygiene, and status are encoded in an everyday object.' },
]

export default function WhyToiletPaper() {
  return (
    <section id="why" className="w-full bg-[#0d0d0d] py-24 border-t border-white/[0.04]">
      <div className="max-w-[900px] mx-auto px-6 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-5">
          Why toilet paper
        </p>
        <h2 className="font-display text-4xl sm:text-5xl text-[#f0ece8] tracking-tight leading-[1.05] mb-8 max-w-[640px]">
          Not because it&rsquo;s funny. Because it&rsquo;s universal.
        </h2>
        <p className="font-body text-[16px] sm:text-[17px] text-[#a09890] leading-[1.85] max-w-[640px] mb-12">
          Toilet paper is one of the few objects found in almost every household. Despite that
          universality, its packaging reflects differences in language, graphic design,
          manufacturing, economics, and culture across Asia. Roll Call treats these overlooked
          objects as records of everyday life.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {reasons.map((r) => (
            <div key={r.label} className="bg-[#0d0d0d] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c28223] mb-2">
                {r.label}
              </p>
              <p className="font-body text-[12px] text-[#a8a29a] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
