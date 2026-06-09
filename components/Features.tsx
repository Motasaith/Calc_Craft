'use client'

import React from 'react'
import {
  Target,
  Zap,
  Shield,
  Smartphone,
  Sparkles,
  Wrench,
  Check,
  Lock,
  Globe
} from 'lucide-react'

const tickerItems = [
  { icon: Target, title: 'Accurate Results', sub: 'tested algorithms' },
  { icon: Zap, title: 'Fast & Easy', sub: 'instant response' },
  { icon: Shield, title: 'Secure & Private', sub: 'local browser run' },
  { icon: Smartphone, title: 'Mobile Friendly', sub: 'responsive layouts' },
  { icon: Sparkles, title: 'Custom Themes', sub: 'tweak your hardware look' },
  { icon: Wrench, title: 'Build Your Own', sub: 'customize widgets' },
  { icon: Check, title: '100% Free Forever', sub: 'no paid plans' },
  { icon: Lock, title: 'No Sign Up Required', sub: 'use immediately' },
  { icon: Globe, title: 'Offline Capable', sub: 'caching load' }
]

export default function Features() {
  return (
    <section 
      className="py-10 bg-white border-y border-neutral-100 overflow-hidden select-none z-20"
      aria-label="Key features and benefits of Home of Calculators calculators"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      {/* Centered Section Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono">
          Used by thousands of students, professionals & creators
        </h3>
      </div>

      {/* Ticker Loop Container */}
      <div className="relative w-full overflow-hidden" role="list">
        {/* Soft edge masking gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" aria-hidden="true" />

        {/* Infinite Moving Loop Track */}
        <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap py-2 cursor-pointer">
          {/* Set 1 */}
          <div className="flex items-center shrink-0" role="listitem">
            {tickerItems.map((item, idx) => (
              <div key={`group1-${idx}`} className="flex items-center gap-2 sm:gap-3.5 mx-6 sm:mx-12" itemScope itemType="https://schema.org/ListItem">
                <meta itemProp="position" content={String(idx + 1)} />
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-neutral-600 font-mono" itemProp="name">
                  {item.title}
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-mono lowercase hidden xs:inline">
                  ({item.sub})
                </span>
                <span className="text-neutral-200 font-extrabold ml-6 sm:ml-12 text-xs sm:text-sm font-mono" aria-hidden="true">//</span>
              </div>
            ))}
          </div>

          {/* Set 2 (Identical duplicate for seamless looping) */}
          <div className="flex items-center shrink-0" role="listitem">
            {tickerItems.map((item, idx) => (
              <div key={`group2-${idx}`} className="flex items-center gap-2 sm:gap-3.5 mx-6 sm:mx-12">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 shrink-0" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-neutral-600 font-mono">
                  {item.title}
                </span>
                <span className="text-[10px] sm:text-xs text-neutral-400 font-mono lowercase hidden xs:inline">
                  ({item.sub})
                </span>
                <span className="text-neutral-200 font-extrabold ml-6 sm:ml-12 text-xs sm:text-sm font-mono" aria-hidden="true">//</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
