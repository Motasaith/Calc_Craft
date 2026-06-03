'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Calculator,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  ArrowRight,
  Building,
  Headphones,
  ChevronRight,
  ShieldCheck,
  ArrowUp,
  CheckCircle,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  // Scroll-triggered entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-brand',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
      gsap.fromTo(
        '.footer-links',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
      gsap.fromTo(
        '.footer-bottom',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, footerRef)

    return () => ctx.revert()
  }, [])

  // Back to top visibility
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mouse tracking for background glow
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = footerRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.includes('@') && email.includes('.')) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 4000)
    }
  }

  // Mini calculator logic
  const handleCalcPress = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0')
      return
    }
    if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(calcDisplay.replace('×', '*').replace('÷', '/'))
        setCalcDisplay(String(Number(result.toFixed(4))))
      } catch {
        setCalcDisplay('Error')
        setTimeout(() => setCalcDisplay('0'), 1000)
      }
      return
    }
    if (calcDisplay === '0' && '0123456789'.includes(val)) {
      setCalcDisplay(val)
      return
    }
    if (calcDisplay.length < 10) {
      setCalcDisplay((prev) => prev + val)
    }
  }

  const socials = [
    { Icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/30' },
    { Icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600/20 hover:text-pink-400 hover:border-pink-500/30' },
    { Icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700/20 hover:text-blue-500 hover:border-blue-600/30' },
  ]

  const calcButtons = ['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '×', 'C', '0', '=', '÷']

  return (
    <footer
      ref={footerRef}
      className="bg-[#090a0c] text-slate-300 py-12 md:py-16 font-sans relative overflow-hidden"
      itemScope
      itemType="https://schema.org/WPFooter"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive mouse-following glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(99,102,241,0.06), transparent 40%)`,
        }}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/[0.015] animate-float-slow"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Background soft circular arc decoration */}
      <div className="absolute bottom-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full border border-white/[0.02] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Card Chassis Box */}
        <div
          className="bg-[#0d0e12] border border-white/[0.06] rounded-[32px] p-6 md:p-10 shadow-2xl relative backdrop-blur-sm"
          itemScope
          itemType="https://schema.org/Organization"
        >
          <meta itemProp="name" content="Calc_Craft" />
          <meta itemProp="url" content="https://calc_craft.com" />
          <meta itemProp="description" content="Your all-in-one calculator suite for math, finance, health, and everyday life." />

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Brand, Socials, and Newsletter */}
            <div className="lg:col-span-5 flex flex-col footer-brand">

              {/* Brand Heading */}
              <Link href="/" className="flex items-center gap-2.5 mb-4 group select-none">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                  <Calculator className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight group-hover:text-slate-200 transition-colors">
                  Calc_Craft
                </span>
              </Link>

              {/* Brand Description */}
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
                Your all-in-one calculator suite for math, finance, health, and everyday life.
              </p>

              {/* Social Icons row with tooltips */}
              <div className="flex gap-3 mb-8">
                {socials.map(({ Icon, href, label, color }, i) => (
                  <div key={i} className="relative">
                    <Link
                      href={href}
                      className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 transition-all duration-300 shadow-sm ${color}`}
                      onMouseEnter={() => setHoveredSocial(i)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      aria-label={`Follow Calc_Craft on ${label}`}
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-md text-[10px] font-bold text-white whitespace-nowrap transition-all duration-200 pointer-events-none ${
                        hoveredSocial === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                      }`}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Newsletter Block */}
              <div className="border-t border-white/5 pt-6">
                <div className="flex items-center gap-2 text-white font-extrabold text-xs sm:text-sm mb-2 select-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Stay Connected
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Get tips, updates, and new tools straight to your inbox.
                </p>

                {subscribed ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold animate-fade-in">
                    <CheckCircle className="w-5 h-5" />
                    <span>Thanks for subscribing!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex max-w-md w-full bg-white/5 border border-white/10 rounded-full overflow-hidden p-1.5 focus-within:border-white/25 focus-within:bg-white/[0.07] transition-all duration-300">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-transparent border-0 flex-grow px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-0"
                      required
                    />
                    <button
                      type="submit"
                      className="w-9 h-9 rounded-full bg-white text-dark-900 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-md group"
                      aria-label="Subscribe to newsletter"
                    >
                      <ArrowRight className="w-4 h-4 text-dark-900 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </form>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Nested Links Card Grid & Interactive Mini Calculator */}
            <div className="lg:col-span-7 w-full footer-links">
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-[28px] p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between gap-8 shadow-inner hover:border-white/[0.08] transition-colors duration-500">

                {/* Decorative Dot Matrix in card */}
                <div className="absolute top-6 right-6 text-white/[0.02] pointer-events-none select-none hidden md:block">
                  <svg width="60" height="60" fill="currentColor">
                    <pattern id="footer-dot-grid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                      <circle cx="1.5" cy="1.5" r="1" />
                    </pattern>
                    <rect width="60" height="60" fill="url(#footer-dot-grid)" />
                  </svg>
                </div>

                {/* 3 Columns of Links with hover effects */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 flex-grow">

                  {/* Column 1: Calculators */}
                  <div className="col-span-2 sm:col-span-1">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <Calculator className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white mb-4 tracking-wide">
                      Calculators
                    </h4>
                    <ul className="space-y-2.5">
                      {[
                        'All Calculators',
                        'Math Calculators',
                        'Finance Calculators',
                        'Health Calculators',
                      ].map((link) => (
                        <li key={link}>
                          <Link
                            href="#"
                            className="flex items-start gap-1 text-[11px] sm:text-xs text-slate-400 hover:text-white transition-all duration-200 group"
                            onMouseEnter={() => setHoveredLink(link)}
                            onMouseLeave={() => setHoveredLink(null)}
                          >
                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-all duration-200 ${
                              hoveredLink === link ? 'text-white translate-x-0.5' : 'text-slate-600'
                            }`} />
                            <span className="relative">
                              {link}
                              <span className={`absolute bottom-0 left-0 h-[1px] bg-white/40 transition-all duration-300 ${
                                hoveredLink === link ? 'w-full' : 'w-0'
                              }`} />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2: Company */}
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <Building className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white mb-4 tracking-wide">
                      Company
                    </h4>
                    <ul className="space-y-2.5">
                      {['About Us', 'Blog', 'Contact', 'Careers'].map((link) => (
                        <li key={link}>
                          <Link
                            href="#"
                            className="flex items-start gap-1 text-[11px] sm:text-xs text-slate-400 hover:text-white transition-all duration-200 group"
                            onMouseEnter={() => setHoveredLink(link)}
                            onMouseLeave={() => setHoveredLink(null)}
                          >
                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-all duration-200 ${
                              hoveredLink === link ? 'text-white translate-x-0.5' : 'text-slate-600'
                            }`} />
                            <span className="relative">
                              {link}
                              <span className={`absolute bottom-0 left-0 h-[1px] bg-white/40 transition-all duration-300 ${
                                hoveredLink === link ? 'w-full' : 'w-0'
                              }`} />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: Support */}
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <Headphones className="w-4 h-4 text-slate-400" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white mb-4 tracking-wide">
                      Support
                    </h4>
                    <ul className="space-y-2.5">
                      {['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Use'].map((link) => (
                        <li key={link}>
                          <Link
                            href="#"
                            className="flex items-start gap-1 text-[11px] sm:text-xs text-slate-400 hover:text-white transition-all duration-200 group"
                            onMouseEnter={() => setHoveredLink(link)}
                            onMouseLeave={() => setHoveredLink(null)}
                          >
                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-all duration-200 ${
                              hoveredLink === link ? 'text-white translate-x-0.5' : 'text-slate-600'
                            }`} />
                            <span className="relative">
                              {link}
                              <span className={`absolute bottom-0 left-0 h-[1px] bg-white/40 transition-all duration-300 ${
                                hoveredLink === link ? 'w-full' : 'w-0'
                              }`} />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* INTERACTIVE MINI CALCULATOR PANEL */}
                <div className="flex-shrink-0 flex flex-col items-center justify-end border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3 h-3 text-amber-500/60" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Try Me</span>
                  </div>

                  {/* Calculator Display */}
                  <div className="w-[130px] h-[32px] bg-[#0a0b0e] border border-white/10 rounded-lg flex items-center justify-end px-3 text-[12px] font-mono text-emerald-400 tracking-wider select-none relative overflow-hidden shadow-inner">
                    <span className="relative z-10">{calcDisplay}</span>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                  </div>

                  {/* Calculator Keypad */}
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    {calcButtons.map((btn) => (
                      <button
                        key={btn}
                        onClick={() => handleCalcPress(btn)}
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-black select-none transition-all duration-150 active:scale-90 ${
                          btn === '='
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
                            : btn === 'C'
                            ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20'
                            : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                        }`}
                        aria-label={btn === 'C' ? 'Clear calculator' : `Calculator button ${btn}`}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* BOTTOM BAR copyright and legal links */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 footer-bottom">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 select-none">
                © {new Date().getFullYear()} Calc_Craft. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-4 md:gap-6 text-xs text-slate-500">
              {[
                { text: 'Privacy Policy', href: '/privacy-policy' },
                { text: 'Terms of Use', href: '/terms-of-use' },
                { text: 'Cookies', href: '/cookies' },
              ].map(({ text, href }) => (
                <Link
                  key={text}
                  href={href}
                  className="relative hover:text-white transition-colors duration-200 group"
                >
                  {text}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white/30 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 z-50 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Inline styles for custom animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-15px) translateX(8px); }
          66% { transform: translateY(8px) translateX(-5px); }
        }
        .animate-float-slow {
          animation: float-slow linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </footer>
  )
}
