'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Calculator,
  Wrench,
  Globe,
  Palette,
  Code2,
  Shield,
  Plus,
  Minus,
  CircleHelp,
  Headphones,
  ArrowRight,
  Wrench as WrenchIcon,
} from 'lucide-react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Each FAQ is tagged with a platform capability so visitors see at a
// glance which feature the question relates to.
type CapabilityKey = 'library' | 'builder' | 'embed' | 'whitelabel' | 'json' | 'privacy'

const CAPABILITY_META: Record<CapabilityKey, { label: string; gradient: string; tint: string; icon: any }> = {
  library: { label: 'Calculators', gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800 border-neutral-200', icon: Calculator },
  builder: { label: 'Visual Builder', gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800 border-neutral-200', icon: Wrench },
  embed: { label: 'Embed & Widgets', gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800 border-neutral-200', icon: Globe },
  whitelabel: { label: 'White-Label', gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800 border-neutral-200', icon: Palette },
  json: { label: 'JSON / Backup', gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800 border-neutral-200', icon: Code2 },
  privacy: { label: 'Privacy', gradient: 'from-dark-900 to-dark-800', tint: 'bg-neutral-100 text-dark-800 border-neutral-200', icon: Shield },
}

const FAQS: { q: string; a: string; capability: CapabilityKey; link?: { label: string; href: string } }[] = [
  // ─── LIBRARY ───
  {
    capability: 'library',
    q: 'How many calculators do you offer, and what categories are covered?',
    a: 'We offer 500+ ready-made calculators across 9 categories: math, finance, health, conversion, datetime, statistics, trigonometry, geometry, and everyday tools. New calculators are added regularly based on user feedback. Every calculator is free, browser-based, and works without any signup.',
    link: { label: 'Browse the full library', href: '/calculators' },
  },
  {
    capability: 'library',
    q: 'Do I need an account to use a calculator?',
    a: "No. Home of Calculators never requires an account. You can open any calculator and start using it immediately. Custom calculators you build are stored locally in your browser's localStorage, so no server account is needed.",
  },

  // ─── VISUAL BUILDER ───
  {
    capability: 'builder',
    q: 'What is the visual builder, and do I need to know how to code?',
    a: "The visual builder is a drag-and-drop, WordPress-style editor for creating custom calculators, entirely without writing code. You add input fields (Number, Slider, Select, Checkbox), write formulas using a built-in math function reference, pick a theme, and add your own logo. The result is a fully working calculator you can save, share, or embed. We also provide 6 ready-made templates (BMI, Tip, Discount, Compound Interest, Circle, plus a blank canvas) so you can get started in seconds.",
    link: { label: 'Open the builder', href: '/builder' },
  },
  {
    capability: 'builder',
    q: 'What math functions and constants are available in formulas?',
    a: 'The visual builder supports a complete math library: arithmetic (+, -, *, /, %, ^), sqrt, pow, abs, round, floor, ceil, sin, cos, tan, log (natural log), plus the constants pi and e. You can click any function in the Insertion Panel to add it without typing. All formulas are evaluated with BigNumber precision (64-128 digits) so there are no rounding errors.',
  },
  {
    capability: 'builder',
    q: 'Can I undo changes while building?',
    a: 'Yes. The builder maintains a 50-step undo/redo history. Use Ctrl+Z (or ⌘Z on Mac) to undo, Ctrl+Y (or ⌘Y) to redo. You can also click the undo/redo buttons in the toolbar. Every change is also auto-saved as a draft in your browser so you can close the tab and come back later.',
  },

  // ─── EMBED ───
  {
    capability: 'embed',
    q: 'How do I embed a Home of Calculators calculator on my own website?',
    a: "Click the Share button on any calculator (or on a custom one you built) to get an iframe embed snippet. The snippet is a single <iframe> tag you can drop into any HTML page, blog post, Shopify store, Notion page, or anywhere else that supports iframes. You can configure the width, height, and the calculator will look and behave exactly as it does on homeofcalculators.com.",
    link: { label: 'See an embedded example', href: '/calculators/bmi' },
  },
  {
    capability: 'embed',
    q: 'Will the embedded calculator slow down my website?',
    a: "No. The embedded widget is a single iframe that loads independently from your page. It only loads the calculator's JavaScript when a user scrolls to it, so it won't impact your initial page load. All calculations run inside the iframe in the user's browser; your server isn't involved.",
  },
  {
    capability: 'embed',
    q: 'Can I embed a custom calculator I built myself?',
    a: "Absolutely. Every calculator you build with the visual builder can be shared or embedded using the same Share dialog. You get both a public URL (which is great for social sharing) and an iframe snippet for embedding. The embedded widget uses your custom branding, theme, and formulas, not ours.",
  },

  // ─── WHITE LABEL ───
  {
    capability: 'whitelabel',
    q: 'How does white-labeling work? Can I make the calculator look like my own brand?',
    a: 'Yes. In the visual builder, open the Settings tab and either pick one of 6 preset themes (Retro, Dark, Modern, Pastel, Cyberpunk) or design your own with custom colors for primary, secondary, background, and text. You can also upload your own logo (PNG, JPG, or SVG) and set a brand name that displays in the calculator header. The result is a widget that looks and feels like it came from your company, not from Home of Calculators.',
  },
  {
    capability: 'whitelabel',
    q: 'Will Home of Calculators branding appear on my embedded calculator?',
    a: "By default, embedded Home of Calculators widgets are unbranded and feel native to the host site. There's no 'Powered by Home of Calculators' badge on individual calculators. The full Home of Calculators footer branding only appears if you use the free embed; you can fully remove it by hosting the embed via your own setup (instructions in the Share dialog).",
  },

  // ─── JSON ───
  {
    capability: 'json',
    q: 'Can I back up or share my custom calculator configurations?',
    a: "Yes. Every calculator in the visual builder has an Export JSON button that downloads a plain .json file containing the full configuration: every field, formula, theme, and branding setting. You can then re-import it on any device, share it with a teammate, or version-control it in Git. We never lock you in. Your data is always yours.",
  },
  {
    capability: 'json',
    q: 'Is there a version history or rollback for my custom calculators?',
    a: "The visual builder has a 50-step undo/redo history for the current session, plus localStorage auto-save that keeps your most recent draft. For long-term version control, use the JSON Export feature. You can store versions in Git, Dropbox, or anywhere you like. We're exploring a cloud-sync version history feature for the future.",
  },

  // ─── PRIVACY ───
  {
    capability: 'privacy',
    q: 'Is Home of Calculators really free? How do you make money?',
    a: 'Yes, 100% free (no paywalls, no premium tiers, no in-app purchases, no ads). Home of Calculators is independently funded by its founders. We deliberately avoid the surveillance-ad business model that most "free" calculator sites use, which is why we can offer a fully private, ad-free experience.',
  },
  {
    capability: 'privacy',
    q: 'Do you see or store the values I enter into calculators?',
    a: 'No. All calculations run locally in your browser using JavaScript. We never see, store, or transmit your inputs to any server. Custom calculators you build live in your browser\'s localStorage (a sandboxed key-value store) and are never uploaded to our infrastructure. The only data we collect is anonymous, aggregated page-view counts, and even that is privacy-respecting analytics (Plausible), not Google Analytics.',
    link: { label: 'Read the full privacy policy', href: '/privacy-policy' },
  },
  {
    capability: 'privacy',
    q: 'Is Home of Calculators GDPR and CCPA compliant?',
    a: "Yes. We don't collect personal data from calculator inputs, we don't use advertising trackers, and we don't share data with third parties for behavioral advertising. Our privacy-respecting analytics is GDPR-compliant out of the box. For full details on your rights as an EU/EEA/UK/Swiss or California resident, see our Privacy Policy.",
  },
]

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(0)
  const [capabilityFilter, setCapabilityFilter] = useState<CapabilityKey | 'all'>('all')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
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

  const filtered = capabilityFilter === 'all'
    ? FAQS
    : FAQS.filter((f) => f.capability === capabilityFilter)

  // Reset open item if the filter changes
  useEffect(() => {
    setOpen(0)
  }, [capabilityFilter])

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white overflow-hidden font-sans relative"
      aria-label="Frequently asked questions about the Home of Calculators platform"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Decorative */}
      <div className="absolute top-8 right-8 text-slate-200 pointer-events-none opacity-40 select-none hidden md:block">
        <svg width="64" height="64" fill="currentColor">
          <pattern id="dot-grid-faq" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="64" height="64" fill="url(#dot-grid-faq)" />
        </svg>
      </div>
      <div className="absolute top-1/2 left-8 -translate-y-1/2 text-slate-200 pointer-events-none opacity-40 select-none hidden md:block">
        <svg width="64" height="64" fill="currentColor">
          <pattern id="dot-grid-faq-2" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" />
          </pattern>
          <rect width="64" height="64" fill="url(#dot-grid-faq-2)" />
        </svg>
      </div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full border border-slate-100 pointer-events-none select-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full border border-slate-100/50 pointer-events-none select-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-8 select-none">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-dark-700 text-[10px] font-black uppercase tracking-wider mb-3 shadow-sm">
            <CircleHelp className="w-3.5 h-3.5" /> FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Questions about the full platform
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Not just "how do I calculate X", the real questions: how to build, embed, brand, back up, and trust Home of Calculators.
          </p>
        </div>

        {/* Capability filter chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 max-w-3xl mx-auto">
          <button
            onClick={() => setCapabilityFilter('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border transition-all ${
              capabilityFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow'
                : 'bg-white text-slate-600 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            All ({FAQS.length})
          </button>
          {(Object.keys(CAPABILITY_META) as CapabilityKey[]).map((cap) => {
            const meta = CAPABILITY_META[cap]
            const count = FAQS.filter((f) => f.capability === cap).length
            const isActive = capabilityFilter === cap
            return (
              <button
                key={cap}
                onClick={() => setCapabilityFilter(cap)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider border transition-all ${
                  isActive
                    ? `${meta.tint} shadow-sm`
                    : 'bg-white text-slate-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <meta.icon className="w-3 h-3" />
                {meta.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Accordion */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-[0_15px_40px_rgba(0,0,0,0.02)] rounded-[32px] p-4 sm:p-6 md:p-8">
          <div className="divide-y divide-slate-100">
            {filtered.map((faq, i) => {
              const meta = CAPABILITY_META[faq.capability]
              const CapIcon = meta.icon
              return (
                <div
                  key={`${faq.capability}-${i}`}
                  className="faq-item flex items-start gap-4 py-4 sm:py-5 first:pt-0 last:pb-0"
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  {/* Left capability icon */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                    <CapIcon className="w-4.5 h-4.5" />
                  </div>

                  {/* Q + A */}
                  <div className="flex-grow pt-1.5 min-w-0">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="w-full text-left font-bold text-slate-800 text-sm md:text-base hover:text-slate-900 transition-colors flex justify-between items-start gap-3"
                      aria-expanded={open === i}
                    >
                      <span itemProp="name" className="flex-1">{faq.q}</span>
                      <span className={`text-[9px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.tint} shrink-0 hidden sm:inline-block`}>
                        {meta.label}
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        open === i ? 'max-h-[600px] mt-3 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      itemScope
                      itemType="https://schema.org/Answer"
                      itemProp="acceptedAnswer"
                    >
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed pr-2" itemProp="text">
                        {faq.a}
                      </p>
                      {faq.link && (
                        <Link
                          href={faq.link.href}
                          className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-primary-600 hover:text-primary-700 group"
                        >
                          {faq.link.label}
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Plus/minus */}
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center shrink-0 transition-all mt-1 ${
                      open === i
                        ? 'bg-slate-100 border-slate-300 text-slate-800'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                    }`}
                    aria-label={open === i ? 'Collapse answer' : 'Expand answer'}
                  >
                    {open === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              No questions in this category yet. Try a different filter.
            </div>
          )}
        </div>

        {/* Bottom CTA card */}
        <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)] rounded-3xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-6 sm:px-8 select-none">
          <div className="flex items-center gap-2.5 text-slate-600 text-xs md:text-sm text-center sm:text-left">
            <Headphones className="w-5 h-5 text-slate-500 shrink-0" />
            <span>Have a question we missed? We're here to help.</span>
          </div>
          <Link
            href="/contact"
            className="text-slate-700 hover:text-slate-900 font-extrabold flex items-center gap-1.5 text-xs md:text-sm transition-colors group"
          >
            Contact us
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Inline platform callout — a small "what you can do" reminder */}
        <div className="mt-10 grid sm:grid-cols-3 gap-3">
          <Link
            href="/calculators"
            className="group p-4 bg-white border border-neutral-200 hover:border-primary-400 hover:shadow-md rounded-2xl transition-all"
          >
            <Calculator className="w-5 h-5 text-dark-700 mb-2" />
            <h3 className="text-sm font-bold text-dark-900 mb-0.5">500+ ready-made calculators</h3>
            <p className="text-[11px] text-dark-500 leading-relaxed">Math, finance, health, conversion, and more, all free, all in your browser.</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-primary-700 group-hover:gap-1.5 transition-all">
              Browse <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
          <Link
            href="/builder"
            className="group p-4 bg-white border border-neutral-200 hover:border-primary-400 hover:shadow-md rounded-2xl transition-all"
          >
            <WrenchIcon className="w-5 h-5 text-dark-700 mb-2" />
            <h3 className="text-sm font-bold text-dark-900 mb-0.5">Visual calculator builder</h3>
            <p className="text-[11px] text-dark-500 leading-relaxed">Drag-and-drop fields, write formulas, pick a theme. Ship a custom calculator in minutes.</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-primary-700 group-hover:gap-1.5 transition-all">
              Open builder <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
          <Link
            href="/about"
            className="group p-4 bg-white border border-neutral-200 hover:border-primary-400 hover:shadow-md rounded-2xl transition-all"
          >
            <Palette className="w-5 h-5 text-dark-700 mb-2" />
            <h3 className="text-sm font-bold text-dark-900 mb-0.5">White-label &amp; embed</h3>
            <p className="text-[11px] text-dark-500 leading-relaxed">Brand any calculator with your logo and colors, then drop it on your site with one iframe.</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-primary-700 group-hover:gap-1.5 transition-all">
              Learn more <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
