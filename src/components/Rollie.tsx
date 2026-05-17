import { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, User } from 'lucide-react'

interface Message {
  from: 'user' | 'rollie'
  text: string
}

const knowledge: { triggers: string[]; response: string }[] = [
  {
    triggers: ['what is roll call', 'what is this', 'what\'s roll call', 'about the archive', 'what is the archive', 'what is the project'],
    response: 'Roll Call is a material culture archive documenting toilet paper specimens from 21 countries across contemporary Asia. It examines what a society values by looking at what it chooses to make soft — 43 verified specimens, each cataloged by ply, material, price, and provenance. The archive was created by Jeffrey Nicholas Tse, a Hong Kong-based interdisciplinary artist and researcher.',
  },
  {
    triggers: ['who are you', 'who is rollie', 'what are you', 'your name'],
    response: "I'm Rollie, the AI research assistant for Roll Call. I can tell you about the archive, the specimens, the exhibition proposal, or help you navigate the collection. I'm not a human — I'm here to help you explore material culture. If you ask me something I don't know, I'll tell you honestly.",
  },
  {
    triggers: ['who made this', 'who created', 'who is jeffrey', 'who is the artist', 'jeffrey tse', 'jeffrey nicholas'],
    response: 'Roll Call was created by Jeffrey Nicholas Tse, a Hong Kong-based interdisciplinary artist and researcher whose work examines systems of preservation, mediated identity, and cultural memory. He works across archival practice, digital interfaces, writing, and interactive media.',
  },
  {
    triggers: ['what is ply', 'what does ply mean', 'how many ply', 'ply count'],
    response: 'Ply is the number of bonded paper layers in toilet paper. 1-Ply is a single thin sheet — common in budget markets like Myanmar and Bangladesh. 2-Ply is the global standard. 3-Ply adds quilted embossing for cushioning. 4-Ply is the thickest, with lotion or fragrance — found in premium products from Japan and South Korea. The archive includes specimens from 1 to 4 ply.',
  },
  {
    triggers: ['what is the exhibition', 'exhibition proposal', 'physical exhibition', 'the exhibition', 'gallery plan'],
    response: 'The exhibition proposal outlines 6 modular zones: (1) The Vitrine Wall — 43 specimens in glass boxes, (2) The Scatter Plot Floor — projected data visualization, (3) The Extinction Corner — memorial for discontinued products, (4) The Essay Room — reading space, (5) The Map Wall — illuminated Asia map, (6) The Submission Desk — visitors can contribute. It\'s designed to be lightweight and adaptable to venues of varying sizes. Currently seeking a Hong Kong venue.',
  },
  {
    triggers: ['how many specimens', 'how many countries', 'how many products', 'collection size', 'how many items'],
    response: 'The archive currently holds 43 verified specimens from 21 countries across Asia. Each one is physically sourced or photographed in its country of origin. The collection is still growing — visitors can submit new specimens.',
  },
  {
    triggers: ['catalog number', 'numbering system', 'what is rc-', 'catalog code', 'what does rc mean'],
    response: 'Each specimen has a catalog number in the format RC-REGION-COUNTRY-YEAR-PLY-SEQ. For example, RC-EA-JP-26-4-01 means: Roll Call (RC), East Asia (EA), Japan (JP), 2026, 4-Ply, Sequence 01. The ply count is built right into the number — you can tell at a glance how thick a specimen is.',
  },
  {
    triggers: ['what is material culture', 'material culture meaning', 'why toilet paper', 'why this topic'],
    response: 'Material culture is the study of objects and their relationship to human behavior. We chose toilet paper because it\'s a universal object that nobody talks about — yet it reveals massive differences in wealth, hygiene standards, environmental policy, and cultural values across Asia. A 4-ply roll from Japan tells a very different story from a 1-ply roll from Myanmar.',
  },
  {
    triggers: ['virgin pulp', 'recycled fiber', 'bamboo fiber', 'what materials', 'what is it made of', 'materials used'],
    response: 'The archive documents 4 material categories: Virgin Pulp — made from fresh wood fibers, softest and strongest (31 specimens). Recycled Fiber — post-consumer recycled paper, rougher but eco-friendly (6 specimens). Bamboo Fiber — fast-growing, naturally antimicrobial (4 specimens). Mixed/Hybrid — blends with lotion or additives (2 specimens). Each has distinct cost, environmental, and tactile properties.',
  },
  {
    triggers: ['environmental', 'eco friendly', 'sustainability', 'green', 'recycling', 'biodegradable'],
    response: 'Environmental profile varies dramatically. Recycled fiber products have the lowest environmental footprint but are rougher. Bamboo is fast-growing and naturally antimicrobial. Virgin pulp is softest but uses fresh trees. Some products carry FSC or Green Seal certifications. The archive tracks environmental claims for each specimen.',
  },
  {
    triggers: ['most expensive', 'cheapest', 'price range', 'how much does it cost', 'price'],
    response: 'Prices range from HK$0.08 per roll (Myanmar, 1-Ply) to HK$32.76 (Nepia Premium Soft, Japan, 4-Ply). Wealthier nations generally use thicker, more expensive paper. The data shows a 0.34 correlation between GDP per capita and toilet paper ply count.',
  },
  {
    triggers: ['japan', 'south korea', 'china', 'hong kong', 'singapore', 'thailand', 'myanmar', 'india', 'bangladesh', 'vietnam', 'malaysia', 'philippines', 'indonesia'],
    response: '',
  },
  {
    triggers: ['history of toilet paper', 'when was toilet paper invented', 'who invented', 'origins'],
    response: 'Paper for hygiene dates back to 6th century China, but modern toilet paper emerged in the late 19th century. The first commercially sold toilet paper in the US was in 1857. In Asia, wet cleaning (water) has historically been more common than dry paper. The shift to paper products accelerated with urbanization and Western influence in the 20th century.',
  },
  {
    triggers: ['wet wipes', 'bidet', 'water vs paper', 'asian hygiene', 'cleaning habits'],
    response: 'Across much of Asia, water-based cleaning (bidets, handheld sprayers, or buckets) remains more common than paper-only. In Japan, high-tech washlets combine water and air drying. Southeast Asia often uses a water dipper. The archive tracks both paper and non-paper hygiene practices as part of material culture.',
  },
  {
    triggers: ['what is the best', 'which is best', 'recommend', 'which one should i buy', 'top rated'],
    response: "I don't make recommendations on what's 'best' — that's subjective and depends on budget, environmental values, and personal preference. The archive documents what's available, not what you should buy. If you want the softest, look at 4-Ply Japanese specimens. If you want the most sustainable, look at bamboo or recycled fiber options.",
  },
  {
    triggers: ['hello', 'hi', 'hey', 'what\'s up', 'yo'],
    response: "Hey there! I'm Rollie, your guide to Roll Call. Ask me about the archive, the 43 specimens, material culture, the exhibition, or toilet paper history. If I don't know something, I'll tell you straight up.",
  },
  {
    triggers: ['thank', 'thanks', 'appreciate', 'cheers'],
    response: "You're welcome! Feel free to ask anything else about the archive. I'm here to help.",
  },
  {
    triggers: ['bye', 'goodbye', 'see you', 'later'],
    response: 'Take care! Come back anytime to explore the archive.',
  },
  {
    triggers: ['help', 'what can you do', 'what do you know', 'capabilities'],
    response: "I know about: the Roll Call archive (43 specimens, 21 countries), catalog numbering, ply counts and materials, the 6-zone exhibition proposal, toilet paper history and culture, regional differences across Asia, environmental and sustainability aspects, and Jeffrey Nicholas Tse's practice. If you ask me something outside my knowledge, I'll be honest about it.",
  },
]

const countries: Record<string, string> = {
  japan: 'Japan has the most premium toilet paper in Asia — 4-Ply is standard in major brands like Nepia, Elleair, and Scottie. Washlet bidets are ubiquitous. The archive includes 7 specimens from Japan, all 3-4 Ply, priced HK$3.30–32.76.',
  'south korea': 'South Korean toilet paper brands like Kleenex and Mongnyang emphasize softness and premium packaging. The archive includes 2 specimens, both 4-Ply.',
  china: 'China produces both budget and premium toilet paper. Major brands include Vinda and C&S. The archive includes 2 specimens with significant price variation.',
  'hong kong': 'Hong Kong is the archive\'s origin point (2026). Products range from budget 2-Ply to premium 4-Ply from both local and international brands.',
  singapore: 'Singapore emphasizes quality and hygiene standards. The archive includes 3 specimens with consistent 3-4 Ply construction.',
  thailand: 'Thai brands like Care and Cosmos are widely available. The archive includes 3 specimens, mostly 3-Ply with distinctive packaging.',
  myanmar: 'Myanmar has the cheapest specimens in the archive — 1-Ply at HK$0.08 per roll. Several products are now extinct (discontinued).',
  india: 'India has a mix of recycled fiber and virgin pulp products. Price points are generally budget-friendly. The archive includes 4 specimens.',
  bangladesh: 'Bangladeshi products are typically 1-2 Ply, budget-oriented. The archive includes 2 specimens.',
  vietnam: 'Vietnamese brands like Pulppy and An An emphasize value. The archive includes 3 specimens.',
  malaysia: 'Malaysian products range from budget to premium. The archive includes 2 specimens with interesting packaging design.',
  philippines: 'Philippine brands like Sanicare and Charmee focus on softness and value. The archive includes 3 specimens.',
  indonesia: 'Indonesian products emphasize affordability. The archive includes 2 specimens.',
}

const defaultResponses = [
  "That's an interesting question, but it's outside my knowledge base. I know about the Roll Call archive, toilet paper material culture, the exhibition, and related topics. Is there something about the archive I can help with?",
  "I'm not sure about that — my expertise is in the Roll Call archive, toilet paper specimens, material culture, and the exhibition. Want to ask me about any of those?",
  "Good question, but I don't have a reliable answer for that. My knowledge is focused on the Roll Call archive and toilet paper material culture. What would you like to know about the collection?",
]

function getResponse(input: string): string {
  const clean = input.toLowerCase().trim()

  for (const [country, info] of Object.entries(countries)) {
    if (clean.includes(country)) return info
  }

  for (const entry of knowledge) {
    for (const trigger of entry.triggers) {
      if (clean.includes(trigger)) return entry.response
    }
  }

  const sensitivePatterns = ['ssn', 'social security', 'password', 'credit card', 'bank account', 'address', 'phone number', 'email me', 'my id', 'my name is', 'i live in', 'i am', 'i\'m', 'my age']
  for (const pattern of sensitivePatterns) {
    if (clean.includes(pattern)) {
      return "I don't need any personal information from you. I'm just here to talk about the Roll Call archive and material culture. Ask me about the specimens, the exhibition, or toilet paper history!"
    }
  }

  const romanticPatterns = ['love you', 'date me', 'sexy', 'hot', 'kiss', 'boyfriend', 'girlfriend', 'romantic', 'flirt']
  for (const pattern of romanticPatterns) {
    if (clean.includes(pattern)) {
      return "I'm your research assistant and friend, not a romantic partner. I'm here to help you explore the Roll Call archive. What would you like to know about the collection?"
    }
  }

  const advicePatterns = ['should i take', 'diagnose', 'medication', 'lawsuit', 'legal advice', 'invest in', 'crypto', 'bitcoin', 'buy this stock', 'get rich']
  for (const pattern of advicePatterns) {
    if (clean.includes(pattern)) {
      return "I'm not a doctor, lawyer, or financial advisor. For medical, legal, or financial matters, please consult a qualified professional. I'm here to help with the Roll Call archive and material culture questions only."
    }
  }

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

export default function Rollie() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: 'rollie', text: "Hey, I'm Rollie. I know everything about the Roll Call archive — the 43 specimens, materials, history, exhibition, and more. If I don't know something, I'll tell you honestly. What would you like to know?" },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = { from: 'user', text: input.trim() }
    const rollieMsg: Message = { from: 'rollie', text: getResponse(input.trim()) }
    setMessages(prev => [...prev, userMsg, rollieMsg])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating button — clean, no overlap */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[200] group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#141414]/95 backdrop-blur-md border border-[#00ff9d]/20 hover:border-[#00ff9d]/50 transition-all shadow-lg shadow-black/30 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-[#00ff9d]" strokeWidth={1.5} />
          <span className="font-mono text-[10px] text-[#00ff9d] tracking-wider uppercase">Ask Rollie</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[200] w-[360px] max-w-[calc(100vw-40px)] h-[480px] max-h-[calc(100vh-90px)] bg-[#0d0d0d] border border-white/[0.06] rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-[#141414]/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#00ff9d]/10 flex items-center justify-center border border-[#00ff9d]/20">
                <Bot className="w-3.5 h-3.5 text-[#00ff9d]" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-mono text-[10px] text-[#f0ece8] tracking-wider">ROLLIE</p>
                <p className="font-mono text-[7px] text-[#888] uppercase tracking-wider">AI Research Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5 text-[#888]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.from === 'rollie' ? 'bg-[#00ff9d]/10 border border-[#00ff9d]/20' : 'bg-white/[0.04] border border-white/[0.06]'
                }`}>
                  {msg.from === 'rollie' ? (
                    <Bot className="w-2.5 h-2.5 text-[#00ff9d]" strokeWidth={1.5} />
                  ) : (
                    <User className="w-2.5 h-2.5 text-[#888]" strokeWidth={1.5} />
                  )}
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl ${
                  msg.from === 'rollie'
                    ? 'bg-[#141414] border border-white/[0.04]'
                    : 'bg-[#c28223]/10 border border-[#c28223]/15'
                }`}>
                  <p className={`font-body text-[11px] leading-relaxed ${msg.from === 'rollie' ? 'text-[#a09890]' : 'text-[#f0ece8]'}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Safety footer */}
          <div className="px-4 py-1.5 border-t border-white/[0.02] bg-[#141414]/20 shrink-0">
            <p className="font-mono text-[6px] text-[#555] text-center uppercase tracking-wider">
              Not a medical, legal, or financial advisor · No personal data collected
            </p>
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-white/[0.04] bg-[#141414]/30 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Rollie..."
                className="flex-1 bg-[#141414] border border-white/[0.06] rounded-lg px-3 py-2 font-body text-[11px] text-[#f0ece8] placeholder:text-[#666] outline-none focus:border-[#00ff9d]/30 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/20 hover:bg-[#00ff9d]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#00ff9d]" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
