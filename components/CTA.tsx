'use client'

import { useRef, useEffect } from 'react'
import { ArrowRight, Calculator } from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-content',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-content relative overflow-hidden rounded-3xl bg-dark-800 px-8 py-16 lg:px-16 lg:py-20 text-center">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Ready to Make Calculations Effortless?
            </h2>
            <p className="text-dark-300 mb-8">
              Join millions who trust CalcCraft for quick, accurate, and reliable calculations.
            </p>
            <Link
              href="#"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-800 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-xl"
            >
              Start Calculating Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
