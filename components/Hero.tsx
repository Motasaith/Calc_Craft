'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Camera, Check } from 'lucide-react'
import gsap from 'gsap'
import Features from './Features'
import CalculatorStack from './CalculatorStack'
import HeroSearch from './HeroSearch'

const trustPoints = ['500+ free tools', 'No sign-up required', 'Private by default']

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(copyRef.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      gsap.fromTo(panelRef.current, { opacity: 0, y: 34, rotate: 1 }, { opacity: 1, y: 0, rotate: 0, duration: 0.9, delay: 0.12, ease: 'power3.out' })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <section ref={sectionRef} className="relative min-h-[760px] overflow-hidden bg-[#f7f5ef] pb-20 pt-32 sm:pt-36 lg:flex lg:min-h-[820px] lg:items-center lg:pb-24 lg:pt-32" aria-label="Hero section - Free online calculators">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -right-32 top-16 h-[520px] w-[520px] rounded-full bg-sky-200/55 blur-[120px]" />
          <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-amber-100/70 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.24]" style={{ backgroundImage: 'radial-gradient(rgba(15,15,18,.22) 0.8px, transparent 0.8px)', backgroundSize: '22px 22px', maskImage: 'linear-gradient(to bottom, black, transparent 78%)' }} />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1320px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 xl:gap-24">
          <div ref={copyRef} className="max-w-2xl">
            <h1 className="text-balance text-[2.8rem] font-extrabold leading-[0.98] tracking-[-0.055em] text-dark-900 sm:text-6xl lg:text-[4.35rem]">
              The right calculator,
              <span className="mt-2 block text-primary-700">right when you need it.</span>
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-dark-500 sm:text-xl">
              Search hundreds of accurate calculators, solve a math problem from a photo, or build a tool of your own.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/calculators" className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-dark-900 px-6 text-sm font-extrabold text-white shadow-[0_5px_0_#dfaa44] transition-all hover:-translate-y-0.5 hover:bg-dark-800">
                Explore calculators
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/solver" className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-primary-700/20 bg-white/70 px-6 text-sm font-extrabold text-primary-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white">
                <Camera className="h-4 w-4" />
                Snap & solve with AI
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {trustPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-500">
                  <Check className="h-3.5 w-3.5 text-primary-700" />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div ref={panelRef} className="relative mx-auto w-full max-w-[590px]">
            <div className="absolute -inset-4 rotate-2 rounded-[34px] border border-dark-800/10 bg-[#dfaa44]/35" aria-hidden="true" />
            <div className="relative rounded-[30px] border border-dark-800/15 bg-white/90 p-5 shadow-[0_24px_70px_rgba(26,26,31,0.14)] backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-dark-800/10 pb-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary-700">Quick start</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-tight text-dark-900">What do you need to calculate?</h2>
                </div>
              </div>

              <HeroSearch />

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href="/builder" className="group rounded-2xl border border-dark-800/10 bg-[#f7f5ef] p-4 transition-all hover:border-primary-300 hover:bg-primary-50">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">Create your own</span>
                  <span className="mt-1 flex items-center justify-between text-sm font-extrabold text-dark-800">Visual Builder<ArrowRight className="h-4 w-4 text-primary-700 transition-transform group-hover:translate-x-1" /></span>
                </Link>
                <Link href="/calculators/casio" className="group rounded-2xl border border-dark-800/10 bg-[#f7f5ef] p-4 transition-all hover:border-primary-300 hover:bg-primary-50">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">Open instantly</span>
                  <span className="mt-1 flex items-center justify-between text-sm font-extrabold text-dark-800">Classic Calculator<ArrowRight className="h-4 w-4 text-primary-700 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </div>
              <div className="mt-5 rounded-2xl bg-dark-900 px-4 py-3 text-center font-mono text-sm text-white"><span className="text-primary-300">sin²θ + cos²θ</span> = 1</div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full border-y border-gray-100 bg-white"><Features /></div>
      <section className="relative bg-gray-50 py-16 sm:py-24" id="calculators-showcase">
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 sm:px-6">
          <CalculatorStack />
          <div className="z-20 mt-12 sm:mt-16">
            <Link href="/calculators" className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-1 hover:bg-gray-800 hover:shadow-xl active:scale-95 sm:text-base">
              View All Calculators
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
