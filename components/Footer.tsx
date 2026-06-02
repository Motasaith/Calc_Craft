'use client'

import { Calculator, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  Calculators: [
    'All Calculators',
    'Math Calculators',
    'Finance Calculators',
    'Health Calculators',
  ],
  Company: ['About Us', 'Blog', 'Contact', 'Careers'],
  Support: ['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Use'],
}

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <Calculator className="w-5 h-5 text-dark-800" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                CalcCraft
              </span>
            </Link>
            <p className="text-sm text-dark-400 leading-relaxed max-w-sm mb-6">
              Your all-in-one calculator suite for math, finance, health, and everyday life.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-dark-800 flex items-center justify-center hover:bg-dark-700 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-dark-400 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Stay Connected
            </h4>
            <p className="text-sm text-dark-400 mb-4">
              Get tips, updates, and new tools straight to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-l-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button className="px-4 py-2.5 bg-primary-600 text-white rounded-r-lg hover:bg-primary-500 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-500">
            © {new Date().getFullYear()} CalcCraft. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-dark-500 hover:text-dark-300">
              Privacy
            </Link>
            <Link href="#" className="text-xs text-dark-500 hover:text-dark-300">
              Terms
            </Link>
            <Link href="#" className="text-xs text-dark-500 hover:text-dark-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
