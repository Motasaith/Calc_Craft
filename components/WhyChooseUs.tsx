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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Image */}
          <div ref={leftRef} className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-gray-100 aspect-[4/3]">
              <Image
                src="/why_choose_calccraft.png"
                alt="Calculator workspace why choose us"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center">
              <DigitalText 
                text="50+" 
                theme="minimal" 
                className="text-dark-800 [--char-height:1.8rem] mb-2" 
                animate={true}
              />
              <span className="text-xs text-dark-400 font-medium">Calculators</span>
            </div>
          </div>

          {/* Right - Content */}
          <div ref={rightRef}>
            <span className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3 block">
              Why Choose CalcCraft?
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-dark-900 mb-6">
              Built for Accuracy.
              <br />
              Designed for You.
            </h2>
            <div className="space-y-5">
              {reasons.map((reason) => (
                <div key={reason.text} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-800">{reason.text}</h4>
                    <p className="text-sm text-dark-400 mt-0.5">{reason.sub}</p>
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
