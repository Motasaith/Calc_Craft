'use client'

import { useState, useEffect } from 'react'
import { Calculator, ChevronDown, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Calculators', href: '#calculators' },
  {
    label: 'Categories',
    href: '#',
    children: [
      { label: 'Math Calculators', href: '#' },
      { label: 'Finance Calculators', href: '#' },
      { label: 'Health Calculators', href: '#' },
      { label: 'Date & Time', href: '#' },
      { label: 'Conversion Tools', href: '#' },
    ],
  },
  { label: 'Blog', href: '#' },
  { label: 'About Us', href: '#' },
  { label: 'Contact', href: '#' },
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
        className={`flex items-center justify-between h-14 px-2 pl-5 pr-2 rounded-full transition-all duration-300 max-w-3xl w-full hover:border-gray-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-[0_12px_24px_rgba(0,0,0,0.08),_0_2px_4px_rgba(0,0,0,0.02)]'
            : 'bg-white/85 backdrop-blur-md border border-gray-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group mr-2">
          <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-dark-800/10">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-extrabold text-dark-800 tracking-wider uppercase font-mono">
            CALC_CRAFT
          </span>
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
                <button className="relative z-10 flex items-center gap-0.5 px-3 py-1.5 text-xs font-semibold text-dark-600 hover:text-dark-900 transition-colors rounded-full">
                  {link.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
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
                      className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden z-30 origin-top-left"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-xs font-medium text-dark-600 hover:text-dark-900 hover:bg-gray-50 transition-colors"
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
                className="block relative z-10 px-3 py-1.5 text-xs font-semibold text-dark-600 hover:text-dark-900 transition-colors rounded-full"
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
                      className="absolute inset-0 bg-gray-100/80 rounded-full -z-0"
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

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center">
          <Link
            href="#builder"
            className="px-4.5 py-1.5 text-xs font-bold text-white bg-dark-800 rounded-full hover:bg-dark-700 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 shadow-md shadow-dark-800/10"
          >
            Start Building
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden fixed top-20 left-4 right-4 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-40"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-bold text-dark-800 uppercase tracking-wider font-mono">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-6 py-2 text-xs font-semibold text-dark-600 hover:text-dark-900"
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
                    className="block px-3 py-2 text-xs font-semibold text-dark-700 hover:text-dark-900 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-4 flex flex-col">
                <Link
                  href="#builder"
                  className="px-4 py-2 text-xs font-bold text-white bg-dark-800 text-center rounded-full hover:bg-dark-700 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Start Building
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
