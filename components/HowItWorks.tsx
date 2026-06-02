'use client'

import { useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '1',
    title: 'Choose a Calculator',
    description: 'Browse or search for the calculator you need.',
  },
  {
    number: '2',
    title: 'Enter Values',
    description: 'Input your numbers and let our tool do the math.',
  },
  {
    number: '3',
    title: 'Get Instant Results',
    description: 'View accurate results in a fraction of a second.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])

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
            delay: i * 0.2,
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

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-dark-900 mb-3">
            How It Works
          </h2>
          <p className="text-dark-400">Get started in 3 simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => {
                if (el) stepsRef.current[i] = el
              }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-dark-800 text-white flex items-center justify-center text-xl font-bold mb-5 shadow-lg shadow-dark-800/20">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-dark-800 mb-2">{step.title}</h3>
              <p className="text-sm text-dark-400 max-w-xs">{step.description}</p>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)]">
                  <ArrowRight className="w-5 h-5 text-gray-300 absolute right-0 -translate-y-1/2" />
                  <div className="h-px bg-gray-200 absolute left-0 right-6 top-0 -translate-y-1/2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
