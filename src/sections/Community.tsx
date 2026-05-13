import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, MapPin, Users, BookOpen, Camera } from 'lucide-react'
import SubmissionForm from '../components/SubmissionForm'

gsap.registerPlugin(ScrollTrigger)

const engagementModes = [
  {
    icon: Camera,
    title: 'Submit a Specimen',
    description: 'Travelling in Asia? Photograph a toilet paper roll from your hotel, supermarket, or street vendor. Note the city, brand, and ply count. Every submission expands the archive.',
    action: 'Opening soon',
    href: null,
  },
  {
    icon: BookOpen,
    title: 'Educational Use',
    description: 'The archive is available for use in design schools and material culture courses. Students analyse specimen data, compare regional differences, and propose new entries.',
    action: 'Opening soon',
    href: null,
  },
  {
    icon: Users,
    title: 'Public Programming',
    description: 'Planned walks and talks examining material culture in everyday Hong Kong — from supermarket aisles to hotel bathrooms. The city as museum.',
    action: 'Planned for 2026',
    href: null,
  },
  {
    icon: MapPin,
    title: 'Field Correspondents',
    description: 'We are building a network of residents across Asia who contribute verified specimens from their local markets. The archive grows through eyes on the ground.',
    action: 'Recruiting soon',
    href: null,
  },
]

export default function Community() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.comm-header', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })
      gsap.from('.comm-card', {
        scrollTrigger: { trigger: '.comm-grid', start: 'top 80%' },
        opacity: 0, y: 40, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      })
      gsap.from('.comm-cities', {
        scrollTrigger: { trigger: '.comm-cities', start: 'top 85%' },
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="community" className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="comm-header mb-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-4">
            Living Archive
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05] mb-6">
            This Grows<br />With You
          </h2>
          <p className="font-body text-sm text-[#888] max-w-lg leading-relaxed">
            The archive is incomplete by design. 43 specimens document what we have found so far. 
            The remaining thousands await discovery — in your hotel, your supermarket, your city.
          </p>
        </div>

        {/* Honest current state */}
        <div className="comm-cities mb-16 pt-8 border-t border-white/[0.04]">
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-2">Current Status</p>
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed">
                43 specimens catalogued. 21 countries covered. The project launched in Hong Kong in early 2026.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-2">What We Need</p>
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed">
                First-hand photographs from Cambodia, Laos, Myanmar, and rural China. Verified product packaging from emerging markets.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-2">What We Offer</p>
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed">
                Full credit for all contributors. A permanent record of your observation in a public cultural archive.
              </p>
            </div>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888] mb-3">Territories Represented</p>
          <div className="flex flex-wrap gap-2">
            {['Hong Kong', 'Tokyo', 'Singapore', 'Bangkok', 'Mumbai', 'Dhaka', 'Jakarta', 'Manila', 'Seoul', 'Taipei', 'Yangon', 'Kathmandu', 'Hanoi', 'Phnom Penh', 'Colombo', 'Karachi', 'Lahore', 'Kuala Lumpur', 'Beijing', 'Ulaanbaatar', 'Vientiane'].map((city) => (
              <span key={city} className="font-body text-[11px] text-[#888] bg-white/[0.05] px-3 py-1 rounded-full">{city}</span>
            ))}
          </div>
        </div>

        {/* Engagement cards */}
        <div className="comm-grid grid sm:grid-cols-2 gap-6">
          {engagementModes.map((mode) => (
            <div key={mode.title} className="comm-card group bg-[#141414] border border-white/[0.04] rounded-xl p-6 sm:p-8 hover:border-white/[0.08] transition-colors">
              <mode.icon className="w-5 h-5 text-[#c28223] mb-5" strokeWidth={1.5} />
              <h3 className="font-display text-lg text-[#f0ece8] mb-3">{mode.title}</h3>
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed mb-6">{mode.description}</p>
              {mode.href ? (
                <a
                  href={mode.href}
                  className="inline-flex items-center gap-2 font-body text-[12px] text-[#c28223] hover:text-[#f0ece8] transition-colors group/link"
                >
                  {mode.action}
                  <span className="w-4 h-px bg-current transition-all group-hover/link:w-6" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 font-body text-[12px] text-[#888]">
                  {mode.action}
                  <span className="w-4 h-px bg-current" />
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Submission Form */}
        <div className="mt-16 pt-16 border-t border-white/[0.04]">
          <div className="mb-8 text-center">
            <p className="font-body text-[15px] text-[#a09890] leading-relaxed max-w-lg mx-auto mb-2">
              This archive exists because one person started looking closely at an ordinary object.
              The next specimen could come from you.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c28223]">
              Open Submission
            </p>
          </div>
          <SubmissionForm />
        </div>
      </div>
    </section>
  )
}
