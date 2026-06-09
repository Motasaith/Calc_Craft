'use client'

import { useRef, useEffect, useState } from 'react'
import { Calculator, Palette, Code } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '1',
    icon: Calculator,
    title: 'Choose or Build',
    description: 'Pick from our library of ready-made calculators or create a custom one from scratch.',
  },
  {
    number: '2',
    icon: Palette,
    title: 'Theme & Brand',
    description: 'Customize colors, layout, and typography to match your brand.',
  },
  {
    number: '3',
    icon: Code,
    title: 'Embed & Integrate',
    description: 'Copy the embed snippet and add the calculator to any website in seconds.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, i) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getLCDText = () => {
    if (hoveredCard === 0) return 'BUILD.01'
    if (hoveredCard === 1) return 'BRAND.02'
    if (hoveredCard === 2) return 'EMBED.03'
    return '123.45'
  }

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-12 md:py-14 bg-[#eae7d9] border-y border-white/40 shadow-[inset_0_8px_16px_#c2beb0,inset_0_-8px_16px_#ffffff] overflow-hidden font-sans"
      aria-label="How Home of Calculators works - Three simple steps to use our calculators"
      itemScope
      itemType="https://schema.org/HowTo"
    >
      <meta itemProp="name" content="How to Use Home of Calculators Calculators" />
      <meta itemProp="description" content="Launch powerful calculators in three simple steps: Choose or Build, Theme & Brand, Embed & Integrate." />
      <meta itemProp="totalTime" content="PT5M" />
      {/* Inline styles for custom board animations */}
      <style>{`
        @keyframes board-dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-board-dash {
          animation: board-dash 1.5s linear infinite;
        }
      `}</style>

      {/* Mobile Layout */}
      <div className="lg:hidden px-4 sm:px-6 py-8">
        <div className="text-center mb-8 select-none">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2 tracking-tight" itemProp="name">
            How It Works
          </h2>
          <p className="text-sm text-slate-500" itemProp="description">Launch powerful calculators in three simple steps.</p>
          <div className="w-12 h-[3px] bg-[#c0392b] rounded-full mx-auto mt-3 shadow-[0_0_6px_rgba(192,57,43,0.4)]" />
        </div>

        <div className="flex flex-col gap-6 max-w-md mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                ref={(el) => {
                  if (el) stepsRef.current[i] = el
                }}
                className="relative p-5 rounded-3xl bg-[#eae7d9] border border-white/50 shadow-[6px_6px_12px_#c2beb0,-6px_-6px_12px_#ffffff] flex items-start gap-4"
                itemScope
                itemType="https://schema.org/HowToStep"
                itemProp="step"
              >
                <meta itemProp="position" content={step.number} />
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#eae7d9] border border-white/80 shadow-[2px_2px_5px_#c2beb0,-2px_-2px_5px_#ffffff] flex items-center justify-center text-slate-800 text-sm font-black">
                  {step.number}
                </div>
                <div className="flex-grow">
                  <h3 className="text-base font-black text-slate-700 mb-1" itemProp="name">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed" itemProp="text">{step.description}</p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#eae7d9] border border-white/50 shadow-[3px_3px_6px_#c2beb0,-3px_-3px_6px_#ffffff] text-slate-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Desktop Layout - Circuit Board */}
      <div className="hidden lg:block w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-400/40 scrollbar-track-transparent">
        <div className="min-w-[1140px] max-w-[1300px] mx-auto px-8 flex flex-col justify-between relative">
          
          {/* Vent holes in top left of chassis */}
          <div className="absolute top-0 left-8 flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
          </div>

          {/* Title Block inside the Chassis Container */}
          <div className="text-center mb-8 mt-1 select-none">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">
              How It Works
            </h2>
            <p className="text-xs text-slate-500">Launch powerful calculators in three simple steps.</p>
            {/* Soft red line indicator under title */}
            <div className="w-12 h-[3px] bg-[#c0392b] rounded-full mx-auto mt-3 shadow-[0_0_6px_rgba(192,57,43,0.4)]" />
          </div>

          {/* Main Board Area */}
          <div className="flex items-center justify-between gap-1 mt-2">
            
            {/* LEFT KEYPAD */}
            <div className="flex-shrink-0 w-[170px] p-4 rounded-3xl bg-[#eae7d9] border border-white/50 shadow-[inset_4px_4px_8px_#c2beb0,inset_-4px_-4px_8px_#ffffff] flex flex-col gap-2">
              {[
                ['AC', '+/-', '%'],
                ['7', '8', '9'],
                ['4', '5', '6'],
                ['1', '2', '3'],
                ['0', '.', '='],
              ].map((row, rIdx) => (
                <div key={rIdx} className="grid grid-cols-3 gap-2">
                  {row.map((key) => {
                    const isRed = key === 'AC' || key === '='
                    const isActive = activeKey === key
                    return (
                      <button
                        key={key}
                        onMouseDown={() => setActiveKey(key)}
                        onMouseUp={() => setActiveKey(null)}
                        onMouseLeave={() => setActiveKey(null)}
                        onTouchStart={() => setActiveKey(key)}
                        onTouchEnd={() => setActiveKey(null)}
                        className={`
                          h-10 text-[11px] font-bold rounded-lg transition-all duration-150 flex items-center justify-center select-none
                          ${isRed
                            ? 'bg-[#c0392b] text-white shadow-[2px_2px_5px_rgba(192,57,43,0.3)] hover:brightness-110 active:scale-95'
                            : isActive
                              ? 'bg-[#eae7d9] text-slate-700 shadow-[inset_2px_2px_4px_#b5b1a2,inset_-2px_-2px_4px_#ffffff]'
                              : 'bg-[#eae7d9] text-slate-600 shadow-[3px_3px_6px_#b5b1a2,-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#b5b1a2,-1px_-1px_3px_#ffffff]'
                          }
                        `}
                      >
                        {key}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* PIPE 1: KEYPAD TO CARD 1 */}
            <div className="flex-grow flex items-center justify-center h-20">
              <svg className="w-full h-full max-w-[50px]" viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 0,40 H 12 A 6,6 0 0,0 18,46 V 60 A 6,6 0 0,1 24,66 H 28 A 6,6 0 0,1 34,60 V 46 A 6,6 0 0,0 40,40 H 48"
                  stroke="#c2beb0"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 0,40 H 12 A 6,6 0 0,0 18,46 V 60 A 6,6 0 0,1 24,66 H 28 A 6,6 0 0,1 34,60 V 46 A 6,6 0 0,0 40,40 H 48"
                  stroke="#5a5a62"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 12"
                  className="animate-board-dash"
                />
                <circle cx="2" cy="40" r="3.5" fill="#5a5a62" />
                <circle cx="46" cy="40" r="3.5" fill="#5a5a62" />
              </svg>
            </div>

            {/* STEP CARDS */}
            <div className="flex items-center gap-3">
              {steps.map((step, i) => {
                const Icon = step.icon
                const isHovered = hoveredCard === i
                return (
                  <div key={step.number} className="flex items-center">
                    <div
                      ref={(el) => {
                        if (el) stepsRef.current[i] = el
                      }}
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
                      itemScope
                      itemType="https://schema.org/HowToStep"
                      itemProp="step"
                      className={`
                        relative w-[215px] h-[260px] p-5 rounded-3xl bg-[#eae7d9] border border-white/50 text-center flex flex-col items-center justify-between transition-all duration-300 select-none
                        ${isHovered
                          ? 'shadow-[10px_10px_20px_#c2beb0,-10px_-10px_20px_#ffffff] scale-[1.03] z-10'
                          : 'shadow-[6px_6px_12px_#c2beb0,-6px_-6px_12px_#ffffff]'
                        }
                      `}
                    >
                      <meta itemProp="position" content={step.number} />
                      {/* Top Step Number Badge */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#eae7d9] border border-white/80 shadow-[2px_2px_5px_#c2beb0,-2px_-2px_5px_#ffffff] flex items-center justify-center text-slate-800 text-xs font-black">
                        {step.number}
                      </div>

                      {/* Icon Wrapper */}
                      <div className="mt-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-[#eae7d9] border border-white/50 shadow-[3px_3px_6px_#c2beb0,-3px_-3px_6px_#ffffff] text-slate-700">
                        <Icon className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" aria-hidden="true" />
                      </div>

                      {/* Card Text Content */}
                      <div className="flex-grow flex flex-col justify-center my-3">
                        <h3 className="text-sm font-black text-slate-700 mb-1" itemProp="name">{step.title}</h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-[180px] mx-auto" itemProp="text">
                          {step.description}
                        </p>
                      </div>

                      {/* Card Indicator Dots */}
                      <div className="flex gap-1.5 justify-center mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === 0 ? 'bg-[#5a5a62] shadow-[0_0_4px_rgba(0,0,0,0.3)]' : 'bg-slate-400'}`} />
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === 1 ? 'bg-[#5a5a62] shadow-[0_0_4px_rgba(0,0,0,0.3)]' : 'bg-slate-400'}`} />
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === 2 ? 'bg-[#5a5a62] shadow-[0_0_4px_rgba(0,0,0,0.3)]' : 'bg-slate-400'}`} />
                      </div>
                    </div>

                    {/* PIPE BETWEEN CARDS */}
                    {i < steps.length - 1 && (
                      <div className="w-12 h-8 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M 0,16 H 48"
                            stroke="#c2beb0"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 0,16 H 48"
                            stroke="#5a5a62"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="6 12"
                            className="animate-board-dash"
                          />
                          <circle cx="24" cy="16" r="5" fill="#eae7d9" stroke="#c2beb0" strokeWidth="1.5" />
                          <circle cx="24" cy="16" r="2" fill="#5a5a62" />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* PIPE 4: CARD 3 TO RIGHT PANEL */}
            <div className="flex-grow flex items-center justify-center h-20">
              <svg className="w-full h-full max-w-[50px]" viewBox="0 0 48 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 0,40 H 12 A 6,6 0 0,0 18,46 V 60 A 6,6 0 0,1 24,66 H 28 A 6,6 0 0,1 34,60 V 46 A 6,6 0 0,0 40,40 H 48"
                  stroke="#c2beb0"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 0,40 H 12 A 6,6 0 0,0 18,46 V 60 A 6,6 0 0,1 24,66 H 28 A 6,6 0 0,1 34,60 V 46 A 6,6 0 0,0 40,40 H 48"
                  stroke="#5a5a62"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 12"
                  className="animate-board-dash"
                />
                <circle cx="2" cy="40" r="3.5" fill="#5a5a62" />
                <circle cx="46" cy="40" r="3.5" fill="#5a5a62" />
              </svg>
            </div>

            {/* RIGHT SIDE CONSOLE */}
            <div className="flex-shrink-0 w-[140px] flex flex-col items-center">
              {/* Dynamic LCD Screen display */}
              <div className="text-[12px] font-mono font-black text-[#20271c] tracking-wider bg-[#b8c29b] border border-[#a3ae87] px-2.5 py-1.5 rounded shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.2)] flex items-center justify-center min-w-[90px] h-[34px] select-none">
                {getLCDText()}
              </div>

              {/* Horizontal slits */}
              <div className="flex flex-col gap-1 w-20 mt-3.5">
                <div className="h-[3px] bg-slate-400/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),_1px_1px_0_#fff]" />
                <div className="h-[3px] bg-slate-400/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),_1px_1px_0_#fff]" />
                <div className="h-[3px] bg-slate-400/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),_1px_1px_0_#fff]" />
                <div className="h-[3px] bg-slate-400/40 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),_1px_1px_0_#fff]" />
              </div>

              {/* Vertical bar display */}
              <div className="flex items-end gap-1 h-11 mt-4.5">
                {[25, 50, 75, 40, 60, 20].map((height, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 h-full bg-[#c2beb0]/60 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),_1px_1px_0_#fff] relative overflow-hidden"
                  >
                    <div
                      className="absolute bottom-0 inset-x-0 bg-slate-600 rounded-full transition-all duration-300"
                      style={{ height: `${hoveredCard !== null ? height + 15 : height}%` }}
                    />
                  </div>
                ))}
              </div>

              {/* Speaker grill circle dot pattern */}
              <div className="w-[85px] h-[60px] rounded-xl bg-[#eae7d9] border border-white/50 shadow-[inset_2px_2px_4px_#c2beb0,inset_-2px_-2px_4px_#ffffff] p-2 flex flex-wrap gap-1.5 items-center justify-center mt-4">
                {Array.from({ length: 18 }).map((_, idx) => (
                  <div key={idx} className="w-1.5 h-1.5 rounded-full bg-slate-400/50 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.15)]" />
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Tray details */}
          <div className="mt-8 pt-4 border-t border-slate-400/20 flex justify-between items-center px-4">
            <div className="h-[3px] w-24 bg-[#c2beb0] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),_1px_1px_0_#fff]" />
            
            {/* Center Powered Badge */}
            <div className="px-5 py-1.5 rounded-full bg-[#eae7d9] border border-white/60 shadow-[2px_2px_4px_#c2beb0,-2px_-2px_4px_#ffffff] flex items-center gap-2.5 text-[9px] font-black tracking-widest text-slate-500 select-none">
              POWERED BY PRECISION
              <span className="w-2 h-2 rounded-full bg-[#c0392b] shadow-[0_0_8px_rgba(192,57,43,0.8)] animate-pulse" />
            </div>

            <div className="h-[3px] w-24 bg-[#c2beb0] rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15),_1px_1px_0_#fff]" />
          </div>

        </div>
      </div>
    </section>
  )
}
