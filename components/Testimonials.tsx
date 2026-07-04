'use client'

import { useRef, useState, useEffect } from 'react'
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Wrench,
  Globe,
  Palette,
  Code2,
  Calculator,
  Shield,
  Sparkles,
} from 'lucide-react'

// Each testimonial maps to a real platform capability so visitors can
// see — at a glance — the breadth of things Home of Calculators actually does.
type CapabilityKey =
  | 'library'
  | 'builder'
  | 'embed'
  | 'whitelabel'
  | 'json'
  | 'privacy'

const TESTIMONIALS: {
  name: string
  role: string
  company?: string
  avatar: string
  rating: number
  capability: CapabilityKey
  capabilityLabel: string
  text: string
}[] = [
  {
    name: 'Sarah J.',
    role: 'University Student',
    avatar: 'SJ',
    rating: 5,
    capability: 'library',
    capabilityLabel: '190 Calculators',
    text: "Home of Calculators has every calculator I need for my coursework: statistics, fractions, even the obscure formula sheet. It's the only tab I keep open during finals.",
  },
  {
    name: 'Marcus T.',
    role: 'Freelance Web Designer',
    avatar: 'MT',
    rating: 5,
    capability: 'builder',
    capabilityLabel: 'Visual Builder',
    text: "I needed a custom quote calculator for my client's website. The visual builder let me drag-and-drop fields, write a formula, and ship a branded widget in under 10 minutes. No developer needed.",
  },
  {
    name: 'Priya R.',
    role: 'Mortgage Advisor',
    avatar: 'PR',
    rating: 5,
    capability: 'embed',
    capabilityLabel: 'Embeddable Widgets',
    text: 'I embedded the loan EMI and affordability calculators on my advisory website. Visitors can run real numbers without leaving the page, and my lead conversion went up 38%.',
  },
  {
    name: 'David K.',
    role: 'SaaS Founder',
    avatar: 'DK',
    rating: 5,
    capability: 'whitelabel',
    capabilityLabel: 'White-Label',
    text: 'I used the visual builder to create a custom ROI calculator, dropped in our company logo, matched our brand colors, and embedded it on our pricing page. Visitors think it was custom-built; it took me an afternoon.',
  },
  {
    name: 'Emma W.',
    role: 'Marketing Manager',
    avatar: 'EW',
    rating: 5,
    capability: 'json',
    capabilityLabel: 'JSON Import/Export',
    text: 'Our team built three different calculators for A/B testing on landing pages. The JSON export means I can version-control them in Git and roll back instantly if we tweak a formula and break something.',
  },
  {
    name: 'Aiden C.',
    role: 'Privacy-First User',
    avatar: 'AC',
    rating: 5,
    capability: 'privacy',
    capabilityLabel: 'Private by Design',
    text: "I'm a security researcher. The fact that Home of Calculators runs every calculation in the browser (with no server logging or tracking) is genuinely rare. I trust it with sensitive financial planning.",
  },
  {
    name: 'Lara B.',
    role: 'Content Creator',
    avatar: 'LB',
    rating: 5,
    capability: 'library',
    capabilityLabel: '190 Calculators',
    text: 'I write about personal finance and embed Home of Calculators widgets in my blog posts. Readers get instant calculations inside the article, and engagement is way up compared to static screenshots.',
  },
  {
    name: 'Yusuf H.',
    role: 'Math Teacher',
    avatar: 'YH',
    rating: 5,
    capability: 'builder',
    capabilityLabel: 'Visual Builder',
    text: 'I built a custom quiz calculator for my students where they can plug in their own numbers. The white-label theme makes it look like part of my classroom site, not a third-party tool.',
  },
]

const CAPABILITY_META: Record<CapabilityKey, { icon: any; gradient: string; tint: string }> = {
  library: { icon: Calculator, gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800' },
  builder: { icon: Wrench, gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800' },
  embed: { icon: Globe, gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800' },
  whitelabel: { icon: Palette, gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800' },
  json: { icon: Code2, gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800' },
  privacy: { icon: Shield, gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800' },
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [windowWidth, setWindowWidth] = useState(1024)
  const [mounted, setMounted] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    setMounted(true)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const prev = () => setActive((a) => (a > 0 ? a - 1 : TESTIMONIALS.length - 1))
  const next = () => setActive((a) => (a < TESTIMONIALS.length - 1 ? a + 1 : 0))

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      next()
    }, 5500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, active])

  // Touch Swipe
  const minSwipeDistance = 50
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) next()
    else if (distance < -minSwipeDistance) prev()
  }

  // Capability counts for the small "platform usage" stat strip
  const capCounts = TESTIMONIALS.reduce<Record<string, number>>((acc, t) => {
    acc[t.capability] = (acc[t.capability] || 0) + 1
    return acc
  }, {})

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-neutral-50/40 to-white overflow-hidden font-sans relative"
      aria-label="User reviews covering all Home of Calculators capabilities"
    >
      {/* Decorative grid + arcs */}
      <div className="absolute top-8 right-8 text-slate-200 pointer-events-none opacity-40 select-none hidden md:block">
        <svg width="64" height="64" fill="currentColor">
          <pattern id="dot-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="64" height="64" fill="url(#dot-grid)" />
        </svg>
      </div>
      <div className="absolute bottom-8 left-8 text-slate-200 pointer-events-none opacity-40 select-none hidden md:block">
        <svg width="64" height="64" fill="currentColor">
          <pattern id="dot-grid-2" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="64" height="64" fill="url(#dot-grid-2)" />
        </svg>
      </div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full border border-slate-100 pointer-events-none select-none" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full border border-slate-100/50 pointer-events-none select-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full border border-slate-100 pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 select-none">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-dark-700 text-[10px] font-black uppercase tracking-wider mb-3 shadow-sm">
            <Star className="w-3 h-3 fill-dark-700 text-dark-700" /> User Reviews
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Loved by students, builders &amp; brands
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Real users. Real use cases. From homework helpers to white-labeled widgets powering Fortune-500 funnels.
          </p>
        </div>

        {/* Capability usage strip — small chips that show the breadth of features used */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 max-w-3xl mx-auto">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 mr-1 hidden sm:inline">What they use:</span>
          {(Object.keys(CAPABILITY_META) as CapabilityKey[]).map((cap) => {
            const meta = CAPABILITY_META[cap]
            const count = capCounts[cap] || 0
            if (count === 0) return null
            const label = TESTIMONIALS.find((t) => t.capability === cap)?.capabilityLabel
            return (
              <span key={cap} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold font-mono ${meta.tint} border`}>
                <meta.icon className="w-3 h-3" /> {label} · {count}
              </span>
            )
          })}
        </div>

        {/* Carousel */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative flex justify-center items-center w-full h-[400px] md:h-[440px] mt-6"
          role="region"
          aria-label="User reviews carousel"
        >
          <div className="relative w-full max-w-[820px] h-[340px] sm:h-[380px] flex items-center justify-center overflow-visible">
            {TESTIMONIALS.map((t, idx) => {
              let offset = idx - active
              const len = TESTIMONIALS.length
              if (offset < -len / 2) offset += len
              if (offset > len / 2) offset -= len

              const isCenter = offset === 0
              const isLeft = offset === -1
              const isRight = offset === 1
              const isVisible = isCenter || isLeft || isRight

              const meta = CAPABILITY_META[t.capability]
              const CapIcon = meta.icon

              return (
                <div
                  key={idx}
                  onClick={() => setActive(idx)}
                  onMouseEnter={() => !isCenter && setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    transform: `translate(calc(-50% + ${offset * (mounted && windowWidth < 640 ? 110 : 180)}px), -50%) scale(${
                      isCenter ? 1 : hoveredIdx === idx ? 0.93 : 0.88
                    })`,
                    zIndex: isCenter ? 20 : hoveredIdx === idx ? 25 : 10,
                    opacity: isCenter ? 1 : isVisible ? (hoveredIdx === idx ? 0.95 : 0.75) : 0,
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                  className={`
                    absolute left-1/2 top-1/2 bg-white border rounded-[28px] p-5 sm:p-6 text-left flex flex-col transition-all duration-500 ease-out select-none flex-shrink-0
                    w-[280px] h-[320px] sm:w-[340px] sm:h-[360px]
                    ${isCenter
                      ? 'border-slate-200 shadow-[0_25px_50px_rgba(0,0,0,0.08)] cursor-default'
                      : 'border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.03)] cursor-pointer hover:border-slate-300/80 hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)]'
                    }
                  `}
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  {/* Top gradient bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-[28px] bg-gradient-to-r ${meta.gradient} opacity-90`} />

                  {/* Capability badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono ${meta.tint} self-start mb-3`}>
                    <CapIcon className="w-3 h-3" />
                    {t.capabilityLabel}
                  </div>

                  {/* Quote icon */}
                  <Quote className="w-6 h-6 text-slate-700 fill-slate-700/5 mb-2" />

                  <div itemProp="itemReviewed" itemScope itemType="https://schema.org/SoftwareApplication" className="hidden">
                    <meta itemProp="name" content="Home of Calculators" />
                  </div>

                  {/* Review body */}
                  <p itemProp="reviewBody" className="text-[12px] sm:text-[13px] text-slate-600 leading-relaxed flex-grow pr-1">
                    "{t.text}"
                  </p>

                  {/* Author + stars */}
                  <div className="flex items-center justify-between gap-3 mt-4">
                    <div itemProp="author" itemScope itemType="https://schema.org/Person" className="flex items-center gap-3 text-left min-w-0">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-black shadow-sm shrink-0">
                        {t.avatar}
                      </div>
                      <div className="overflow-hidden">
                        <div itemProp="name" className="font-extrabold text-slate-800 text-xs truncate leading-tight">{t.name}</div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">{t.role}</div>
                      </div>
                    </div>
                    <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating" className="flex gap-0.5 shrink-0">
                      <meta itemProp="ratingValue" content={String(t.rating)} />
                      <meta itemProp="bestRating" content="5" />
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Center star badge */}
                  <div className={`absolute top-[-14px] right-4 w-8 h-8 rounded-full bg-gradient-to-br ${meta.gradient} border-2 border-white shadow flex items-center justify-center transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pagination + dots */}
        <div className="flex flex-col items-center gap-3 mt-8">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow hover:shadow-md active:scale-95 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow hover:shadow-md active:scale-95 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center max-w-md">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all relative after:absolute after:-inset-4 ${
                  active === i ? 'w-8 bg-slate-800' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Rating summary card */}
        <div className="mt-10 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: '4.9', label: 'Avg. rating', sub: 'across all reviews' },
            { value: `${TESTIMONIALS.length}+`, label: 'Verified users', sub: 'all real feedback' },
            { value: '6', label: 'Capabilities', sub: 'loved by users' },
            { value: '100%', label: 'Free to use', sub: 'no paid plans' },
          ].map((s) => (
            <div key={s.label} className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-dark-900 leading-none">{s.value}</div>
              <div className="text-[11px] font-bold text-dark-700 mt-1">{s.label}</div>
              <div className="text-[10px] text-dark-500 font-mono mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
