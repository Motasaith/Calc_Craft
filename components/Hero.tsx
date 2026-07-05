'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import Features from './Features'
import CalculatorStack from './CalculatorStack'

const MATH_CARDS = [
  { formula: 'E = mc²', top: '15%', left: '10%', delay: 0 },
  { formula: '∫ e^x dx = e^x', bottom: '20%', right: '10%', delay: 1 },
  { formula: 'a² + b² = c²', top: '25%', right: '15%', delay: 2 },
  { formula: 'x = (-b±√Δ)/2a', bottom: '25%', left: '12%', delay: 1.5 },
]

function FloatingMathCards() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.children
    
    gsap.context(() => {
      Array.from(cards).forEach((card, i) => {
        gsap.to(card, {
          y: '+=20',
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: MATH_CARDS[i].delay,
        })
      })
    }, containerRef)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block" aria-hidden="true">
      {MATH_CARDS.map((card, i) => (
        <div
          key={i}
          className="absolute bg-white/60 backdrop-blur-md border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl px-5 py-3 text-primary-800 font-mono font-bold text-lg select-none"
          style={{
            top: card.top,
            bottom: card.bottom,
            left: card.left,
            right: card.right,
          }}
        >
          {card.formula}
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.5'
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col justify-center min-h-[70vh] bg-white"
        aria-label="Hero section - Free online calculators"
      >
        {/* ===== Sleek Modern Light Background ===== */}
        
        {/* Soft pastel glowing Orbs */}
        <div
          className="absolute inset-0 -z-20 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Top Left Blue Glow */}
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-40 mix-blend-multiply filter blur-[100px] bg-sky-200 animate-[spin_40s_linear_infinite]" />
          {/* Bottom Right Purple Glow */}
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-30 mix-blend-multiply filter blur-[120px] bg-indigo-200 animate-[spin_50s_linear_infinite_reverse]" />
          {/* Center Subtle Highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full opacity-20 mix-blend-multiply filter blur-[140px] bg-blue-100" />
        </div>

        {/* Floating Math Cards */}
        <FloatingMathCards />

        {/* Crisp grid pattern for a techy feel */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 80%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          {/* Builder Feature Highlight Badge */}
          <div ref={badgeRef} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-3 px-1.5 py-1.5 pr-5 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/80 text-gray-700 text-[13px] font-medium shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <span className="px-3 py-1 rounded-full bg-gray-900 border border-gray-900 text-[10px] font-extrabold uppercase tracking-widest shadow-sm text-white">
                New Feature
              </span>
              <span className="text-gray-600">Build your own custom calculators</span>
            </span>
          </div>

          {/* Huge Modern Heading */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-gray-900 mb-6 sm:mb-8 leading-[1.1]"
            itemScope
            itemType="https://schema.org/WebPageElement"
          >
            Calculate Anything. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600">
              Instantly & Beautifully.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subRef}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto font-light"
            itemProp="description"
          >
            A massive library of ready-made calculators, a visual builder to design your own, and powerful widgets for your workflow. Fast, private, and 100% free.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
            <Link
              href="/calculators"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-base sm:text-lg overflow-hidden"
              aria-label="Explore all free online calculators"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Library
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Link>
            
            <Link
              href="/calculators/casio"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-800 font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all text-base sm:text-lg hover:-translate-y-1 shadow-sm"
              aria-label="Try the classic Casio calculator"
            >
              Try Classic Casio
            </Link>
          </div>
        </div>
      </section>

      {/* Moving Features Ticker Band */}
      <div className="w-full bg-white border-y border-gray-100">
        <Features />
      </div>

      {/* Separate Section for interactive stacked calculators */}
      <section className="relative py-16 sm:py-24 bg-gray-50" id="calculators-showcase">
        <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-6">
          <CalculatorStack />

          {/* View All Calculators Link Button */}
          <div className="mt-12 sm:mt-16 z-20">
            <Link
              href="/calculators"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-sm sm:text-base font-bold rounded-full hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all shadow-md"
              aria-label="View all available calculators"
            >
              View All Calculators
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

