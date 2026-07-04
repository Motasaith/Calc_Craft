'use client'

import { useRef, useEffect } from 'react'
import { ArrowRight, Calculator, Zap, Shield, Smartphone } from 'lucide-react'
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
    <section 
      ref={sectionRef} 
      className="py-16 md:py-20 bg-white font-sans"
      aria-label="Call to action - Start using Home of Calculators calculators"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="cta-content relative overflow-hidden rounded-[36px] bg-dark-800 border border-dark-700/50 px-6 py-12 md:p-12 lg:p-16 text-left shadow-2xl animate-fade-in"
          itemScope
          itemType="https://schema.org/SoftwareApplication"
        >
          <meta itemProp="name" content="Home of Calculators" />
          <meta itemProp="applicationCategory" content="CalculatorApplication" />
          <meta itemProp="operatingSystem" content="Any" />
          <meta itemProp="offers" content="Free" />
          <meta itemProp="description" content="Free online calculators for math, finance, health, and more. Fast, accurate, and private." />
          
          {/* Decorative dot pattern inside card (Top Right) */}
          <div className="absolute top-6 right-6 text-white/[0.03] pointer-events-none select-none">
            <svg width="100" height="100" fill="currentColor">
              <pattern id="cta-dot-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" />
              </pattern>
              <rect width="100" height="100" fill="url(#cta-dot-grid)" />
            </svg>
          </div>

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Neumorphic realistic calculator */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="w-[240px] sm:w-[280px] bg-[#f1f4f6] border-[5px] border-slate-50 shadow-[0_15px_30px_rgba(0,0,0,0.3),_inset_-3px_-3px_7px_#ffffff,_inset_3px_3px_7px_rgba(0,0,0,0.1)] rounded-[32px] p-4 flex flex-col gap-3">
                {/* LCD Display */}
                <div className="w-full h-14 bg-[#b8c29b] border-2 border-slate-200/50 rounded-xl shadow-[inset_2px_3px_5px_rgba(0,0,0,0.25)] flex items-center justify-end px-4 select-none relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5 pointer-events-none" />
                  <span className="text-[#20271c] font-mono text-[13px] sm:text-[14px] md:text-[15px] tracking-widest font-black uppercase text-right w-full">
                    {"LET'S CALCULATE"}
                  </span>
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1 */}
                  {['MC', 'MR', 'M-', 'M+'].map((key) => (
                    <div key={key} className="h-9 rounded-lg bg-slate-200/80 border border-slate-300/30 flex items-center justify-center text-[10px] font-extrabold text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.06),_inset_0_-1.5px_0_#cbd5e1] hover:brightness-95 select-none">{key}</div>
                  ))}

                  {/* Row 2 */}
                  {['7', '8', '9'].map((key) => (
                    <div key={key} className="h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[12px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.05),_inset_0_-1.5px_0_#e2e8f0] hover:brightness-98 select-none">{key}</div>
                  ))}
                  <div className="h-9 rounded-lg bg-slate-200/80 border border-slate-300/30 flex items-center justify-center text-[13px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.06),_inset_0_-1.5px_0_#cbd5e1] hover:brightness-95 select-none">÷</div>

                  {/* Row 3 */}
                  {['4', '5', '6'].map((key) => (
                    <div key={key} className="h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[12px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.05),_inset_0_-1.5px_0_#e2e8f0] hover:brightness-98 select-none">{key}</div>
                  ))}
                  <div className="h-9 rounded-lg bg-slate-200/80 border border-slate-300/30 flex items-center justify-center text-[12px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.06),_inset_0_-1.5px_0_#cbd5e1] hover:brightness-95 select-none">×</div>

                  {/* Row 4 */}
                  {['1', '2', '3'].map((key) => (
                    <div key={key} className="h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[12px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.05),_inset_0_-1.5px_0_#e2e8f0] hover:brightness-98 select-none">{key}</div>
                  ))}
                  <div className="h-9 rounded-lg bg-slate-200/80 border border-slate-300/30 flex items-center justify-center text-[14px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.06),_inset_0_-1.5px_0_#cbd5e1] hover:brightness-95 select-none">-</div>

                  {/* Row 5 */}
                  <div className="h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[12px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.05),_inset_0_-1.5px_0_#e2e8f0] hover:brightness-98 select-none">0</div>
                  <div className="h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[12px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.05),_inset_0_-1.5px_0_#e2e8f0] hover:brightness-98 select-none">.</div>
                  <div className="h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[11px] font-black text-slate-700 shadow-[0_1.5px_3px_rgba(0,0,0,0.05),_inset_0_-1.5px_0_#e2e8f0] hover:brightness-98 select-none">+/-</div>
                  <div className="h-9 rounded-lg bg-amber-500 border border-amber-600/30 flex items-center justify-center text-[13px] font-black text-white shadow-[0_1.5px_4px_rgba(245,158,11,0.3),_inset_0_-1.5px_0_#b45309] hover:brightness-105 active:scale-95 select-none">=</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Text & CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left lg:pl-4">
              {/* Top icon badge */}
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner select-none">
                <Calculator className="w-6 h-6 text-white" />
              </div>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                Ready to Make Calculations Effortless?
              </h2>

              {/* Subtitle */}
              <p className="text-slate-400 mb-8 text-sm sm:text-base leading-relaxed max-w-xl">
                Join millions who trust <strong className="text-slate-300">Home of Calculators</strong> for quick, accurate, and reliable <strong className="text-slate-300">free online calculators</strong>. No signup required.
              </p>

              {/* CTA Button */}
              <div className="mb-10">
                <Link
                  href="#calculators"
                  className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-dark-900 font-extrabold rounded-full hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95"
                >
                  Start Calculating Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Three features under CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5 w-full">
                {/* Feature 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 flex-shrink-0 shadow-inner">
                    <Zap className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left select-none">
                    <div className="font-extrabold text-white text-xs sm:text-sm">Fast & Accurate</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Millisecond response</div>
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 flex-shrink-0 shadow-inner">
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left select-none">
                    <div className="font-extrabold text-white text-xs sm:text-sm">Safe & Private</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Local processing</div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 flex-shrink-0 shadow-inner">
                    <Smartphone className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left select-none">
                    <div className="font-extrabold text-white text-xs sm:text-sm">Works on Any Device</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Fully responsive</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
