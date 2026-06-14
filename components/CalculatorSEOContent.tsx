'use client'

import { motion } from 'framer-motion'
import { Calculator as CalcIcon, BookOpen, HelpCircle, Lightbulb, CheckCircle2, ChevronRight, Shield, Zap, Globe } from 'lucide-react'
import Link from 'next/link'
import { CATEGORY_LABELS, type CalculatorCategory } from '@/lib/calculators'

// =====================================================================
// PER-CALCULATOR SEO-RICH COPY
// Auto-generated content block shipped with every calculator page to
// maximize SEO/GEO visibility and answer user questions.
// Brand palette: white, near-black, primary blue (no rainbow colors).
// =====================================================================

interface SEOCopy {
  intro: string
  whatIs: { heading: string; body: string }
  howTo: { heading: string; steps: { title: string; body: string }[] }
  tips: string[]
  faq: { q: string; a: string }[]
}

const CATEGORY_COPY: Record<CalculatorCategory, { heading: string; description: string; useCase: string }> = {
  math: {
    heading: 'Math Calculators',
    description: 'mathematical calculations, equations, formulas',
    useCase: 'students, engineers, scientists',
  },
  finance: {
    heading: 'Finance Calculators',
    description: 'financial planning, loan calculations, investment analysis',
    useCase: 'investors, homebuyers, business owners',
  },
  health: {
    heading: 'Health Calculators',
    description: 'health metrics, fitness tracking, medical formulas',
    useCase: 'fitness enthusiasts, patients, healthcare professionals',
  },
  conversion: {
    heading: 'Conversion Tools',
    description: 'unit conversions, measurements, scale calculations',
    useCase: 'engineers, cooks, students, travelers',
  },
  'date-time': {
    heading: 'Date & Time Calculators',
    description: 'date calculations, time differences, scheduling',
    useCase: 'project managers, parents, event planners',
  },
  everyday: {
    heading: 'Everyday Tools',
    description: 'everyday utilities, random generators, simple calculations',
    useCase: 'everyone, daily use',
  },
  islamic: {
    heading: 'Islamic Calculators',
    description: 'Islamic finance, prayer times, Hijri dates, and religious calculations',
    useCase: 'Muslims, Islamic scholars, travelers',
  },
  construction: {
    heading: 'Construction Calculators',
    description: 'building materials, measurements, cost estimates, and project planning',
    useCase: 'contractors, DIY enthusiasts, architects',
  },
  engineering: {
    heading: 'Engineering Calculators',
    description: 'electrical, mechanical, and chemical engineering formulas',
    useCase: 'engineers, technicians, students',
  },
  geometry: {
    heading: 'Geometry Calculators',
    description: 'shapes, areas, volumes, distances, and coordinate geometry',
    useCase: 'students, architects, designers',
  },
  statistics: {
    heading: 'Statistics Calculators',
    description: 'probability, distributions, hypothesis testing, and data analysis',
    useCase: 'researchers, data scientists, students',
  },
  trigonometry: {
    heading: 'Trigonometry Calculators',
    description: 'angles, trig functions, identities, and triangle solving',
    useCase: 'students, engineers, physicists',
  },
  misc: {
    heading: 'Other Calculators',
    description: 'specialty calculators for games, weather, vehicles, and more',
    useCase: 'hobbyists, drivers, gamers, general users',
  },
}

function generateSEOCopy(calc: { name: string; shortName: string; description: string; category: CalculatorCategory; keywords: string[] }): SEOCopy {
  const cat = CATEGORY_COPY[calc.category]
  return {
    intro: `${calc.name} is a free, browser-based tool for ${cat.description}. Whether you're a ${calc.keywords[0] || 'user'} or just need a quick answer, this calculator handles the math for you: accurately, privately, and instantly. All calculations run in your browser; we never see your inputs.`,
    whatIs: {
      heading: `What is the ${calc.name}?`,
      body: `${calc.name} ${calc.description.toLowerCase()} It is part of Home of Calculators's ${cat.heading} suite for ${cat.description}. The calculator is designed for ${cat.useCase}, but anyone can use it. No signup, no ads, no tracking. Just accurate math, computed locally in your browser using a BigNumber-precision math engine.`,
    },
    howTo: {
      heading: `How to use the ${calc.name}`,
      steps: [
        { title: 'Enter your values', body: `Fill in the input fields with the values you want to calculate. Each field has a clear label and may include a unit (e.g. kg, $, years). Helpful hint text appears under fields where useful.` },
        { title: 'Review the formula', body: `Our calculators use well-known mathematical formulas. The result is computed using a high-precision math engine (mathjs with 64-128 digit BigNumber arithmetic), so you can trust the answer.` },
        { title: 'Read the result', body: `The result is displayed clearly, with the units and decimal places appropriate to the calculation. You can adjust the inputs to see how the result changes in real-time.` },
        { title: 'Export or share', body: `If you need to save or share your calculation, use the export buttons (where available) to download a CSV or PDF, or use the share link to send the configuration to someone else.` },
      ],
    },
    tips: [
      'All calculations run locally in your browser; your data never leaves your device.',
      'For best results on mobile, rotate to landscape when entering many values.',
      'Bookmark this page to come back to your calculation anytime.',
      'Need a different calculator? Try our visual builder to create your own.',
    ],
    faq: [
      { q: `Is the ${calc.shortName} accurate?`, a: `Yes. Home of Calculators uses a BigNumber-precision math engine (64-128 decimal digits) to ensure calculations are accurate. We run 96+ automated tests covering unit conversion, financial formulas, health formulas, and more. For critical decisions (financial, medical, legal), we still recommend consulting a qualified professional.` },
      { q: `Is the ${calc.name} free?`, a: `Yes. Every calculator on Home of Calculators is 100% free, with no signup, no ads, and no hidden fees. The entire platform is free forever.` },
      { q: `Do you store the values I enter?`, a: `No. All calculations happen in your browser. We never see, store, or transmit your inputs to any server. Your data stays on your device.` },
      { q: `Can I use the ${calc.shortName} on my phone?`, a: `Yes. Home of Calculators is fully responsive and works on any device (phone, tablet, laptop, or desktop). The interface adapts to your screen size.` },
      { q: `Can I embed this calculator on my own website?`, a: `Yes. Click the "Share" button to get an iframe embed code. The embedded calculator will look like any other Home of Calculators widget. You can also build a fully customized version using our visual builder.` },
      { q: `Can I build my own custom calculator?`, a: `Absolutely. Home of Calculators's visual builder lets you add fields, write formulas, choose a theme, and brand the result with your own logo, all without writing code.` },
    ],
  }
}

export default function CalculatorSEOContent({ calc }: { calc: { name: string; shortName: string; description: string; category: CalculatorCategory; keywords: string[] } }) {
  const copy = generateSEOCopy(calc)

  return (
    <section className="mt-12 sm:mt-16 space-y-12" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="description" content={copy.intro} />

      {/* ────── INTRO ────── */}
      <div className="prose prose-slate max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-100 text-[10px] font-bold uppercase tracking-wider font-mono text-primary-700">
              <CalcIcon className="w-3 h-3" /> About this calculator
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-3 tracking-tight">{copy.whatIs.heading}</h2>
          <p className="text-base text-dark-600 leading-relaxed">{copy.whatIs.body}</p>
        </motion.div>
      </div>

      {/* ────── HOW TO USE ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        itemScope
        itemType="https://schema.org/HowTo"
      >
        <meta itemProp="name" content={copy.howTo.heading} />
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-dark-500" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">{copy.howTo.heading}</h2>
        </div>
        <ol className="space-y-3" itemProp="steps">
          {copy.howTo.steps.map((step, i) => (
            <li key={i} className="flex gap-4 p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors" itemScope itemType="https://schema.org/HowToStep">
              <meta itemProp="position" content={String(i + 1)} />
              <div className="shrink-0 w-8 h-8 rounded-xl bg-dark-900 text-white flex items-center justify-center font-extrabold text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-dark-900 mb-1" itemProp="name">{step.title}</h3>
                <p className="text-sm text-dark-600 leading-relaxed" itemProp="text">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* ────── TIPS + FEATURES ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 gap-4"
      >
        <div className="p-5 sm:p-6 bg-neutral-50 border border-neutral-200 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-dark-700" />
            <h3 className="text-base font-extrabold text-dark-900">Quick tips</h3>
          </div>
          <ul className="space-y-2">
            {copy.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-dark-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 mt-0.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 sm:p-6 bg-dark-900 text-white rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary-300" />
              <h3 className="text-base font-extrabold">Why Home of Calculators</h3>
            </div>
            <ul className="space-y-2">
              {[
                { icon: Shield, text: '100% private (calculations run in your browser)' },
                { icon: Zap, text: '128-bit BigNumber precision (no rounding errors)' },
                { icon: Globe, text: 'Works on any device: phone, tablet, desktop' },
                { icon: CalcIcon, text: 'Free forever (no signup, no ads, no upsells)' },
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                  <f.icon className="w-3.5 h-3.5 text-primary-300 mt-0.5 shrink-0" />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* ────── FAQ ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-dark-500" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">Frequently asked questions</h2>
        </div>
        <div className="space-y-2">
          {copy.faq.map((qa, i) => (
            <details key={i} className="group p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors" itemScope itemType="https://schema.org/Question">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-sm font-extrabold text-dark-900 pr-3" itemProp="name">{qa.q}</h3>
                <span className="text-dark-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="mt-2 text-sm text-dark-600 leading-relaxed" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <span itemProp="text">{qa.a}</span>
              </p>
            </details>
          ))}
        </div>
      </motion.div>

      {/* ────── RELATED ACTIONS ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 gap-3"
      >
        <Link href="/builder" className="group p-5 sm:p-6 bg-dark-900 text-white rounded-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-300 font-mono mb-1.5">
              <Zap className="w-3 h-3" /> Want more?
            </div>
            <h3 className="text-lg font-extrabold mb-1">Build a custom calculator</h3>
            <p className="text-sm text-white/70 mb-3">Need a calculation we don't have? Build your own in minutes, no code required.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
              Open the builder <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        <Link href="/calculators" className="group p-5 sm:p-6 bg-white border border-neutral-200 hover:border-primary-400 rounded-2xl transition-all">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark-500 font-mono mb-1.5">
            <CalcIcon className="w-3 h-3" /> More tools
          </div>
          <h3 className="text-lg font-extrabold text-dark-900 mb-1">Browse 50+ calculators</h3>
          <p className="text-sm text-dark-600 mb-3">Explore the full library across math, finance, health, conversion, and more.</p>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-dark-700 group-hover:gap-2 group-hover:text-primary-700 transition-all">
            See all calculators <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </motion.div>
    </section>
  )
}
