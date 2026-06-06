'use client'

import { useState, useEffect } from 'react'
import { Calculator, ChevronDown, Menu, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Calculators', href: '/calculators' },
  { label: 'Visual Builder', href: '/builder' },
  {
    label: 'Categories',
    href: '/calculators',
    children: [
      { label: 'Math Calculators', href: '/calculators?category=math' },
      { label: 'Finance Calculators', href: '/calculators?category=finance' },
      { label: 'Health Calculators', href: '/calculators?category=health' },
      { label: 'Date & Time', href: '/calculators?category=date-time' },
      { label: 'Conversion Tools', href: '/calculators?category=conversion' },
      { label: 'Everyday Tools', href: '/calculators?category=everyday' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div
        className={`flex items-center justify-between h-14 px-2 pl-3 pr-2 rounded-2xl transition-all duration-300 max-w-5xl w-full hover:border-dark-800/30 ${
          scrolled
            ? 'bg-[#eae7df]/95 backdrop-blur-xl border border-dark-800/20 shadow-[0_12px_28px_rgba(26,32,25,0.12),_0_2px_4px_rgba(0,0,0,0.04)]'
            : 'bg-[#eae7df]/85 backdrop-blur-md border border-dark-800/15 shadow-[0_6px_22px_rgba(26,32,25,0.08)]'
        }`}
      >
        {/* Logo — matches retro calculator shell style */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group mr-2"
          aria-label="Calc_Craft Home"
        >
          <div className="relative w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-dark-800/20 ring-1 ring-dark-900/20">
            <Calculator className="w-4 h-4 text-white" />
            {/* tiny LED indicator dot */}
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-extrabold text-dark-800 tracking-wider uppercase font-mono">
              CALC<span className="text-primary-600">_</span>CRAFT
            </span>
            <span className="text-[8px] font-mono text-dark-500 uppercase tracking-[0.18em] mt-0.5">
              v2.0 // ONLINE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center gap-0.5 relative py-1"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {navLinks.map((link, idx) => {
            const isHovered = hoveredIdx === idx

            const linkContent = link.children ? (
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="relative z-10 flex items-center gap-0.5 px-3 py-1.5 text-[11px] font-bold font-mono uppercase tracking-wider text-dark-700 hover:text-dark-900 transition-colors rounded-lg">
                  {link.label}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 w-60 bg-[#eae7df] rounded-xl shadow-xl border border-dark-800/15 py-2 overflow-hidden z-30 origin-top-left"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-[11px] font-mono font-semibold text-dark-700 hover:text-dark-900 hover:bg-[#dad6cd] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={link.href}
                className="block relative z-10 px-3 py-1.5 text-[11px] font-bold font-mono uppercase tracking-wider text-dark-700 hover:text-dark-900 transition-colors rounded-lg"
              >
                {link.label}
              </Link>
            )

            return (
              <div
                key={link.label}
                className="relative flex items-center py-1 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-[#dad6cd] rounded-lg -z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                </AnimatePresence>
                {linkContent}
              </div>
            )
          })}
        </nav>

        {/* Desktop CTA — retro calculator key style */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/calculators"
            className="group relative inline-flex items-center justify-center gap-2 h-10 px-4 bg-[#dfaa44] text-dark-900 text-[11px] font-extrabold font-mono uppercase tracking-wider rounded-lg border border-[#be8b32] shadow-[0_2px_0_#be8b32] hover:bg-[#e5b44e] hover:translate-y-px hover:shadow-[0_1px_0_#be8b32] active:translate-y-[2px] active:shadow-none transition-all"
            aria-label="Explore all free online calculators"
          >
            <span>= EXPLORE</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-[#dad6cd] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu — matches retro theme */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden fixed top-20 left-4 right-4 bg-[#eae7df] rounded-2xl border border-dark-800/20 shadow-xl overflow-hidden z-40"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="space-y-1">
                    <div className="px-3 py-1.5 text-[9px] font-bold text-dark-500 uppercase tracking-[0.18em] font-mono">
                      // {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-6 py-2 text-[11px] font-mono font-semibold text-dark-700 hover:text-dark-900"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-dark-700 hover:text-dark-900 rounded-lg hover:bg-[#dad6cd]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-4 flex flex-col">
                <Link
                  href="/calculators"
                  className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-extrabold font-mono uppercase tracking-wider text-dark-900 bg-[#dfaa44] rounded-lg border border-[#be8b32] shadow-[0_2px_0_#be8b32] active:translate-y-[2px] active:shadow-none transition-all"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Explore all free online calculators"
                >
                  <span>= EXPLORE CALCULATORS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
