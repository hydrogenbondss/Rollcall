import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import MatrixLanding from '../components/MatrixLanding'
import Navigation from '../components/Navigation'
import ProjectStatement from '../sections/ProjectStatement'
import Collection from '../sections/Collection'
import Regions from '../sections/Regions'
import WorldMap from '../sections/WorldMap'
import DidYouKnow from '../sections/DidYouKnow'
import DataVisualization from '../sections/DataVisualization'
import Stories from '../sections/Stories'
import Methodology from '../sections/Methodology'
import Community from '../sections/Community'
import ExtinctSpecimens from '../sections/ExtinctSpecimens'
import Exhibition from '../sections/Exhibition'
import Footer from '../sections/Footer'
import { products } from '../data/products'
import { useNavigate } from 'react-router'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Home() {
  const [entered, setEntered] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('rollcall-entered') === 'true'
    }
    return false
  })
  const heroRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleEnter = () => {
    sessionStorage.setItem('rollcall-entered', 'true')
    setEntered(true)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const key = e.key.toLowerCase()
      if (key === 'r') {
        const random = products[Math.floor(Math.random() * products.length)]
        navigate(`/product/${random.id}`)
      }
      if (key === 'c') {
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
      }
      if (key === 'm') {
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })
      }
      if (key === 'd') {
        document.getElementById('data')?.scrollIntoView({ behavior: 'smooth' })
      }
      if (key === 'e') {
        document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  useEffect(() => {
    if (!entered) return

    const reduced = prefersReducedMotion()

    const lenis = new Lenis({
      duration: reduced ? 0.1 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Scroll velocity skew
    let currentSkew = 0
    const content = document.querySelector('.main-content')
    if (content && !reduced) {
      lenis.on('scroll', ({ velocity }: { velocity: number }) => {
        const targetSkew = Math.max(-2, Math.min(2, velocity * 0.02))
        currentSkew += (targetSkew - currentSkew) * 0.1
        gsap.to(content, { skewY: currentSkew, duration: 0.1, ease: 'none' })
      })
    }

    const ctx = gsap.context(() => {
      if (reduced) return

      const heroTitle = document.querySelector('.hero-title')
      if (heroTitle) {
        const text = heroTitle.textContent || ''
        heroTitle.innerHTML = text.split('').map((char, i) =>
          char === ' ' ? ' ' : `<span class="char-${i}" style="display:inline-block;opacity:0;transform:translateY(60px)">${char}</span>`
        ).join('')

        const chars = heroTitle.querySelectorAll('span')
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.3,
        })
      }

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2,
      })

      const counterEl = document.querySelector('.hero-counter')
      if (counterEl) {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: 43,
          duration: 2,
          ease: 'power2.out',
          delay: 1.5,
          onUpdate: () => {
            counterEl.textContent = String(Math.round(obj.val))
          },
        })
      }
    }, heroRef)

    return () => {
      ctx.revert()
      gsap.ticker.remove(lenis.raf as any)
      lenis.destroy()
    }
  }, [entered])

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {!entered && <MatrixLanding onEnter={handleEnter} />}

      {entered && (
        <div className="main-content animate-fade-in-up">
          <Navigation />

          {/* Hero — Gallery entrance hall */}
          <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center px-6 relative">
            {/* Subtle warm glow behind title */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] opacity-[0.025]"
                style={{ background: 'radial-gradient(ellipse, #c28223 0%, transparent 70%)' }} />
            </div>

            <div className="relative text-center">
              {/* Top line */}
              <div className="hero-subtitle mb-10">
                <div className="flex items-center justify-center gap-4">
                  <span className="w-12 h-px bg-[#c28223]/40" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223]/60">
                    2026 · Open to the Public
                  </p>
                  <span className="w-12 h-px bg-[#c28223]/40" />
                </div>
              </div>

              {/* Monumental title */}
              <div className="mb-8">
                <h1 className="hero-title font-display text-[20vw] sm:text-[16vw] md:text-[13vw] lg:text-[11vw] text-[#f0ece8] tracking-tighter leading-[0.78] uppercase"
                  style={{ letterSpacing: '-0.05em' }}>
                  ROLL<br />CALL
                </h1>
              </div>

              {/* Counter */}
              <div className="flex items-center justify-center gap-3 mb-12">
                <span className="hero-counter number-roll font-display text-5xl sm:text-6xl text-[#c28223]">0</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888] mt-4">verified specimens</span>
              </div>

              {/* Epigraph */}
              <div className="hero-subtitle max-w-xl mx-auto">
                <p className="font-serif-display text-base sm:text-lg italic text-[#999] leading-relaxed">
                  What does a society value? Look not at its monuments,<br className="hidden sm:block" />
                  but at what it chooses to make soft.
                </p>
              </div>
            </div>

            {/* Scroll hint */}
            <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40">
              <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#c28223]/50" />
            </div>
          </section>

          <ProjectStatement />
          <Collection />
          <ExtinctSpecimens />
          <Regions />
          <DidYouKnow />
          <WorldMap />
          <DataVisualization />
          <Stories />
          <Methodology />
          <Community />
          <Exhibition />
          <Footer />
        </div>
      )}
    </div>
  )
}
