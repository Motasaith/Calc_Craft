'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Shield,
  User,
  Smartphone,
  Lock,
  Sparkles,
  Code,
  Plus,
  Minus,
  CircleHelp,
  Headphones,
  ArrowRight,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    q: 'Are all calculators really free to use?',
    a: 'Yes! All calculators on CalcCraft are 100% free to use. No sign-up required, no hidden fees, and no usage limits. Simply choose a calculator and start calculating.',
    icon: Shield,
  },
  {
    q: 'Do I need to create an account?',
    a: 'Not at all. You can use every calculator without creating an account. However, signing up lets you save favorites and access your history.',
    icon: User,
  },
  {
    q: 'Can I use these calculators on my phone?',
    a: 'Absolutely. CalcCraft is fully responsive and works great on mobile, tablet, and desktop devices.',
    icon: Smartphone,
  },
  {
    q: 'Is my data safe when using your calculators?',
    a: 'Yes. All calculations happen in your browser. We do not store or transmit your input data to any server.',
    icon: Lock,
  },
  {
    q: 'How often are new calculators added?',
    a: 'We add new calculators regularly based on user feedback and trending needs. Check back often or subscribe to our newsletter.',
    icon: Sparkles,
  },
  {
    q: 'Can I embed calculators on my website?',
    a: 'Yes! We offer embed codes for all calculators. You can also white-label them with your own branding.',
    icon: Code,
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
    <section 
      ref={sectionRef} 
      className="py-20 lg:py-24 bg-white overflow-hidden font-sans relative"
      aria-label="Frequently asked questions about CalcCraft calculators"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      
      {/* Decorative Dot Grid Top-Right */}
      <div className="absolute top-8 right-8 text-slate-200 pointer-events-none opacity-40 select-none hidden md:block">
        <svg width="64" height="64" fill="currentColor">
          <pattern id="dot-grid-faq" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="64" height="64" fill="url(#dot-grid-faq)" />
        </svg>
      </div>

      {/* Decorative Dot Grid Middle-Left */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 text-slate-200 pointer-events-none opacity-40 select-none hidden md:block">
        <svg width="64" height="64" fill="currentColor">
          <pattern id="dot-grid-faq-2" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="64" height="64" fill="url(#dot-grid-faq-2)" />
        </svg>
      </div>

      {/* Decorative Circle Arc Bottom-Right */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full border border-slate-100 pointer-events-none select-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full border border-slate-100/50 pointer-events-none select-none" />

      {/* WATERMARK BACKGROUND LEFT (Bar Chart Card) */}
      <div className="absolute left-[-20px] 2xl:left-20 bottom-[15%] opacity-[0.25] pointer-events-none hidden xl:flex select-none scale-90 2xl:scale-100 origin-left">
        <div className="w-[120px] h-[120px] bg-white border border-slate-150 shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-3xl p-5 flex flex-col justify-end">
          <div className="flex items-end gap-2.5 h-16 w-full justify-center">
            <div className="w-2.5 bg-slate-700/20 rounded-full h-[40%]" />
            <div className="w-2.5 bg-slate-700/40 rounded-full h-[65%]" />
            <div className="w-2.5 bg-slate-700/70 rounded-full h-[90%]" />
            <div className="w-2.5 bg-slate-700/30 rounded-full h-[50%]" />
          </div>
        </div>
      </div>

      {/* WATERMARK BACKGROUND RIGHT (Double Bubble Card) */}
      <div className="absolute right-[-20px] 2xl:right-20 top-1/2 -translate-y-1/2 opacity-[0.25] pointer-events-none hidden xl:flex select-none scale-90 2xl:scale-100 origin-right">
        <div className="w-[120px] h-[120px] bg-white border border-slate-150 shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-3xl p-5 flex items-center justify-center">
          <svg className="w-16 h-16 text-slate-400" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M46 16H18C13.5817 16 10 19.5817 10 24V40C10 44.4183 13.5817 48 18 48H22L22 54L30 48H46C50.4183 48 54 44.4183 54 40V24C54 19.5817 50.4183 16 46 16Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
            <text x="32" y="38" fontSize="20" fontWeight="bold" fill="currentColor" textAnchor="middle">?!</text>
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center mb-10 select-none">
          {/* FAQ Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-700 mb-3 shadow-sm">
            <CircleHelp className="w-3.5 h-3.5 text-slate-500" />
            FAQ
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Everything you need to know about our online calculators.</p>
        </div>

        {/* Accordion Container */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-[0_15px_40px_rgba(0,0,0,0.02)] rounded-[32px] p-6 md:p-8">
          <div className="divide-y divide-slate-150">
            {faqs.map((faq, i) => {
              const Icon = faq.icon
              return (
                <div
                  key={i}
                  className="faq-item flex items-start gap-4 py-5 first:pt-0 last:pb-0"
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  {/* Left Icon circle */}
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center text-slate-600 flex-shrink-0 mt-0.5 animate-pulse-slow">
                    <Icon className="w-4.5 h-4.5 stroke-[2]" aria-hidden="true" />
                  </div>

                  {/* Question / Answer */}
                  <div className="flex-grow pt-2">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="w-full text-left font-bold text-slate-800 text-sm md:text-base hover:text-slate-900 transition-colors flex justify-between items-center"
                      aria-expanded={open === i}
                    >
                      <span itemProp="name">{faq.q}</span>
                    </button>
                    
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        open === i ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      itemScope
                      itemType="https://schema.org/Answer"
                      itemProp="acceptedAnswer"
                    >
                      <p className="text-xs md:text-sm text-slate-500 leading-relaxed pr-6" itemProp="text">
                        {faq.a}
                      </p>
                    </div>
                  </div>

                  {/* Right plus/minus toggle */}
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className={`w-8 h-8 rounded-full border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 transition-all mt-1 ${
                      open === i
                        ? 'bg-slate-100 border-slate-300 text-slate-800'
                        : 'bg-white text-slate-400 hover:border-slate-300 hover:text-slate-800'
                    }`}
                    aria-label={open === i ? 'Collapse answer' : 'Expand answer'}
                  >
                    {open === i ? (
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Contact support bar */}
        <div className="w-full max-w-2xl mx-auto bg-white border border-slate-150 shadow-[0_4px_15px_rgba(0,0,0,0.02)] rounded-3xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-8 select-none">
          <div className="flex items-center gap-2.5 text-slate-500 text-xs md:text-sm">
            <Headphones className="w-5 h-5 text-slate-500" />
            <span>Still have questions? We're here to help.</span>
          </div>
          <a
            href="mailto:support@calccraft.com"
            className="text-slate-700 hover:text-slate-900 font-extrabold flex items-center gap-1.5 text-xs md:text-sm transition-colors"
          >
            Contact support
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  )
}
