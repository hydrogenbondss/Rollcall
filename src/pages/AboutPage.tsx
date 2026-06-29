import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, FileText } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectStatement from '../sections/ProjectStatement'
import WhyToiletPaper from '../sections/WhyToiletPaper'
import WorldMap from '../sections/WorldMap'
import DataVisualization from '../sections/DataVisualization'
import Methodology from '../sections/Methodology'
import Community from '../sections/Community'
import Footer from '../sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.about-section').forEach((section) => {
        gsap.fromTo(section.querySelectorAll('.about-item'),
          { opacity: 0, y: 30 },
          {
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          }
        )
      })
    }, page)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d]" ref={pageRef}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-[#a8a29a] group-hover:text-[#f0ece8] transition-colors" />
            <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#f0ece8]">Roll Call</span>
          </Link>
          <span className="font-mono text-[10px] text-[#a8a29a] uppercase tracking-wider hidden sm:block">About</span>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-32 pb-12 px-6 sm:px-8 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-4 h-4 text-[#c4728e]" strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-[#f0ece8] mb-4">About</h1>
        <p className="font-body text-sm text-[#a8a29a] max-w-lg leading-relaxed">
          The story behind the archive. How it was built, what the data reveals, and how you can contribute.
        </p>
      </header>

      <ProjectStatement />
      <WhyToiletPaper />

      {/* Bio strip */}
      <section className="about-section max-w-[800px] mx-auto px-6 sm:px-8 py-20 border-t border-white/[0.04]">
        <div className="about-item">
          <h2 className="font-display text-2xl text-[#f0ece8] mb-4">About the Creator</h2>
          <p className="font-body text-[14px] text-[#a09890] leading-relaxed mb-4">
            Jeffrey Nicholas Tse is a Hong Kong-based interdisciplinary artist and researcher whose work examines systems of preservation, mediated identity, and cultural memory. Moving across archival practice, digital interfaces, writing, and interactive media, his projects investigate how value is assigned through classification, repetition, and observation.
          </p>
          <p className="font-body text-[14px] text-[#a09890] leading-relaxed">
            His work often focuses on traces of human presence embedded within images, objects, and systems designed to outlast their original moment of use.
          </p>
        </div>
      </section>

      <DataVisualization />
      <WorldMap />
      <Methodology />
      <Community />
      <Footer />
    </div>
  )
}
