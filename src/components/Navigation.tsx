import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { Menu, X, Dices } from 'lucide-react'
import { products } from '../data/products'
import { useScrollSpy } from '../hooks/useScrollSpy'

const navLinks = [
  { href: '#collection', label: 'Collection', num: '01' },
  { href: '#regions', label: 'Regions', num: '02' },
  { href: '#map', label: 'Map', num: '03' },
  { href: '#data', label: 'Data', num: '04' },
  { href: '#stories', label: 'Essay', num: '05' },
  { href: '#community', label: 'Community', num: '06' },
]

const sectionIds = ['collection', 'regions', 'map', 'data', 'stories', 'community', 'methodology']

export default function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useScrollSpy(sectionIds, 200)

  const handleRandomRoll = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    navigate(`/product/${randomProduct.id}`)
    setMenuOpen(false)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const target = document.querySelector(href)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      const target = document.querySelector(href)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      const menuEl = document.querySelector('[data-mobile-menu]')
      if (menuEl) {
        const focusable = menuEl.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
        const first = focusable[0] as HTMLElement
        const last = focusable[focusable.length - 1] as HTMLElement
        first?.focus()
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') setMenuOpen(false)
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
          }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
          document.removeEventListener('keydown', handleKeyDown)
          document.body.style.overflow = ''
        }
      }
    } else { document.body.style.overflow = '' }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-[1200px] mx-auto w-full px-6 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-baseline gap-3 group">
            <span className="font-display text-[15px] font-medium text-[#f0ece8] tracking-[0.15em] uppercase">
              ROLL CALL
            </span>
            <span className="hidden sm:inline font-mono text-[9px] tracking-[0.2em] text-[#888] uppercase group-hover:text-[#999] transition-colors">
              Material Culture Archive
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="group relative py-1 cursor-pointer">
                  <span className={`font-mono text-[9px] tracking-wider mr-2 transition-colors ${isActive ? 'text-[#c28223]' : 'text-[#888]'}`}>{link.num}</span>
                  <span className={`font-body text-[13px] transition-colors ${isActive ? 'text-[#f0ece8]' : 'text-[#888] group-hover:text-[#f0ece8]'}`}>
                    {link.label}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-px bg-[#f0ece8] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-1">
            <button onClick={handleRandomRoll} className="hidden sm:flex items-center p-2 rounded-lg text-[#999] hover:text-[#f0ece8] hover:bg-white/5 transition-all" title="Random Roll" aria-label="Random Roll">
              <Dices className="w-4 h-4" />
            </button>
            <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 rounded-lg text-[#999] hover:text-[#f0ece8] hover:bg-white/5 transition-all" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ${menuOpen ? 'visible' : 'invisible'}`}>
        <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl transition-opacity duration-500" onClick={() => setMenuOpen(false)} />
        <div data-mobile-menu className="absolute inset-x-0 top-0 p-8 pt-24 transition-transform duration-500">
          <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-5 p-2 text-white/60 hover:text-white transition-colors" aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="flex items-baseline gap-4 py-3 border-b border-white/5 group cursor-pointer">
                  <span className={`font-mono text-[10px] tracking-wider ${isActive ? 'text-[#c28223]' : 'text-white/30'}`}>{link.num}</span>
                  <span className={`font-display text-3xl transition-colors ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>{link.label}</span>
                </a>
              )
            })}
            <button onClick={handleRandomRoll} className="flex items-baseline gap-4 py-3 mt-4 group">
              <Dices className="w-5 h-5 text-white/30" />
              <span className="font-display text-3xl text-white/60 group-hover:text-white transition-colors">Random Roll</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
