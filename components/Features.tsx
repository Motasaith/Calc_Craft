'use client'

import { useRef, useEffect } from 'react'
import { Target, Zap, Shield, Smartphone } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Target,
    title: 'Accurate Results',
    description:
      'Precision you can rely on for every calculation. Our algorithms are tested against industry standards.',
  },
  {
    icon: Zap,
    title: 'Fast \u0026 Easy',
    description:
      'Instant answers with a clean, simple interface. No learning curve — just type and calculate.',
  },
  {
    icon: Shield,
    title: 'Secure \u0026 Private',
    description:
      'Your data stays private. We don\'t store anything you calculate. Everything runs in your browser.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description:
      'Works seamlessly on all devices and screen sizes. Calculate on the go, anywhere, anytime.',
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              className="group p-6 lg:p-8 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-5 group-hover:bg-primary-50 transition-colors">
                <feature.icon className="w-6 h-6 text-dark-700 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-dark-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
