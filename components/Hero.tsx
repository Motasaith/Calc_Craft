'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Check } from 'lucide-react'
import gsap from 'gsap'
import DigitalText from './DigitalText'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
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
        .fromTo(
          trustRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.5'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Calculator workspace background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          {/* Content */}
          <div className="max-w-2xl mx-auto">
            {/* Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                100% Free
              </span>
              <span className="text-xs text-dark-400 font-medium">No Sign Up Required</span>
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="flex flex-col items-center gap-4 mb-8 text-4xl sm:text-6xl lg:text-8xl"
            >
              <DigitalText 
                text="SMART" 
                theme="minimal"
                className="text-dark-900 [--char-height:3rem] sm:[--char-height:4.5rem] lg:[--char-height:5.5rem]"
                animate={true}
              />
              <DigitalText 
                text="CALCULATORS" 
                theme="minimal"
                className="text-dark-900 [--char-height:2.2rem] sm:[--char-height:3.2rem] lg:[--char-height:4rem]"
                animate={true}
              />
              <span className="block text-primary-600 font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-widest uppercase font-mono mt-2">
                4 EVERY
              </span>
              <span className="block relative inline-block text-dark-900 font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-widest uppercase font-mono">
                <span className="relative z-10">CALCULATION</span>
                <span className="absolute bottom-1.5 left-0 right-0 h-3 sm:h-4 bg-primary-300/40 -skew-x-6 rounded-sm" />
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={subRef}
              className="text-lg text-dark-600 leading-relaxed mb-8 max-w-lg mx-auto"
            >
              Fast, accurate and easy to use online calculators for math, finance,
              health, and everyday needs. Built for students, professionals, and
              everyone in between.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap justify-center gap-4 mb-10">
              <Link
                href="#calculators"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-dark-800 text-white font-semibold rounded-full hover:bg-dark-700 transition-all shadow-xl shadow-dark-800/20 hover:shadow-dark-800/30 hover:-translate-y-0.5"
              >
                Explore Calculators
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/80 backdrop-blur-sm text-dark-800 font-semibold rounded-full border border-gray-200/80 hover:border-gray-300 hover:bg-white transition-all"
              >
                Try Scientific Calculator
              </Link>
            </div>

            {/* Trust */}
            <div ref={trustRef} className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm text-dark-500 font-medium">
                Trusted by <span className="text-dark-800 font-semibold">1M+</span> users worldwide
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
