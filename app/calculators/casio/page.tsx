'use client'

import { useState } from 'react'
import CasioHeroCalculator from '@/components/CasioHeroCalculator'
import Link from 'next/link'
import { ArrowLeft, Shield, BookOpen, Link as LinkIcon, Compass, Palette } from 'lucide-react'

const THEMES = [
  { id: 'default', name: 'ClassWiz (Default)', filter: 'none', bg: 'bg-[#1c2028]', text: 'text-white border-neutral-700' },
  { id: 'vintage', name: 'Vintage 80s Grey', filter: 'grayscale(0.7) sepia(0.12) contrast(1.05) brightness(0.95)', bg: 'bg-[#5a5d64]', text: 'text-neutral-200 border-neutral-600' },
  { id: 'gold', name: 'Luxury Gold Edition', filter: 'sepia(0.75) hue-rotate(-15deg) saturate(2) brightness(0.85) contrast(1.1)', bg: 'bg-[#8a6f27]', text: 'text-yellow-100 border-yellow-700' },
  { id: 'neon', name: 'Cyberpunk Neon', filter: 'hue-rotate(240deg) saturate(2) brightness(0.85) contrast(1.15)', bg: 'bg-[#5e17eb]', text: 'text-purple-100 border-purple-700' }
]

export default function CasioPage() {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-900 transition-colors font-mono font-bold text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Calculator & Theme Selector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6 sticky top-28">
          
          {/* Theme Selector Widget */}
          <div className="w-full max-w-[340px] bg-white border border-dark-800/10 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <span className="text-[10px] font-bold tracking-widest text-dark-400 uppercase font-mono flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-primary-600" />
              Nostalgic Shell Themes
            </span>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => {
                const isActive = theme.id === selectedTheme.id
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border text-left transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]'
                        : 'bg-white hover:bg-neutral-50 text-dark-700 border-neutral-200'
                    }`}
                  >
                    {theme.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Calculator Container with Theme Filter */}
          <div 
            className="w-full flex justify-center [perspective:1200px] transition-all duration-300 ease-in-out"
            style={{ filter: selectedTheme.filter }}
          >
            <CasioHeroCalculator />
          </div>

        </div>

        {/* Right Column: SEO Content, Guidelines, Disclaimers, Links (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-900 tracking-tight mb-4">
              Classic fx-991EX Emulator
            </h1>
            <p className="text-dark-600 text-base leading-relaxed">
              An interactive, high-fidelity browser emulator of the classic scientific calculator. Built for students, engineers, and nostalgia lovers who want the tactile hardware experience on their desktop or mobile screen.
            </p>
          </div>

          {/* Strict Copyright Disclaimer Callout */}
          <div className="bg-[#eae7df]/60 border-2 border-dark-800/15 rounded-2xl p-5 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold text-dark-800 font-mono uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#dfaa44]" />
              Disclaimer &amp; Trademark Notice
            </h3>
            <p className="text-xs text-dark-500 font-mono leading-relaxed">
              <strong>CASIO, ClassWiz, fx-991EX, and fx-82MS</strong> are registered trademarks of CASIO Computer Co., Ltd. This emulator is an independent, community-driven educational application developed purely for nostalgic and non-commercial utility. It is <strong>not affiliated with, authorized, sponsored, or endorsed by CASIO</strong> in any capacity.
            </p>
          </div>

          {/* User Guidelines & Manual */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-dark-900 uppercase tracking-wider flex items-center gap-2 font-mono border-b border-dark-800/10 pb-2">
              <BookOpen className="w-4.5 h-4.5 text-primary-600" />
              How to Use &amp; Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-white border border-dark-800/10 rounded-xl p-4 shadow-sm">
                <h4 className="text-xs font-bold text-dark-800 uppercase tracking-wide font-mono">Special Keys</h4>
                <ul className="text-xs text-dark-600 space-y-2 list-disc pl-4 leading-relaxed">
                  <li><strong>SHIFT:</strong> Press to activate gold sub-labels above keys (e.g. Pi, roots).</li>
                  <li><strong>ALPHA:</strong> Press to activate pink variables and equals values.</li>
                  <li><strong>MENU SETUP:</strong> Toggles between <strong>Degree (DEG)</strong> and <strong>Radian (RAD)</strong> angle modes.</li>
                  <li><strong>DEL / AC:</strong> Delete last character or clear display respectively.</li>
                </ul>
              </div>
              <div className="space-y-3 bg-white border border-dark-800/10 rounded-xl p-4 shadow-sm">
                <h4 className="text-xs font-bold text-dark-800 uppercase tracking-wide font-mono">Keyboard Support</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-mono text-dark-600">
                  <div className="flex justify-between border-b border-neutral-100 pb-1"><span>0 - 9</span><span>Numbers</span></div>
                  <div className="flex justify-between border-b border-neutral-100 pb-1"><span>+ - * /</span><span>Operators</span></div>
                  <div className="flex justify-between border-b border-neutral-100 pb-1"><span>Enter / =</span><span>Calculate</span></div>
                  <div className="flex justify-between border-b border-neutral-100 pb-1"><span>Backspace</span><span>DEL</span></div>
                  <div className="flex justify-between border-b border-neutral-100 pb-1"><span>Esc / C</span><span>Clear (AC)</span></div>
                  <div className="flex justify-between border-b border-neutral-100 pb-1"><span>( / )</span><span>Parentheses</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Nostalgic links */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-dark-900 uppercase tracking-wider flex items-center gap-2 font-mono border-b border-dark-800/10 pb-2">
              <Compass className="w-4.5 h-4.5 text-primary-600" />
              Related Calculators &amp; Tools
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                href="/calculators"
                className="p-3 bg-white hover:bg-neutral-50 border border-dark-800/10 rounded-xl shadow-sm text-center transition-all group"
              >
                <span className="block text-xs font-mono font-bold text-dark-800 group-hover:text-primary-700">Calculators Directory</span>
                <span className="text-[10px] text-dark-400 mt-1 block">Browse all 190+ tools</span>
              </Link>
              <Link
                href="/builder"
                className="p-3 bg-white hover:bg-neutral-50 border border-dark-800/10 rounded-xl shadow-sm text-center transition-all group"
              >
                <span className="block text-xs font-mono font-bold text-dark-800 group-hover:text-primary-700">Visual Builder</span>
                <span className="text-[10px] text-dark-400 mt-1 block">Design your own calculator</span>
              </Link>
              <Link
                href="/calculators/custom"
                className="p-3 bg-white hover:bg-neutral-50 border border-dark-800/10 rounded-xl shadow-sm text-center transition-all group"
              >
                <span className="block text-xs font-mono font-bold text-dark-800 group-hover:text-primary-700">Saved Calculators</span>
                <span className="text-[10px] text-dark-400 mt-1 block">View your customizations</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
