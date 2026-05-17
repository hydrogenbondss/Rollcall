import { useState, useRef, useEffect } from 'react'
import { products } from '../data/products'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'ply'
  text: string
}

const GREETING = `Hi! I'm Ply — your toilet paper research assistant. Ask me anything about the 43 specimens in the Roll Call archive. I can tell you about brands, countries, materials, pricing, and weird facts.`

function generateReply(userText: string): string {
  const q = userText.toLowerCase().trim()

  // Greeting
  if (q.match(/^(hi|hello|hey|sup|yo)/)) {
    return GREETING
  }

  // Ply questions
  if (q.includes('ply')) {
    const counts: Record<number, number> = {}
    products.forEach(p => { counts[p.ply] = (counts[p.ply] || 0) + 1 })
    return `We have specimens across all ply counts:\n\n${Object.entries(counts).sort((a, b) => Number(a[0]) - Number(b[0])).map(([ply, count]) => `  ${ply}-Ply: ${count} specimens`).join('\n')}\n\nMost common is ${Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]}-Ply with ${Object.entries(counts).sort((a, b) => b[1] - a[1])[0][1]} products. Fun fact: GDP per capita correlates 0.34 with ply count.`
  }

  // Country questions
  const countryMatch = products.find(p => q.includes(p.country.toLowerCase()))
  if (countryMatch || q.includes('country') || q.includes('countries')) {
    if (countryMatch) {
      const country = countryMatch.country
      const items = products.filter(p => p.country === country)
      return `${country} has ${items.length} specimen${items.length > 1 ? 's' : ''} in the archive:\n\n${items.map(p => `  ${p.name} — ${p.brand}, ${p.ply}-Ply`).join('\n')}\n\nFlag color: ${countryMatch.flag}`
    }
    const countries = [...new Set(products.map(p => p.country))].sort()
    return `The archive covers ${countries.length} countries across Asia:\n\n${countries.slice(0, 10).join(', ')}${countries.length > 10 ? ` and ${countries.length - 10} more` : ''}.\n\nWhich country would you like to know about?`
  }

  // Brand questions
  if (q.includes('brand') || q.includes('who makes')) {
    const brands = [...new Set(products.map(p => p.brand))].sort()
    return `There are ${brands.length} unique brands in the archive. Top manufacturers include:\n\n${brands.slice(0, 8).join(', ')}...\n\nWhich brand interests you?`
  }

  // Price questions
  if (q.includes('price') || q.includes('cost') || q.includes('expensive') || q.includes('cheapest')) {
    const sorted = [...products].sort((a, b) => a.price - b.price)
    const cheapest = sorted[0]
    const mostExp = sorted[sorted.length - 1]
    const avg = (sorted.reduce((s, p) => s + p.price, 0) / sorted.length).toFixed(2)
    return `Price range across the archive:\n\n  Cheapest: ${cheapest.name} — HK$${cheapest.price.toFixed(2)} (${cheapest.country})\n  Most expensive: ${mostExp.name} — HK$${mostExp.price.toFixed(2)} (${mostExp.country})\n  Average: HK$${avg}\n\nCorrelation between price and ply: +0.34 (wealthier countries charge more)`
  }

  // Material questions
  if (q.includes('material') || q.includes('made of') || q.includes('bamboo') || q.includes('recycled') || q.includes('virgin')) {
    const materials: Record<string, number> = {}
    products.forEach(p => {
      p.materials.forEach(m => {
        materials[m] = (materials[m] || 0) + 1
      })
    })
    const sortedMats = Object.entries(materials).sort((a, b) => b[1] - a[1])
    return `Material breakdown across all specimens:\n\n${sortedMats.slice(0, 6).map(([mat, count]) => `  ${mat}: ${count} specimens`).join('\n')}\n\nThe most common material is ${sortedMats[0][0]} (${sortedMats[0][1]} products). Want details on a specific material?`
  }

  // Most/least
  if (q.includes('most') || q.includes('highest') || q.includes('biggest') || q.includes('longest')) {
    const mostPly = products.reduce((a, b) => a.ply > b.ply ? a : b)
    const mostExp = products.reduce((a, b) => a.price > b.price ? a : b)
    return `Extremes in the archive:\n\n  Most plies: ${mostPly.name} (${mostPly.ply}-Ply) — ${mostPly.country}\n  Most expensive: ${mostExp.name} — HK$${mostExp.price.toFixed(2)} — ${mostExp.country}`
  }

  // Weird/fun facts
  if (q.includes('weird') || q.includes('fun') || q.includes('crazy') || q.includes('interesting') || q.includes('fact')) {
    const facts = [
      `Hong Kong's GDP per capita ($49,755) correlates with its 4-ply toilet paper preference.`,
      `Myanmar's 1-ply product costs only HK$0.08 — the cheapest in the archive.`,
      `Japan uses virgin pulp with squalane (shark liver oil derivative) in premium toilet paper.`,
      `The word 'toilet' comes from the French 'toile' meaning cloth — the original wiping material.`,
      `The first perforated toilet paper roll was patented in 1871 by Seth Wheeler.`,
      `Bamboo toilet paper grows 30x faster than trees and uses no irrigation.`,
      `Andrex puppy mascot has appeared on packaging since 1972 — 53 years of puppy power.`,
    ]
    return `Here's a fun fact:\n\n${facts[Math.floor(Math.random() * facts.length)]}`
  }

  // Specific product search
  const nameMatch = products.find(p => q.includes(p.name.toLowerCase()) || q.includes(p.brand.toLowerCase()))
  if (nameMatch) {
    return `**${nameMatch.name}**\n\nBrand: ${nameMatch.brand}\nCountry: ${nameMatch.country}\nPly: ${nameMatch.ply}\nPrice: HK$${nameMatch.price.toFixed(2)}\nMaterial: ${nameMatch.materials.join(', ')}\n\n${nameMatch.description || ''}`
  }

  // Region questions
  if (q.includes('east asia') || q.includes('southeast') || q.includes('south asia')) {
    const region = q.includes('east asia') ? 'East Asia' : q.includes('southeast') ? 'Southeast Asia' : 'South Asia'
    const items = products.filter(p => p.category === region)
    return `${region}: ${items.length} specimens\n\n${items.slice(0, 5).map(p => `  ${p.name} — ${p.country}`).join('\n')}${items.length > 5 ? `\n  ...and ${items.length - 5} more` : ''}`
  }

  // Default / help
  return `I'm not sure I understood that. Try asking me about:\n\n  How many countries are covered?\n  What's the most expensive?\n  Tell me about Japan\n  What's the cheapest 1-ply?\n  Fun facts about toilet paper\n  What materials are used?\n\nOr just name a product or brand!`
}

export default function PlyChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'ply', text: GREETING }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const reply = generateReply(userMsg)
      setMessages(prev => [...prev, { role: 'ply', text: reply }])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
          open
            ? 'bg-[#1a1a1a] border border-white/10 rotate-0'
            : 'bg-[#c28223] hover:bg-[#d49a3f] hover:scale-110'
        }`}
        style={{ boxShadow: open ? 'none' : '0 4px 20px rgba(194,130,35,0.3)' }}
      >
        {open ? (
          <X className="w-5 h-5 text-[#f0ece8]" strokeWidth={2} />
        ) : (
          <div className="flex items-center gap-1">
            <Sparkles className="w-5 h-5 text-[#0d0d0d]" strokeWidth={2} />
          </div>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[199] w-[380px] max-w-[calc(100vw-48px)] bg-[#111111] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ height: '520px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04] bg-[#0d0d0d]">
            <div className="w-8 h-8 rounded-full bg-[#c28223]/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display text-sm text-[#f0ece8]">Ply</p>
              <p className="font-mono text-[9px] text-[#888] uppercase tracking-wider">Archive Assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#228b68]" />
              <span className="font-mono text-[9px] text-[#888]">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'ply' ? 'bg-[#c28223]/20' : 'bg-white/[0.06]'
                }`}>
                  {msg.role === 'ply' ? (
                    <Bot className="w-3.5 h-3.5 text-[#c28223]" strokeWidth={1.5} />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#888]" strokeWidth={1.5} />
                  )}
                </div>
                <div className={`max-w-[280px] px-4 py-3 rounded-2xl ${
                  msg.role === 'ply'
                    ? 'bg-[#1a1a1a] text-[#f0ece8]/90'
                    : 'bg-[#c28223]/10 text-[#f0ece8]'
                }`}>
                  <p className="font-body text-[13px] leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#c28223]/20 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#c28223]" strokeWidth={1.5} />
                </div>
                <div className="bg-[#1a1a1a] px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#888] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#888] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#888] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && (
            <div className="px-5 pb-2 flex flex-wrap gap-2">
              {['How many countries?', 'Most expensive?', 'Fun facts', 'Bamboo products'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setMessages(prev => [...prev, { role: 'user', text: s }])
                    setIsTyping(true)
                    setTimeout(() => {
                      setMessages(prev => [...prev, { role: 'ply', text: generateReply(s) }])
                      setIsTyping(false)
                    }, 600)
                  }}
                  className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.04] hover:border-[#c28223]/20 hover:bg-[#c28223]/5 transition-all cursor-pointer"
                >
                  <span className="font-body text-[11px] text-[#888] hover:text-[#f0ece8]">{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/[0.04] bg-[#0d0d0d]">
            <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-xl px-4 py-2 border border-white/[0.04]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Ply anything..."
                className="flex-1 bg-transparent font-body text-[13px] text-[#f0ece8] placeholder:text-[#888]/50 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-all disabled:opacity-20 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
