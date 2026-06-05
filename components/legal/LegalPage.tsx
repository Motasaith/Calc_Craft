'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Calendar,
  Printer,
  Mail,
  Shield,
  FileText,
  Globe,
  Heart,
} from 'lucide-react'

export interface LegalPageProps {
  title: string
  subtitle: string
  badge: string
  icon: 'shield' | 'file' | 'cookie' | 'mail' | 'globe' | 'heart'
  lastUpdated: string
  intro: string
  sections: { heading: string; body: React.ReactNode }[]
  contactEmail?: string
}

const iconMap = {
  shield: Shield,
  file: FileText,
  cookie: FileText,
  mail: Mail,
  globe: Globe,
  heart: Heart,
}

// Brand-aligned: only the primary blue + dark palette
const iconWrapClass =
  'w-11 h-11 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center'

export default function LegalPage({
  title,
  subtitle,
  badge,
  icon,
  lastUpdated,
  intro,
  sections,
  contactEmail,
}: LegalPageProps) {
  const Icon = iconMap[icon]

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print()
  }

  const toc = sections.map((s) => ({ id: slugify(s.heading), label: s.heading }))
  const [showToc, setShowToc] = React.useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* ───────── HERO BANNER (matches calculator page chrome) ───────── */}
      <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-12 overflow-hidden bg-gradient-to-b from-white via-neutral-50/40 to-white">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[420px] bg-primary-100/30 blur-3xl rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-dark-500 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-dark-800 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-dark-800 font-semibold">{title}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-dark-700">
                <Icon className="w-3 h-3 text-primary-600" />
                {badge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-dark-600 text-[10px] font-mono font-bold">
                <Calendar className="w-3 h-3" />
                Updated {lastUpdated}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-dark-900 mb-3 leading-[1.1]">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-dark-500 max-w-2xl leading-relaxed mb-4">{subtitle}</p>
            <p className="text-sm text-dark-600 leading-relaxed max-w-3xl">{intro}</p>

            <div className="flex flex-wrap items-center gap-2 mt-5">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:border-dark-300 rounded-lg text-xs font-bold text-dark-700 active:scale-95 transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              {toc.length > 4 && (
                <button
                  onClick={() => setShowToc((s) => !s)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:border-dark-300 rounded-lg text-xs font-bold text-dark-700 active:scale-95 transition-all lg:hidden"
                >
                  {showToc ? 'Hide' : 'Show'} sections
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── MAIN LAYOUT ───────── */}
      <section className="pb-20 sm:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
          {/* Sticky TOC (desktop) */}
          {toc.length > 1 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <h4 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-3 font-mono">
                  On this page
                </h4>
                <ul className="space-y-1 border-l-2 border-neutral-100">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="block -ml-px pl-3 py-1 text-xs text-dark-500 hover:text-dark-900 hover:border-l-2 hover:border-primary-500 transition-all truncate"
                        title={t.label}
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* Mobile TOC */}
          {showToc && toc.length > 1 && (
            <div className="lg:hidden bg-white border border-neutral-200 rounded-xl p-3 mb-4">
              <h4 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-2 font-mono">
                On this page
              </h4>
              <ul className="space-y-0.5 text-xs">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      onClick={() => setShowToc(false)}
                      className="text-dark-600 hover:text-dark-900"
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sections */}
          <article className="prose prose-slate max-w-none w-full">
            {sections.map((s, i) => (
              <motion.section
                key={s.heading}
                id={slugify(s.heading)}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="mb-10 scroll-mt-28"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-dark-900 mb-4 tracking-tight flex items-baseline gap-2">
                  <span className="text-[10px] font-mono font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{s.heading}</span>
                </h2>
                <div className="text-[15px] text-dark-600 leading-relaxed space-y-3 [&_strong]:text-dark-900 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_a]:text-primary-600 [&_a]:font-semibold [&_a]:hover:underline">
                  {s.body}
                </div>
              </motion.section>
            ))}

            {/* Contact card */}
            {contactEmail && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 p-6 bg-dark-900 rounded-2xl text-white relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-primary-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-300 font-mono">
                      Questions or concerns?
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">We&apos;re here to help</h3>
                  <p className="text-sm text-white/70 mb-3 max-w-md">
                    For questions about this page, partnership opportunities, or anything else, drop us a line.
                  </p>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-dark-900 rounded-lg text-sm font-bold hover:bg-neutral-100 active:scale-95 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {contactEmail}
                  </a>
                </div>
              </motion.div>
            )}

            {/* Related legal links */}
            <div className="mt-10 pt-6 border-t border-neutral-200">
              <h4 className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-3 font-mono">Related</h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <Link href="/privacy-policy" className="p-3 bg-white border border-neutral-200 hover:border-primary-400 rounded-xl transition-all group">
                  <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-1 group-hover:text-primary-600">Privacy</div>
                  <div className="text-sm font-bold text-dark-800">Privacy Policy</div>
                </Link>
                <Link href="/terms-of-use" className="p-3 bg-white border border-neutral-200 hover:border-primary-400 rounded-xl transition-all group">
                  <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-1 group-hover:text-primary-600">Legal</div>
                  <div className="text-sm font-bold text-dark-800">Terms of Use</div>
                </Link>
                <Link href="/cookies" className="p-3 bg-white border border-neutral-200 hover:border-primary-400 rounded-xl transition-all group">
                  <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-1 group-hover:text-primary-600">Cookies</div>
                  <div className="text-sm font-bold text-dark-800">Cookies Policy</div>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
