'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DigitalText from './DigitalText'

gsap.registerPlugin(ScrollTrigger)

const reasons = [
  { text: 'Wide Range of Tools', sub: 'From basic math to finance and health, we\'ve got it all.' },
  { text: 'Always Free', sub: 'All calculators are 100% free. No hidden subscriptions or fees.' },
  { text: 'Fully Customizable', sub: 'Tweak styling, colors, layout choices, and options to fit your needs.' },
  { text: 'Your Brand Logo', sub: 'Seamlessly integrate your company logo and corporate branding assets.' },
  { text: 'Easy Website Embedding', sub: 'Embed any calculator widget onto your own website with a copy-paste snippet.' },
  { text: 'Build From Scratch', sub: 'Create your own customized formulas and calculators from the ground up.' },
]

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
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
      className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white"
      aria-label="Why choose Home of Calculators - Benefits and features"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div ref={leftRef} className="relative order-1 lg:order-1 w-full">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 aspect-[4/3] sm:aspect-[4/3]">
              <Image
                src="/why_choose_calccraft.png"
                alt="Home of Calculators calculator workspace showing free online math, finance, and health calculators for students and professionals"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center">
              <DigitalText
                text="190"
                theme="minimal"
                className="text-dark-800 [--char-height:1rem] sm:[--char-height:1.2rem] md:[--char-height:1.8rem] mb-0.5 sm:mb-1 md:mb-2"
                animate={true}
              />
              <span className="text-[9px] sm:text-[10px] md:text-xs text-dark-400 font-medium">Calculators</span>
            </div>
          </div>

          {/* Right - Content */}
          <div ref={rightRef} itemScope itemType="https://schema.org/Service" className="order-2 lg:order-2 w-full">
            <meta itemProp="name" content="Home of Calculators Online Calculators" />
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-primary-600 uppercase mb-3 block">
              Why Choose Home of Calculators?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-dark-900 mb-5 sm:mb-6 leading-tight">
              Built for Accuracy.
              <br />
              Designed for You.
            </h2>
            <p className="text-sm sm:text-base text-dark-600 mb-5 sm:mb-6 leading-relaxed">
              Home of Calculators provides <strong>190 free online calculators</strong> for math, finance, health, and everyday needs.
              No signup required, instant results, and completely private. All calculations run locally in your browser.
            </p>
            <div className="space-y-4 sm:space-y-5" role="list">
              {reasons.map((reason, idx) => (
                <div 
                  key={reason.text} 
                  className="flex gap-4"
                  itemScope
                  itemType="https://schema.org/ListItem"
                  role="listitem"
                >
                  <meta itemProp="position" content={String(idx + 1)} />
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  </div>
                  <div itemProp="item" itemScope itemType="https://schema.org/Thing">
                    <h4 className="font-semibold text-dark-800" itemProp="name">{reason.text}</h4>
                    <p className="text-sm text-dark-400 mt-0.5" itemProp="description">{reason.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
