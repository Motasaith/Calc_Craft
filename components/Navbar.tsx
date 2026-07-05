'use client'

import { useState, useEffect } from 'react'
import { Calculator, ChevronDown, Menu, X, ArrowRight, User as UserIcon, LogOut } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND } from '@/lib/brand'
import { calculators, CATEGORY_LABELS, CATEGORY_COLORS, type CalculatorCategory } from '@/lib/calculators'
import { useAuth } from '@/components/providers/AuthContext'
import AuthModal from '@/components/AuthModal'

const navLinks = [
  { label: 'Calculators', href: '/calculators', isMega: true },
  { label: 'Visual Builder', href: '/builder' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const { user, logout, isLoading } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory>('math')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

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
        className={`flex items-center justify-between h-20 px-4 pl-5 pr-4 rounded-2xl transition-all duration-300 max-w-7xl w-full hover:border-dark-800/30 shadow-[0_6px_0_rgba(26,32,25,0.9),0_8px_16px_rgba(26,32,25,0.15)] ${
          scrolled
            ? 'bg-[#eae7df]/95 backdrop-blur-xl border border-dark-800/20'
            : 'bg-[#eae7df]/85 backdrop-blur-md border border-dark-800/15'
        }`}
      >
        {/* Logo — matches retro calculator shell style */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group mr-2"
          aria-label={`${BRAND.name} Home`}
        >
          <Image src="/logo.webp" alt="" width={58} height={58} className="object-contain rounded-xl group-hover:scale-105 transition-transform shadow-md" priority />
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-extrabold text-dark-800 tracking-wider uppercase font-mono">
              Home<span className="text-primary-700"> of </span>Calculators
            </span>
            <span className="text-[9px] font-mono text-dark-500 uppercase tracking-[0.18em] mt-1">
              {BRAND.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center gap-3 relative py-1"
          onMouseLeave={() => {
            setHoveredIdx(null)
          }}
        >
          {navLinks.map((link, idx) => {
            const isHovered = hoveredIdx === idx

            const linkContent = link.isMega ? (
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <Link
                  href={link.href}
                  className="relative z-10 flex items-center gap-0.5 px-3.5 py-2 text-[13px] font-bold font-mono uppercase tracking-wider text-dark-700 hover:text-dark-900 transition-colors rounded-lg"
                >
                  {link.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      megaMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Link>
                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 w-[700px] bg-[#eae7df] rounded-2xl shadow-2xl border border-dark-800/15 overflow-hidden z-30 origin-top-left flex"
                    >
                      {/* Left Column: Categories */}
                      <div className="w-[220px] border-r border-dark-800/10 p-4 bg-[#dad6cd]/20 space-y-1">
                        <div className="text-[10px] font-mono font-bold text-dark-400 uppercase tracking-widest px-3 mb-2">Categories</div>
                        {Object.keys(CATEGORY_LABELS).map((catKey) => {
                          const cat = catKey as CalculatorCategory
                          const label = CATEGORY_LABELS[cat]
                          const isActive = activeCategory === cat
                          const count = calculators.filter((c) => c.category === cat).length
                          return (
                            <div
                              key={cat}
                              onMouseEnter={() => setActiveCategory(cat)}
                              className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150 ${
                                isActive
                                  ? 'bg-[#dad6cd] shadow-inner text-dark-900 font-bold border-l-4 border-primary-600 pl-2'
                                  : 'text-dark-600 hover:text-dark-900 hover:bg-[#dad6cd]/50'
                              }`}
                            >
                              <span className="text-xs font-mono uppercase tracking-wide">{label}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-dark-900/10 text-dark-600">
                                {count}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Right Column: Calculators Grid */}
                      <div className="flex-1 p-5 flex flex-col justify-between max-h-[440px]">
                        <div>
                          <div className="text-[10px] font-mono font-bold text-dark-400 uppercase tracking-widest mb-3">
                            {CATEGORY_LABELS[activeCategory]} Calculators
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin">
                            {calculators
                              .filter((c) => c.category === activeCategory)
                              .map((calc) => (
                                <Link
                                  key={calc.slug}
                                  href={`/calculators/${calc.slug}`}
                                  className="group flex items-center gap-2 text-xs text-dark-700 hover:text-primary-700 transition-colors py-1 truncate"
                                  onClick={() => setMegaMenuOpen(false)}
                                >
                                  <span className="w-1 h-1 rounded-full bg-dark-400 group-hover:bg-primary-600 transition-colors shrink-0" />
                                  <span className="font-semibold truncate">{calc.name}</span>
                                </Link>
                              ))}
                          </div>
                        </div>
                        <div className="pt-3 border-t border-dark-800/10 flex items-center justify-between text-[11px] mt-4">
                          <span className="text-dark-500 font-medium">
                            Need a custom calculation?
                          </span>
                          <Link
                            href="/builder"
                            className="font-bold text-primary-600 hover:underline flex items-center gap-1"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            Open Visual Builder <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={link.href}
                className="block relative z-10 px-3.5 py-2 text-[13px] font-bold font-mono uppercase tracking-wider text-dark-700 hover:text-dark-900 transition-colors rounded-lg"
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

        {/* Desktop Auth / CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {!isLoading && (
            user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#dad6cd]/50 hover:bg-[#dad6cd] border border-dark-800/10 rounded-xl text-xs font-mono font-bold text-dark-800 transition-colors shadow-sm"
                >
                  <UserIcon className="w-4 h-4 text-primary-700" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-dark-500" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-48 bg-[#eae7df] border-2 border-dark-800/15 rounded-xl shadow-lg z-20 py-1 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-dark-800/10">
                          <p className="text-[10px] font-mono text-dark-400 uppercase tracking-wider">Signed in as</p>
                          <p className="text-xs font-bold text-dark-800 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout()
                            setProfileDropdownOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalTab('login')
                  setAuthModalOpen(true)
                }}
                className="px-4 h-12 flex items-center justify-center border border-dark-800/20 bg-[#eae7df]/20 hover:bg-[#dad6cd]/50 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-dark-700 whitespace-nowrap transition-all shadow-sm active:translate-y-px"
              >
                Sign In
              </button>
            )
          )}

          <Link
            href="/calculators"
            className="group relative inline-flex items-center justify-center gap-2 h-12 px-5 bg-[#dfaa44] text-dark-900 text-[13px] font-extrabold font-mono uppercase tracking-wider rounded-lg border border-[#be8b32] shadow-[0_3px_0_#be8b32] hover:bg-[#e5b44e] hover:translate-y-px hover:shadow-[0_1.5px_0_#be8b32] active:translate-y-[2px] active:shadow-none transition-all"
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
            className="lg:hidden fixed top-24 left-4 right-4 bg-[#eae7df] rounded-2xl border border-dark-800/20 shadow-xl overflow-hidden z-40 max-h-[75vh] overflow-y-auto"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                if (link.isMega) {
                  return (
                    <div key={link.label} className="space-y-1">
                      <Link
                        href={link.href}
                        className="block px-3 py-2 text-[13px] font-mono font-bold uppercase tracking-wider text-dark-700 hover:text-dark-900 rounded-lg hover:bg-[#dad6cd]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                      <div className="pl-4 border-l border-dark-800/10 space-y-1 max-h-[220px] overflow-y-auto">
                        {Object.keys(CATEGORY_LABELS).map((catKey) => {
                          const cat = catKey as CalculatorCategory
                          const label = CATEGORY_LABELS[cat]
                          return (
                            <Link
                              key={cat}
                              href={`/calculators?category=${cat}`}
                              className="block px-3 py-1 text-[12px] font-mono font-semibold text-dark-500 hover:text-dark-900"
                              onClick={() => setMobileOpen(false)}
                            >
                              {label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                }
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block px-3 py-2 text-[13px] font-mono font-bold uppercase tracking-wider text-dark-700 hover:text-dark-900 rounded-lg hover:bg-[#dad6cd]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="pt-4 flex flex-col gap-2.5 border-t border-dark-800/10 mt-2">
                {!isLoading && (
                  user ? (
                    <div className="bg-[#dad6cd]/30 rounded-xl p-3 flex flex-col gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-dark-800 truncate">{user.name}</span>
                          <span className="text-[10px] text-dark-400 truncate">{user.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setMobileOpen(false)
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono font-bold text-red-600 bg-red-50 hover:bg-red-100/70 rounded-lg transition-colors border border-red-200/50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setAuthModalTab('login')
                          setAuthModalOpen(true)
                          setMobileOpen(false)
                        }}
                        className="flex-1 py-2.5 border border-dark-800/20 hover:bg-[#dad6cd]/50 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-dark-700 transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setAuthModalTab('register')
                          setAuthModalOpen(true)
                          setMobileOpen(false)
                        }}
                        className="flex-1 py-2.5 bg-[#dad6cd]/80 hover:bg-[#dad6cd] border border-dark-800/20 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-dark-900 transition-colors"
                      >
                        Register
                      </button>
                    </div>
                  )
                )}

                <Link
                  href="/calculators"
                  className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-[13px] font-extrabold font-mono uppercase tracking-wider text-dark-900 bg-[#dfaa44] rounded-lg border border-[#be8b32] shadow-[0_3px_0_#be8b32] active:translate-y-[2px] active:shadow-none transition-all"
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </motion.header>
  )
}

