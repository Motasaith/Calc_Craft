'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    q: 'Are all calculators really free to use?',
    a: 'Yes! All calculators on CalcCraft are 100% free to use. No sign-up required, no hidden fees, and no usage limits.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'Not at all. You can use every calculator without creating an account. However, signing up lets you save favorites and access your history.',
  },
  {
    q: 'Can I use these calculators on my phone?',
    a: 'Absolutely. CalcCraft is fully responsive and works great on mobile, tablet, and desktop devices.',
  },
  {
    q: 'Is my data safe when using your calculators?',
    a: 'Yes. All calculations happen in your browser. We do not store or transmit your input data to any server.',
  },
  {
    q: 'How often are new calculators added?',
    a: 'We add new calculators regularly based on user feedback and trending needs. Check back often or subscribe to our newsletter.',
  },
  {
    q: 'Can I embed calculators on my website?',
    a: 'Yes! We offer embed codes for all calculators. You can also white-label them with your own branding.',
  },
]

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-dark-900 mb-3">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-item rounded-xl bg-white border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-dark-800 text-sm lg:text-base pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-dark-400 flex-shrink-0 transition-transform ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-sm text-dark-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
