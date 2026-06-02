'use client'

import { useRef, useEffect, useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'Student',
    avatar: 'SJ',
    text: 'CalcCraft is my go-to for quick calculations. It\'s fast, accurate, and super easy to use!',
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
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-container',
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

  const prev = () => setActive((a) => (a > 0 ? a - 1 : testimonials.length - 1))
  const next = () => setActive((a) => (a < testimonials.length - 1 ? a + 1 : 0))

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-dark-900 mb-3">
            What Our Users Say
          </h2>
        </div>

        <div className="testimonial-container relative max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(active, active + 3).map((t, i) => (
              <div
                key={`${active}-${i}`}
                className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-all"
              >
                <Quote className="w-8 h-8 text-primary-200 mb-4" />
                <p className="text-dark-600 text-sm leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-dark-800 text-sm">{t.name}</div>
                    <div className="text-xs text-dark-400">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mt-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-dark-600" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-dark-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
