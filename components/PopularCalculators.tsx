'use client'

import { useRef, useEffect } from 'react'
import {
  Calculator,
  FlaskConical,
  Percent,
  Heart,
  Home,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const calculators = [
  {
    icon: Calculator,
    title: 'Basic Calculator',
    description: 'Quick and simple everyday calculations.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: FlaskConical,
    title: 'Scientific Calculator',
    description: 'Advanced functions for students and professionals.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Percent,
    title: 'Percentage Calculator',
    description: 'Calculate percentages with ease.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Heart,
    title: 'BMI Calculator',
    description: 'Check your Body Mass Index in seconds.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Home,
    title: 'Loan Calculator',
    description: 'Plan loans and EMIs with confidence.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: CalendarDays,
    title: 'Age Calculator',
    description: 'Calculate age and time between dates.',
    color: 'bg-cyan-50 text-cyan-600',
  },
]

export default function PopularCalculators() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="calculators"
      className="py-20 lg:py-28 bg-gray-50/50"
      aria-label="Popular free online calculators"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="Popular Calculators" />
      <meta itemProp="description" content="Free online calculators for math, finance, health, and everyday life." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-dark-900 mb-4">
            Popular Calculators
          </h2>
          <p className="text-dark-400 max-w-lg mx-auto">
            Explore our most used <strong>free online calculators</strong> to save time and simplify your life.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {calculators.map((calc, i) => (
            <div
              key={calc.title}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 cursor-pointer"
              role="listitem"
              itemScope
              itemType="https://schema.org/SoftwareApplication"
            >
              <meta itemProp="name" content={calc.title} />
              <meta itemProp="applicationCategory" content="CalculatorApplication" />
              <meta itemProp="description" content={calc.description} />
              <div
                className={`w-12 h-12 rounded-xl ${calc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <calc.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-dark-800 mb-1" itemProp="name">{calc.title}</h3>
              <p className="text-sm text-dark-400 mb-4" itemProp="description">{calc.description}</p>
              <div className="flex items-center text-sm font-semibold text-dark-700 group-hover:text-primary-600 transition-colors">
                Try Now
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-semibold text-dark-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
            View All Calculators
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
