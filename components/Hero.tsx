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
    <>
      <section
        ref={sectionRef}
        className="relative pt-20 pb-6 sm:pt-24 sm:pb-8 md:pt-28 md:pb-10 lg:pt-32 lg:pb-12 overflow-hidden flex flex-col justify-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh]"
        aria-label="Hero section - Free online calculators"
      >
        {/* Responsive Background Image — single Next/Image with object-position tweaks per breakpoint */}
        <Image
          src="/hero.png"
          alt="Calculator workspace background showing modern digital tools"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover object-[center_30%] sm:object-center pointer-events-none select-none"
        />

        {/* Subtle overlay for mobile text legibility */}
        <div className="absolute inset-0 -z-10 bg-white/15 sm:bg-white/5 pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-2 sm:pb-4 flex justify-center w-full">
          <div className="text-center w-full">
            {/* Content */}
            <div className="max-w-2xl mx-auto w-full">
              {/* Badge */}
              <div ref={badgeRef} className="inline-flex flex-wrap items-center justify-center gap-2 mb-5 sm:mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] sm:text-xs font-semibold whitespace-nowrap">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  100% Free
                </span>
                <span className="text-[11px] sm:text-xs text-dark-400 font-medium whitespace-nowrap">
                  No Sign Up Required
                </span>
              </div>

              {/* Heading - H1 for SEO */}
              <h1
                ref={headingRef}
                className="flex flex-col items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 leading-[0.95]"
                itemScope
                itemType="https://schema.org/WebPageElement"
              >
                <DigitalText
                  text="SMART"
                  theme="minimal"
                  gap={3}
                  className="text-dark-900 [--char-height:2.4rem] sm:[--char-height:3.6rem] md:[--char-height:4.5rem] lg:[--char-height:5.5rem]"
                  animate={true}
                />
                <DigitalText
                  text="CALCULATORS"
                  theme="minimal"
                  gap={2}
                  className="text-dark-900 [--char-height:1.6rem] sm:[--char-height:2.6rem] md:[--char-height:3.2rem] lg:[--char-height:4rem]"
                  animate={true}
                />
                <span className="block text-primary-600 font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-widest uppercase font-mono mt-1">
                  4 EVERY
                </span>
                <span className="block relative inline-block text-dark-900 font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-widest uppercase font-mono">
                  <span className="relative z-10">CALCULATION</span>
                  <span className="absolute bottom-1 sm:bottom-1.5 left-0 right-0 h-2.5 sm:h-3.5 md:h-4 bg-primary-300/40 -skew-x-6 rounded-sm" />
                </span>
              </h1>

              {/* Subtitle - Rich description for SEO/GEO */}
              <p
                ref={subRef}
                className="text-base sm:text-lg text-dark-600 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0"
                itemProp="description"
              >
                A complete <strong>calculator platform</strong>: 50+ ready-made calculators, a <strong>no-code visual builder</strong> to design your own, <strong>embeddable widgets</strong> for any website, and full <strong>white-labeling</strong> with your brand &amp; logo. Free forever, private by design — all math runs in your browser.
              </p>

              {/* CTAs */}
              <div ref={ctaRef} className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 w-full">
                <Link
                  href="/calculators"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 bg-dark-800 text-white font-semibold rounded-full hover:bg-dark-700 transition-all shadow-xl shadow-dark-800/20 hover:shadow-dark-800/30 hover:-translate-y-0.5 text-sm sm:text-base"
                  aria-label="Explore all free online calculators"
                >
                  Explore Calculators
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <Link
                  href="/calculators/scientific"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 bg-white/80 backdrop-blur-sm text-dark-800 font-semibold rounded-full border border-gray-200/80 hover:border-gray-300 hover:bg-white transition-all text-sm sm:text-base"
                  aria-label="Try the scientific calculator online"
                >
                  Try Scientific Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving Features Ticker Band — moved OUTSIDE hero <section> so it doesn't stretch hero height */}
      <div className="w-full">
        <Features />
      </div>

      {/* Separate Section for interactive stacked calculators */}
      <section className="relative py-12 sm:py-14 md:py-16 bg-white border-y border-gray-100" id="calculators-showcase">
        <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-6">
          <CalculatorStack />

          {/* View All Calculators Link Button */}
          <div className="mt-8 sm:mt-10 z-20">
            <Link
              href="/calculators"
              className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-dark-800 text-white text-xs sm:text-sm font-bold rounded-full hover:bg-dark-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all shadow-md font-mono"
              aria-label="View all available calculators"
            >
              View All Calculators
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
