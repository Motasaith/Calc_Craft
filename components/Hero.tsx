'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import gsap from 'gsap'
import DigitalText from './DigitalText'
import CalculatorStack from './CalculatorStack'
import Features from './Features'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
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
          headingRef.current,
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
    <section
      ref={sectionRef}
      className="relative min-h-screen pt-20 sm:pt-24 lg:pt-24 pb-12 overflow-hidden"
      aria-label="Hero section - Free online calculators"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-10 bg-gray-100 bg-[url('/hero.png')] bg-contain bg-top bg-no-repeat"
        role="img"
        aria-label="Calculator workspace background showing modern digital tools"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-6 sm:pb-8 flex justify-center">
        <div className="text-center">
          {/* Content */}
          <div className="max-w-2xl mx-auto">
            {/* Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                100% Free
              </span>
              <span className="text-xs text-dark-400 font-medium">No Sign Up Required</span>
            </div>

            {/* Heading - H1 for SEO */}
            <h1
              ref={headingRef}
              className="flex flex-col items-center gap-2 mb-8 text-4xl sm:text-6xl lg:text-8xl"
              itemScope
              itemType="https://schema.org/WebPageElement"
            >
              <DigitalText
                text="SMART"
                theme="minimal"
                gap={3}
                className="text-dark-900 [--char-height:3rem] sm:[--char-height:4.5rem] lg:[--char-height:5.5rem]"
                animate={true}
              />
              <DigitalText
                text="CALCULATORS"
                theme="minimal"
                gap={2}
                className="text-dark-900 [--char-height:2.2rem] sm:[--char-height:3.2rem] lg:[--char-height:4rem]"
                animate={true}
              />
              <span className="block text-primary-600 font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-widest uppercase font-mono mt-1">
                4 EVERY
              </span>
              <span className="block relative inline-block text-dark-900 font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-widest uppercase font-mono">
                <span className="relative z-10">CALCULATION</span>
                <span className="absolute bottom-1.5 left-0 right-0 h-3 sm:h-4 bg-primary-300/40 -skew-x-6 rounded-sm" />
              </span>
            </h1>

            {/* Subtitle - Rich description for SEO/GEO */}
            <p
              ref={subRef}
              className="text-lg text-dark-600 leading-relaxed mb-8 max-w-lg mx-auto"
              itemProp="description"
            >
              Fast, accurate and easy to use online calculators for math, finance,
              health, and everyday needs. Built for students, professionals, and
              everyone in between. No signup required — start calculating instantly.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap justify-center gap-4">
              <Link
                href="#calculators"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-dark-800 text-white font-semibold rounded-full hover:bg-dark-700 transition-all shadow-xl shadow-dark-800/20 hover:shadow-dark-800/30 hover:-translate-y-0.5"
                aria-label="Explore all free online calculators"
              >
                Explore Calculators
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/80 backdrop-blur-sm text-dark-800 font-semibold rounded-full border border-gray-200/80 hover:border-gray-300 hover:bg-white transition-all"
                aria-label="Try the scientific calculator online"
              >
                Try Scientific Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Moving Features Ticker Band directly below Hero text/CTAs */}
      <div className="w-full mt-10">
        <Features />
      </div>

      {/* Interactive Stack of Calculators - Direct child of section for full width */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center mt-6">
        <CalculatorStack />
        {/* View All Calculators Link Button */}
        <div className="mt-8 z-20">
          <Link
            href="#calculators"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-dark-800 text-white text-sm font-bold rounded-full hover:bg-dark-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all shadow-md"
            aria-label="View all available calculators"
          >
            View All Calculators
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
