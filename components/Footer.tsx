'use client'

import {
  Calculator,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  ArrowRight,
  Building,
  Headphones,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#090a0c] text-slate-300 py-12 md:py-16 font-sans relative overflow-hidden" itemScope itemType="https://schema.org/WPFooter">
      
      {/* Background soft circular arc decoration */}
      <div className="absolute bottom-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full border border-white/[0.02] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Card Chassis Box */}
        <div className="bg-[#0d0e12] border border-white/[0.06] rounded-[32px] p-6 md:p-10 shadow-2xl relative" itemScope itemType="https://schema.org/Organization">
          <meta itemProp="name" content="CalcCraft" />
          <meta itemProp="url" content="https://calccraft.com" />
          <meta itemProp="description" content="Your all-in-one calculator suite for math, finance, health, and everyday life." />
          
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Brand, Socials, and Newsletter */}
            <div className="lg:col-span-5 flex flex-col">
              
              {/* Brand Heading */}
              <Link href="/" className="flex items-center gap-2.5 mb-4 group select-none">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-white/20 transition-colors">
                  <Calculator className="w-5.5 h-5.5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  CalcCraft
                </span>
              </Link>
              
              {/* Brand Description */}
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
                Your all-in-one calculator suite for math, finance, health, and everyday life.
              </p>

              {/* Social Icons row */}
              <div className="flex gap-3 mb-8">
                {[
                  { Icon: Facebook, href: '#' },
                  { Icon: Twitter, href: '#' },
                  { Icon: Instagram, href: '#' },
                  { Icon: Linkedin, href: '#' },
                ].map(({ Icon, href }, i) => (
                  <Link
                    key={i}
                    href={href}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition-all shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>

              {/* Newsletter Block */}
              <div className="border-t border-white/5 pt-6">
                <div className="flex items-center gap-2 text-white font-extrabold text-xs sm:text-sm mb-2 select-none">
                  <Mail className="w-4.5 h-4.5 text-slate-400" />
                  Stay Connected
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Get tips, updates, and new tools straight to your inbox.
                </p>
                
                {/* Form Input submit row */}
                <div className="flex max-w-md w-full bg-white/5 border border-white/10 rounded-full overflow-hidden p-1.5 focus-within:border-white/20 transition-all">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent border-0 flex-grow px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-0"
                  />
                  <button className="w-9 h-9 rounded-full bg-white text-dark-900 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-md">
                    <ArrowRight className="w-4 h-4 text-dark-900" />
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Nested Links Card Grid & Mini Calculator mockup */}
            <div className="lg:col-span-7 w-full">
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-[28px] p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between gap-8 shadow-inner">
                
                {/* Decorative Dot Matrix in card */}
                <div className="absolute top-6 right-6 text-white/[0.02] pointer-events-none select-none hidden md:block">
                  <svg width="60" height="60" fill="currentColor">
                    <pattern id="footer-dot-grid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                      <circle cx="1.5" cy="1.5" r="1" />
                    </pattern>
                    <rect width="60" height="60" fill="url(#footer-dot-grid)" />
                  </svg>
                </div>

                {/* 3 Columns of Links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 flex-grow">
                  
                  {/* Column 1: Calculators */}
                  <div className="col-span-2 sm:col-span-1">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <Calculator className="w-4.5 h-4.5 text-slate-400" />
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
                            className="flex items-start gap-1 text-[11px] sm:text-xs text-slate-400 hover:text-white transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 2: Company */}
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <Building className="w-4.5 h-4.5 text-slate-400" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white mb-4 tracking-wide">
                      Company
                    </h4>
                    <ul className="space-y-2.5">
                      {['About Us', 'Blog', 'Contact', 'Careers'].map((link) => (
                        <li key={link}>
                          <Link
                            href="#"
                            className="flex items-start gap-1 text-[11px] sm:text-xs text-slate-400 hover:text-white transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: Support */}
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <Headphones className="w-4.5 h-4.5 text-slate-400" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white mb-4 tracking-wide">
                      Support
                    </h4>
                    <ul className="space-y-2.5">
                      {['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Use'].map((link) => (
                        <li key={link}>
                          <Link
                            href="#"
                            className="flex items-start gap-1 text-[11px] sm:text-xs text-slate-400 hover:text-white transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* MINI CALCULATOR PANEL (Bottom Right side) */}
                <div className="flex-shrink-0 flex flex-col items-center justify-end border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
                  
                  {/* Monochromatic Display Screen */}
                  <div className="w-[100px] h-[26px] bg-[#16171a] border border-white/10 rounded flex items-center justify-end px-2 text-[10px] font-mono text-slate-400 tracking-wider select-none relative overflow-hidden">
                    <span className="text-slate-400 font-medium">123456.00</span>
                  </div>
                  
                  {/* Operator Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {['+', '-', '×', '÷', '%'].map((op) => (
                      <div
                        key={op}
                        className="w-7 h-7 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[11px] font-black text-slate-400 select-none shadow-sm"
                      >
                        {op}
                      </div>
                    ))}
                    {/* Equal Key in white/gray */}
                    <div className="w-7 h-7 bg-white/10 border border-white/20 rounded flex items-center justify-center text-[11px] font-black text-white select-none shadow-md">
                      =
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* BOTTOM BAR copyright and legal links */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-500 select-none">
                © {new Date().getFullYear()} CalcCraft. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6 text-xs text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="w-1.5 h-1.5 rounded-full bg-white/5" />
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
              <span className="w-1.5 h-1.5 rounded-full bg-white/5" />
              <Link href="#" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}
