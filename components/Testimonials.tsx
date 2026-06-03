'use client'

import { useRef, useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'Student',
    avatar: 'SJ',
    text: "CalcCraft is my go-to for quick calculations. It's fast, accurate, and super easy to use!",
    rating: 5,
  },
  {
    name: 'Michael T.',
    role: 'Engineer',
    avatar: 'MT',
    text: 'Great for students and professionals alike. The scientific calculator is amazing.',
    rating: 5,
  },
  {
    name: 'Priya K.',
    role: 'Financial Analyst',
    avatar: 'PK',
    text: 'I use the loan calculator all the time. It helps me plan my finances better.',
    rating: 5,
  },
  {
    name: 'David R.',
    role: 'Teacher',
    avatar: 'DR',
    text: 'I recommend CalcCraft to all my students. The variety of tools is incredible.',
    rating: 5,
  },
  {
    name: 'Emma W.',
    role: 'Freelancer',
    avatar: 'EW',
    text: 'The embed feature is a game changer. I added calculators directly to my client proposals.',
    rating: 5,
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(1) // Start with index 1 (Michael T.) centered
  const [windowWidth, setWindowWidth] = useState(1024)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const prev = () => setActive((a) => (a > 0 ? a - 1 : testimonials.length - 1))
  const next = () => setActive((a) => (a < testimonials.length - 1 ? a + 1 : 0))

  return (
    <section ref={sectionRef} className="py-20 lg:py-24 bg-white overflow-hidden font-sans relative">
      
      {/* Decorative Dot Grid Top-Right */}
      <div className="absolute top-8 right-8 text-slate-200 pointer-events-none opacity-40 select-none hidden md:block">
        <svg width="64" height="64" fill="currentColor">
          <pattern id="dot-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="64" height="64" fill="url(#dot-grid)" />
        </svg>
      </div>

      {/* Decorative Dot Grid Bottom-Left */}
      <div className="absolute bottom-8 left-8 text-slate-200 pointer-events-none opacity-40 select-none hidden md:block">
        <svg width="64" height="64" fill="currentColor">
          <pattern id="dot-grid-2" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="64" height="64" fill="url(#dot-grid-2)" />
        </svg>
      </div>

      {/* Decorative Circle Arc Bottom-Left */}
      <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full border border-blue-50/40 pointer-events-none select-none" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full border border-blue-50/20 pointer-events-none select-none" />

      {/* Decorative Circle Arc Bottom-Right */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full border border-blue-50/30 pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center mb-10 select-none">
          {/* Soft blue badge above title */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-wider text-blue-600 mb-3 shadow-[0_2px_10px_rgba(59,130,246,0.05)]">
            <Quote className="w-3 h-3 text-blue-500 fill-blue-500/10" />
            User Testimonials
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">
            What Our Users Say
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Trusted by students, professionals, and everyday users.</p>
        </div>

        {/* Carousel Container */}
        <div className="relative flex justify-center items-center w-full h-[360px] md:h-[400px] mt-6">
          
          {/* WATERMARK BACKGROUND LEFT (Keypad) */}
          <div className="absolute left-[-50px] 2xl:left-12 top-1/2 -translate-y-1/2 opacity-[0.25] pointer-events-none hidden lg:block select-none scale-90 2xl:scale-100 origin-left">
            <div className="w-[200px] bg-[#f8fafc]/80 backdrop-blur-sm border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-4 flex flex-col gap-2.5">
              <div className="grid grid-cols-3 gap-2">
                {/* Row 1 */}
                <div className="h-10 rounded-lg bg-slate-50 border border-slate-100/80 flex items-center justify-center text-[10px] font-bold text-slate-400">AC</div>
                <div className="h-10 rounded-lg bg-slate-50 border border-slate-100/80 flex items-center justify-center text-[10px] font-bold text-slate-400">+/-</div>
                <div className="h-10 rounded-lg bg-slate-50 border border-slate-100/80 flex items-center justify-center text-[10px] font-bold text-slate-400">%</div>
                {/* Row 2 */}
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">7</div>
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">8</div>
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">9</div>
                {/* Row 3 */}
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">4</div>
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">5</div>
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">6</div>
                {/* Row 4 */}
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">1</div>
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">2</div>
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">3</div>
                {/* Row 5 */}
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">0</div>
                <div className="h-10 rounded-lg bg-slate-50/55 border border-slate-100/85 flex items-center justify-center text-[11px] font-bold text-slate-500">.</div>
                <div className="h-10 rounded-lg bg-blue-500 flex items-center justify-center text-[12px] font-extrabold text-white shadow-[0_4px_10px_rgba(59,130,246,0.3)]">=</div>
              </div>
            </div>
          </div>

          {/* WATERMARK BACKGROUND RIGHT (Display) */}
          <div className="absolute right-[-50px] 2xl:right-12 top-1/2 -translate-y-1/2 opacity-[0.25] pointer-events-none hidden lg:block select-none scale-90 2xl:scale-100 origin-right">
            <div className="w-[200px] bg-[#f8fafc]/80 backdrop-blur-sm border border-slate-100/50 shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-5 flex flex-col gap-4">
              {/* Screen display box */}
              <div className="w-full h-[46px] bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-end px-4 text-slate-400 font-mono tracking-wider select-none relative overflow-hidden">
                <div className="absolute left-2.5 top-2.5 w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                <span className="text-blue-500/80 font-semibold text-lg">123.45</span>
              </div>
              {/* Horizontal thin slots */}
              <div className="flex flex-col gap-1.5 w-full px-1">
                <div className="h-[2px] bg-slate-100 rounded-full" />
                <div className="h-[2px] bg-slate-100 rounded-full" />
                <div className="h-[2px] bg-slate-100 rounded-full" />
              </div>
              {/* Mini stats/graph visual */}
              <div className="mt-1 border border-slate-100 rounded-2xl p-2.5 flex items-center gap-3 bg-slate-50/30">
                {/* Faint bar chart */}
                <div className="flex items-end gap-1 h-9 flex-shrink-0">
                  {[12, 28, 22, 40, 18, 25].map((h, idx) => (
                    <div key={idx} className="w-1 bg-slate-100 rounded-full" style={{ height: '36px' }}>
                      <div className="w-full bg-blue-400/40 rounded-full" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                {/* Mini lines */}
                <div className="flex-grow flex flex-col gap-1.5">
                  <div className="h-1.5 bg-slate-100 rounded-full w-12" />
                  <div className="h-1 bg-slate-100 rounded-full w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Cards Track */}
          <div className="relative w-full max-w-[800px] h-[320px] sm:h-[340px] flex items-center justify-center overflow-visible">
            {testimonials.map((t, idx) => {
              let offset = idx - active
              const len = testimonials.length
              if (offset < -len / 2) offset += len
              if (offset > len / 2) offset -= len

              const isCenter = offset === 0
              const isLeft = offset === -1
              const isRight = offset === 1
              const isVisible = isCenter || isLeft || isRight

              return (
                <div
                  key={idx}
                  style={{
                    transform: `translate(calc(-50% + ${offset * (windowWidth < 640 ? 110 : 180)}px), -50%) scale(${isCenter ? 1 : 0.88})`,
                    zIndex: isCenter ? 20 : 10,
                    opacity: isCenter ? 1 : isVisible ? 0.75 : 0,
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                  className={`
                    absolute left-1/2 top-1/2 bg-white border rounded-[28px] p-6 text-left flex flex-col justify-between transition-all duration-500 ease-out select-none flex-shrink-0
                    w-[270px] h-[300px] sm:w-[320px] sm:h-[320px]
                    ${isCenter
                      ? 'border-blue-100 shadow-[0_20px_40px_rgba(59,130,246,0.12)]'
                      : 'border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.03)]'
                    }
                  `}
                >
                  {/* Top Star circular badge */}
                  <div className={`absolute top-[-18px] left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-blue-500 border-2 border-white shadow-[0_4px_12px_rgba(59,130,246,0.35)] flex items-center justify-center text-white transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                  </div>

                  {/* Quote icon */}
                  <Quote className="w-7 h-7 text-blue-500 fill-blue-500/10 mb-2 mt-1" />

                  {/* Testimonial Text */}
                  <p className="text-[12.5px] text-slate-500 leading-relaxed flex-grow flex items-center pr-1">
                    "{t.text}"
                  </p>

                  {/* User BIO row */}
                  <div className="flex items-center gap-3 mt-4 text-left">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-black shadow-sm flex-shrink-0">
                      {t.avatar}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-extrabold text-slate-700 text-xs truncate leading-tight">{t.name}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.role}</div>
                    </div>
                  </div>

                  {/* Star Rating indicators */}
                  <div className="flex gap-0.5 mt-2 justify-start">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* Pagination & Slider Control Navigation */}
        <div className="flex justify-center items-center gap-4 mt-8 relative z-20">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-[0_3px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)] active:scale-95 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-all"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Pagination Indicators dots */}
          <div className="flex gap-2 items-center">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${active === idx ? 'bg-blue-500 w-4 shadow-[0_0_6px_#3b82f6]' : 'bg-slate-200 w-2'}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-[0_3px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)] active:scale-95 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-all"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  )
}

