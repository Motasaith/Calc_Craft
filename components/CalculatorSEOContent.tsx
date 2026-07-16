'use client'

import { motion } from 'framer-motion'
import { Calculator as CalcIcon, BookOpen, HelpCircle, Lightbulb, CheckCircle2, ChevronRight, Shield, Zap, Globe, FunctionSquare, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { CATEGORY_LABELS, type CalculatorCategory } from '@/lib/calculators'
import { getFormulaRef } from '@/lib/formula-references'

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
  physics: {
    heading: 'Physics Calculators',
    description: 'force, energy, motion, waves, and thermodynamics calculations',
    useCase: 'students, physicists, engineers',
  },
  chemistry: {
    heading: 'Chemistry Calculators',
    description: 'molar mass, pH, stoichiometry, and chemical reactions',
    useCase: 'students, chemists, researchers',
  },
  astronomy: {
    heading: 'Astronomy Calculators',
    description: 'orbital mechanics, stellar properties, and cosmological calculations',
    useCase: 'astronomers, students, space enthusiasts',
  },
  agriculture: {
    heading: 'Agriculture Calculators',
    description: 'crop yields, fertilizer, irrigation, and farming calculations',
    useCase: 'farmers, agronomists, gardeners',
  },
  photography: {
    heading: 'Photography Calculators',
    description: 'depth of field, exposure, focal length, and camera settings',
    useCase: 'photographers, filmmakers, content creators',
  },
  environment: {
    heading: 'Environment Calculators',
    description: 'carbon footprint, energy savings, and sustainability metrics',
    useCase: 'environmentalists, homeowners, conscious consumers',
  },
  'real-estate': {
    heading: 'Real Estate Calculators',
    description: 'rental yield, cap rate, mortgage, and property investment analysis',
    useCase: 'investors, realtors, homebuyers',
  },
  tax: {
    heading: 'Tax Calculators',
    description: 'income tax, capital gains, VAT, and tax planning calculations',
    useCase: 'taxpayers, accountants, business owners',
  },
  automotive: {
    heading: 'Automotive Calculators',
    description: 'fuel cost, car loans, depreciation, and vehicle maintenance',
    useCase: 'drivers, car buyers, mechanics',
  },
  sports: {
    heading: 'Sports & Fitness Calculators',
    description: 'calorie burn, pace, VO2 max, and athletic performance metrics',
    useCase: 'athletes, coaches, fitness enthusiasts',
  },
  cooking: {
    heading: 'Cooking & Food Calculators',
    description: 'recipe scaling, conversions, cooking times, and food preparation',
    useCase: 'cooks, bakers, home chefs',
  },
  education: {
    heading: 'Education Calculators',
    description: 'GPA, study time, grade calculations, and academic planning',
    useCase: 'students, teachers, parents',
  },
  business: {
    heading: 'Business Calculators',
    description: 'markup, NPV, IRR, cash flow, and business metrics',
    useCase: 'entrepreneurs, analysts, business owners',
  },
  science: {
    heading: 'Science Calculators',
    description: 'physics formulas, optics, acoustics, and scientific constants',
    useCase: 'students, scientists, researchers',
  },
  landscaping: {
    heading: 'Landscaping Calculators',
    description: 'sod, mulch, pavers, retaining walls, and garden planning',
    useCase: 'homeowners, landscapers, gardeners',
  },
  plumbing: {
    heading: 'Plumbing Calculators',
    description: 'pipe sizing, flow rate, water pressure, and tank capacity',
    useCase: 'plumbers, contractors, DIY homeowners',
  },
  electrical: {
    heading: 'Electrical Calculators',
    description: 'wire sizing, circuit load, power consumption, and electrical safety',
    useCase: 'electricians, engineers, homeowners',
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

export default function CalculatorSEOContent({ calc, slug }: { calc: { name: string; shortName: string; description: string; category: CalculatorCategory; keywords: string[] }; slug?: string }) {
  if (slug === 'bmi') {
    return <BmiCustomSEOContent />
  }
  if (slug === 'body-fat') {
    return <BodyFatCustomSEOContent />
  }
  if (slug === 'bmr') {
    return <BmrCustomSEOContent />
  }
  if (slug === 'water-intake') {
    return <WaterIntakeCustomSEOContent />
  }
  if (slug === 'macro') {
    return <MacroCustomSEOContent />
  }
  if (slug === 'one-rep-max') {
    return <OneRepMaxCustomSEOContent />
  }

  const copy = generateSEOCopy(calc)
  const formulaRef = slug ? getFormulaRef(slug) : null
  // Use formula-specific steps if available, otherwise use generic steps
  const steps = formulaRef ? formulaRef.steps : copy.howTo.steps

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

      {/* ────── FORMULA REFERENCE ────── */}
      {formulaRef && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
              <FunctionSquare className="w-3 h-3" /> Formula Reference
            </span>
          </div>

          {/* Formula display */}
          <div className="mb-5 p-4 bg-white border border-neutral-300 rounded-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-2">The Formula</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-dark-900 text-center py-2">
              {formulaRef.formula}
            </div>
          </div>

          {/* Educational description */}
          <p className="text-sm text-dark-600 leading-relaxed mb-5">{formulaRef.description}</p>

          {/* Variables table */}
          <div className="mb-5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono mb-2">Variables</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {formulaRef.variables.map((v, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-white border border-neutral-200 rounded-lg">
                  <code className="text-sm font-bold text-primary-700 font-mono">{v.symbol}</code>
                  <span className="text-xs text-dark-600">{v.name}{v.unit ? ` (${v.unit})` : ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Worked example */}
          <div className="p-4 bg-neutral-900 text-white rounded-xl">
            <div className="text-[10px] font-bold uppercase tracking-wider text-primary-300 font-mono mb-2">Worked Example</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.entries(formulaRef.example.inputs).map(([key, val]) => (
                <span key={key} className="text-xs font-mono px-2 py-1 bg-white/10 rounded">
                  {key} = {val}
                </span>
              ))}
            </div>
            <div className="text-sm font-bold font-mono text-primary-300">
              Result: {formulaRef.example.result}
            </div>
          </div>
        </motion.div>
      )}

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
          {steps.map((step, i) => (
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
          <h3 className="text-lg font-extrabold text-dark-900 mb-1">Browse 500+ calculators</h3>
          <p className="text-sm text-dark-600 mb-3">Explore the full library across math, finance, health, conversion, and more.</p>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-dark-700 group-hover:gap-2 group-hover:text-primary-700 transition-all">
            See all calculators <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </motion.div>
    </section>
  )
}

function BmiCustomSEOContent() {
  return (
    <section className="mt-12 sm:mt-16 space-y-12" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="description" content="Body Mass Index (BMI) calculator calculates BMI and determines corresponding weight classification ranges for adults and children (ages 2-19)." />

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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-3 tracking-tight">What is the BMI Calculator?</h2>
          <p className="text-base text-dark-600 leading-relaxed">
            The <strong>BMI Calculator</strong> is a free, browser-based tool for calculating Body Mass Index (BMI), representing an internationally recognized proxy measure of body fat. Originally conceived in the 1830s by Belgian statistician Adolphe Quetelet, BMI has grown into the baseline screening standard used by healthcare professionals worldwide to categorize individuals into weight classifications.
          </p>
          <p className="text-base text-dark-600 leading-relaxed mt-4">
            It provides a quick, non-invasive estimate of whether a person is underweight, normal weight, overweight, or obese. While BMI does not directly measure body fat percentage (as it cannot distinguish between muscle mass and fat tissue), it correlates strongly with more direct measures of body fatness and serves as an important diagnostic baseline for prospective health risks.
          </p>
        </motion.div>
      </div>

      {/* ────── ADULT CLASSIFICATIONS ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Adult BMI Classifications</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          For adults aged 20 and older, BMI values are grouped into standard weight status categories defined by the World Health Organization (WHO) and the Centers for Disease Control and Prevention (CDC). These ranges remain identical for both men and women of all body types.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="p-3 font-bold text-neutral-700">Classification</th>
                  <th className="p-3 font-bold text-neutral-700">BMI Range (kg/m²)</th>
                  <th className="p-3 font-bold text-neutral-700">BMI Prime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-dark-700">
                <tr><td className="p-3 font-bold text-blue-600">Severe Thinness</td><td className="p-3">&lt; 16.0</td><td className="p-3">&lt; 0.64</td></tr>
                <tr><td className="p-3 font-bold text-blue-500">Moderate Thinness</td><td className="p-3">16.0 – 16.9</td><td className="p-3">0.64 – 0.67</td></tr>
                <tr><td className="p-3 font-bold text-cyan-500">Mild Thinness</td><td className="p-3">17.0 – 18.4</td><td className="p-3">0.68 – 0.73</td></tr>
                <tr className="bg-green-50/20"><td className="p-3 font-bold text-green-600">Normal (Healthy Weight)</td><td className="p-3">18.5 – 24.9</td><td className="p-3">0.74 – 0.99</td></tr>
                <tr><td className="p-3 font-bold text-amber-500">Overweight</td><td className="p-3">25.0 – 29.9</td><td className="p-3">1.00 – 1.19</td></tr>
                <tr><td className="p-3 font-bold text-orange-600">Obese Class I (Moderate)</td><td className="p-3">30.0 – 34.9</td><td className="p-3">1.20 – 1.39</td></tr>
                <tr><td className="p-3 font-bold text-red-500">Obese Class II (Severe)</td><td className="p-3">35.0 – 39.9</td><td className="p-3">1.40 – 1.59</td></tr>
                <tr><td className="p-3 font-bold text-red-800">Obese Class III (Morbid)</td><td className="p-3">&ge; 40.0</td><td className="p-3">&ge; 1.60</td></tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <img
              src="/bmi-adult-chart.webp"
              alt="Adult BMI chart mapping height in feet/inches and centimeters to weight in pounds and kilograms to visualize underweight, normal, overweight, and obese categories."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 1: Visual grid chart illustrating BMI classification bounds based on height and weight.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ────── CHILDREN & TEENS BMI ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">BMI Percentiles for Children & Teens (Ages 2-19)</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          BMI is calculated the same way for children and teens as it is for adults, but the resulting number is interpreted differently. Because children grow rapidly and develop body fat at varying rates depending on their exact age and biological sex, their weight status is determined by comparing their raw BMI against growth percentile curves of a reference population (developed by the CDC).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <img
              src="/bmi-child-chart.webp"
              alt="CDC BMI-for-age percentile growth chart for boys and girls aged 2 to 20 showing the 5th, 50th, 85th, and 95th percentile curves."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 2: CDC BMI-for-age growth percentile curves for boys and girls.
            </p>
          </div>
          <div className="space-y-4">
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="p-3 font-bold text-neutral-700">Category</th>
                    <th className="p-3 font-bold text-neutral-700">Percentile Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-dark-700">
                  <tr><td className="p-3 font-bold text-blue-600">Underweight</td><td className="p-3">&lt; 5th percentile</td></tr>
                  <tr className="bg-green-50/20"><td className="p-3 font-bold text-green-600">Healthy Weight</td><td className="p-3">5th percentile to &lt; 85th percentile</td></tr>
                  <tr><td className="p-3 font-bold text-amber-500">Overweight</td><td className="p-3">85th percentile to &lt; 95th percentile</td></tr>
                  <tr><td className="p-3 font-bold text-red-600">Obese</td><td className="p-3">&ge; 95th percentile</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Children's percentiles act as a comparative metric. For example, if a 10-year-old boy has a BMI in the 75th percentile, it means that his BMI is higher than 75% of other 10-year-old boys in the standard reference growth index.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ────── FORMULAS ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
            <FunctionSquare className="w-3 h-3" /> Mathematical Formulas
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Metric System Formula</div>
            <div className="text-lg font-extrabold font-mono text-dark-900 text-center py-2 bg-neutral-50 rounded-lg">
              BMI = weight (kg) / [height (m)]²
            </div>
            <p className="text-xs text-dark-600 leading-relaxed">
              The standard global formula. Height is converted to meters and squared, then weight in kilograms is divided by that value.
            </p>
            <div className="text-[10px] font-mono text-neutral-500 border-t border-neutral-100 pt-2">
              <strong>Worked Example:</strong> Weight = 75 kg, Height = 1.78 m:<br />
              75 / (1.78 * 1.78) = 75 / 3.1684 = 23.67 kg/m²
            </div>
          </div>
          <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">US Customary / Imperial Formula</div>
            <div className="text-lg font-extrabold font-mono text-dark-900 text-center py-2 bg-neutral-50 rounded-lg">
              BMI = [weight (lbs) / (height (in))²] * 703
            </div>
            <p className="text-xs text-dark-600 leading-relaxed">
              Calculates index using pounds and inches, incorporating a standard mathematical conversion scaling coefficient of 703.
            </p>
            <div className="text-[10px] font-mono text-neutral-500 border-t border-neutral-100 pt-2">
              <strong>Worked Example:</strong> Weight = 160 lbs, Height = 5 ft 10 in (70 inches):<br />
              [160 / 70²] * 703 = [160 / 4900] * 703 = 22.95 kg/m²
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────── RISKS ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="p-6 bg-red-50/40 border border-red-200 rounded-2xl space-y-3">
          <h4 className="text-base font-extrabold text-red-700 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" /> Risks of High BMI (Overweight/Obese)
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Maintaining a body weight significantly above normal distributions is associated with elevated risks for chronic conditions:
          </p>
          <ul className="text-xs space-y-2 text-dark-600 pl-4 list-disc font-mono">
            <li><strong>Cardiovascular Diseases</strong>: Hypertension, stroke, and coronary heart blockages.</li>
            <li><strong>Type 2 Diabetes</strong>: Elevated fat levels increase insulin resistance.</li>
            <li><strong>Respiratory Issues</strong>: Sleep apnea, chronic snoring, and hypoventilation.</li>
            <li><strong>Mechanical Loading</strong>: Osteoarthritis and accelerated joint wear.</li>
          </ul>
        </div>
        <div className="p-6 bg-blue-50/40 border border-blue-200 rounded-2xl space-y-3">
          <h4 className="text-base font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" /> Risks of Low BMI (Underweight)
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            An excessively low BMI denotes nutritional deficits or underlying metabolic concerns, carrying distinct clinical risks:
          </p>
          <ul className="text-xs space-y-2 text-dark-600 pl-4 list-disc font-mono">
            <li><strong>Nutritional Deficits</strong>: Anemia, chronic fatigue, and electrolyte imbalances.</li>
            <li><strong>Osteoporosis</strong>: Reduced bone mineral density, elevating fracture risk.</li>
            <li><strong>Immune Impairment</strong>: Higher vulnerability to infections and slow healing.</li>
            <li><strong>Hormonal Disruptions</strong>: Menstrual irregularity and infertility.</li>
          </ul>
        </div>
      </motion.div>

      {/* ────── LIMITATIONS ────── */}
      <div className="prose prose-slate max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-wider font-mono">
              <Lightbulb className="w-3.5 h-3.5" /> Limitations of BMI
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-dark-900 tracking-tight">When BMI Fails to Be Accurate</h3>
          <p className="text-sm text-dark-600 leading-relaxed">
            While BMI is an excellent comparative epidemiological index, it should not be considered an absolute measure of personal body fat or diagnostic health. Because it only accounts for gross weight and height, it does not distinguish between muscle mass and fat tissue.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-dark-900 font-mono block">1. Muscle vs. Fat</span>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Muscle is much denser than fat. Athletes and bodybuilders can have high BMIs that classify them as "overweight" or "obese" despite having minimal body fat.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-dark-900 font-mono block">2. Elderly Adults</span>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Older adults often lose muscle mass and bone density (sarcopenia) and carry higher visceral fat, which BMI fails to reflect.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-dark-900 font-mono block">3. Fat Distribution</span>
              <p className="text-xs text-neutral-500 leading-relaxed">
                BMI does not indicate where fat is stored. Abdominal visceral fat carries significantly higher metabolic risks than subcutaneous fat in other areas.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ────── FAQ ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        itemScope
        itemType="https://schema.org/FAQPage"
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-dark-500" />
          <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {[
            { q: "Is BMI accurate for athletes?", a: "No. BMI does not distinguish between muscle weight and fat weight. Because muscle is denser than fat, muscular athletes often get a high BMI score that incorrectly classifies them as overweight or obese, despite having excellent health and low body fat." },
            { q: "What is a healthy BMI range for adults?", a: "For adults aged 20 and older, a normal or healthy BMI range is between 18.5 and 24.9 kg/m². Scores below 18.5 are classified as underweight, scores from 25.0 to 29.9 are overweight, and scores of 30.0 or higher are categorized as obese." },
            { q: "How is children's BMI calculated differently?", a: "While the raw BMI calculation formula (weight / height²) is identical for children and adults, it is interpreted using age-and-sex-specific growth percentiles for anyone under 20. This is because body composition changes rapidly as children grow, and fat distributions differ significantly between boys and girls during developmental years." },
            { q: "What is BMI Prime?", a: "BMI Prime is a simple ratio of your actual BMI to the upper limit of the normal weight BMI range (which is 25.0). It is calculated as actual BMI / 25. A BMI Prime between 0.74 and 1.00 represents a normal weight. A value greater than 1.00 is overweight, and a value below 0.74 is underweight." }
          ].map((qa, i) => (
            <details key={i} className="group p-4 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors" itemScope itemType="https://schema.org/Question">
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
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-300 font-mono mb-1.5">
              <Zap className="w-3.5 h-3.5" /> Want more?
            </div>
            <h3 className="text-lg font-extrabold mb-1">Build a custom calculator</h3>
            <p className="text-sm text-white/70 mb-3 font-normal leading-relaxed font-sans">Need a calculation we don't have? Build your own in minutes, no code required.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
              Open the builder <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        <Link href="/calculators" className="group p-5 sm:p-6 bg-white border border-neutral-200 hover:border-primary-400 rounded-2xl transition-all">
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark-500 font-mono mb-1.5">
              <CalcIcon className="w-3 h-3" /> More tools
            </div>
            <h3 className="text-lg font-extrabold text-dark-900 mb-1">Browse 500+ calculators</h3>
            <p className="text-sm text-dark-600 mb-3 font-normal leading-relaxed font-sans">Explore the full library across math, finance, health, conversion, and more.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-dark-700 group-hover:gap-2 group-hover:text-primary-700 transition-all">
              See all calculators <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}

function BodyFatCustomSEOContent() {
  return (
    <section className="mt-12 sm:mt-16 space-y-12" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="description" content="Body Fat Calculator estimates total body fat percentage based on the U.S. Navy Method and the BMI Method (Deurenberg formula)." />

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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-3 tracking-tight">What is the Body Fat Calculator?</h2>
          <p className="text-base text-dark-600 leading-relaxed">
            The <strong>Body Fat Calculator</strong> is a premium health tool designed to estimate your total body fat percentage. It uses two widely accepted calculation methods: the **U.S. Navy Method** (which relies on circumferences of the waist, neck, and hips) and the **BMI Method** (which derives body fat using height, weight, age, and sex).
          </p>
          <p className="text-base text-dark-600 leading-relaxed mt-4">
            Understanding your body composition—rather than just your scale weight—gives you a much clearer picture of your overall fitness and health. This tool helps you track muscle retention, fat loss goals, and compare your body fat against standard fitness categories and age-based ideals.
          </p>
        </motion.div>
      </div>

      {/* ────── ACE CATEGORIZATION ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">ACE Body Fat Classifications</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          The American Council on Exercise (ACE) lists standard body fat percentage categories. Since women require higher essential fat levels for reproductive and hormonal health, women's category boundaries are higher than men's:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="p-3 font-bold text-neutral-700">Description</th>
                  <th className="p-3 font-bold text-neutral-700">Women (%)</th>
                  <th className="p-3 font-bold text-neutral-700">Men (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-dark-700">
                <tr><td className="p-3 font-bold text-red-500">Essential Fat</td><td className="p-3">10 – 13%</td><td className="p-3">2 – 5%</td></tr>
                <tr><td className="p-3 font-bold text-green-600">Athletes</td><td className="p-3">14 – 20%</td><td className="p-3">6 – 13%</td></tr>
                <tr><td className="p-3 font-bold text-emerald-600">Fitness</td><td className="p-3">21 – 24%</td><td className="p-3">14 – 17%</td></tr>
                <tr className="bg-green-50/10"><td className="p-3 font-bold text-amber-500">Average Weight</td><td className="p-3">25 – 31%</td><td className="p-3">18 – 24%</td></tr>
                <tr><td className="p-3 font-bold text-red-700">Obese</td><td className="p-3">&ge; 32%</td><td className="p-3">&ge; 25%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <img
              src="/body-fat-categories.webp"
              alt="ACE body fat classification chart illustrating percentage ranges for essential fat, athletes, fitness, average, and obese categories for men and women."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 1: Visual breakdown of ACE body fat percentage classifications.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ────── IDEAL BODY FAT (JACKSON & POLLOCK) ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Ideal Body Fat by Age (Jackson & Pollock)</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          As humans age, the natural proportion of internal lipid stores increases slightly. The Jackson & Pollock method provides standard ideal targets for different age groups:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <img
              src="/body-fat-ideal.webp"
              alt="Ideal body fat curves showing recommended body fat percentages by age for men and women based on the Jackson & Pollock method."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 2: Ideal body fat curves by age for men and women.
            </p>
          </div>
          <div className="space-y-4">
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="p-3 font-bold text-neutral-700">Age Bracket</th>
                    <th className="p-3 font-bold text-neutral-700">Ideal Women (%)</th>
                    <th className="p-3 font-bold text-neutral-700">Ideal Men (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-dark-700">
                  <tr><td className="p-3">20</td><td className="p-3">17.7%</td><td className="p-3">8.5%</td></tr>
                  <tr><td className="p-3">25</td><td className="p-3">18.4%</td><td className="p-3">10.5%</td></tr>
                  <tr><td className="p-3">30</td><td className="p-3">19.3%</td><td className="p-3">12.7%</td></tr>
                  <tr><td className="p-3">35</td><td className="p-3">21.5%</td><td className="p-3">13.7%</td></tr>
                  <tr><td className="p-3">40</td><td className="p-3">22.2%</td><td className="p-3">15.3%</td></tr>
                  <tr><td className="p-3">45</td><td className="p-3">22.9%</td><td className="p-3">16.4%</td></tr>
                  <tr><td className="p-3">50</td><td className="p-3">25.2%</td><td className="p-3">18.9%</td></tr>
                  <tr><td className="p-3">55+</td><td className="p-3">26.3%</td><td className="p-3">20.9%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────── FORMULAS ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
            <FunctionSquare className="w-3 h-3" /> Mathematical Equations
          </span>
        </div>

        <div className="space-y-6 font-sans">
          <div>
            <h4 className="text-sm font-bold text-neutral-800 font-mono uppercase tracking-wider mb-2">1. The U.S. Navy Method Equations</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-3">
              Adopted by the military, these log equations require waist, neck, and height dimensions (and hips for women).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Men (US Customary)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BF% = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76
                </div>
              </div>
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Women (US Customary)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BF% = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Men (Metric)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BF% = 495 / [1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)] - 450
                </div>
              </div>
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Women (Metric)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BF% = 495 / [1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)] - 450
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-bold text-neutral-800 font-mono uppercase tracking-wider mb-2">2. The BMI Method (Deurenberg Formula)</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-3">
              Estimates body fat % purely using height, weight (BMI), age, and biological sex.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Adults (Age &ge; 15)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BF% = 1.20 × BMI + 0.23 × Age - 10.8 × gender - 5.4
                </div>
                <div className="text-[9px] font-mono text-neutral-500">
                  *gender = 1 for male, 0 for female.
                </div>
              </div>
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Children (Age &lt; 15)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BF% = 1.51 × BMI - 0.70 × Age - 3.6 × gender + 1.4
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────── RISKS ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="p-6 bg-red-50/40 border border-red-200 rounded-2xl space-y-3">
          <h4 className="text-base font-extrabold text-red-700 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" /> Risks of High Body Fat
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Carrying excess adipose tissue, particularly visceral fat around organs, raises metabolic and health risks:
          </p>
          <ul className="text-xs space-y-2 text-dark-600 pl-4 list-disc font-mono">
            <li><strong>Cardiovascular Issues</strong>: Atherosclerosis, heart attack, and high blood pressure.</li>
            <li><strong>Type 2 Diabetes</strong>: Visceral lipids decrease muscle and liver insulin sensitivity.</li>
            <li><strong>Obstructive Apnea</strong>: Airway obstruction during sleep due to neck fat tissue deposits.</li>
            <li><strong>Joint Degeneration</strong>: Mechanical joint overload on hips and knees.</li>
          </ul>
        </div>
        <div className="p-6 bg-blue-50/40 border border-blue-200 rounded-2xl space-y-3">
          <h4 className="text-base font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" /> Risks of Low Body Fat
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Adipose drop below essential distributions triggers physiological distress:
          </p>
          <ul className="text-xs space-y-2 text-dark-600 pl-4 list-disc font-mono">
            <li><strong>Hormonal Shutdown</strong>: Cessation of menstruation and reduced bone density in women.</li>
            <li><strong>Immune Impairment</strong>: High vulnerability to standard infection vectors.</li>
            <li><strong>Thermo-Regulation</strong>: Extreme hypothermia vulnerability due to lack of thermal fat barrier.</li>
            <li><strong>Chronic Fatigue</strong>: Depleted cellular energy storage and muscle breakdown.</li>
          </ul>
        </div>
      </motion.div>

      {/* ────── FAQ ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        itemScope
        itemType="https://schema.org/FAQPage"
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-dark-500" />
          <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {[
            { q: "How accurate is the U.S. Navy Body Fat Method?", a: "The Navy Method is highly accurate and reliable for the vast majority of individuals, usually aligning within 2-3% of clinical DXA scans. It relies on standard fat deposit areas (abdominal visceral fat for waist circumference, and sub-occipital neck fat) to calculate fat density." },
            { q: "What is the difference between BMI and Body Fat Percentage?", a: "BMI (Body Mass Index) is a crude ratio of weight to height and cannot distinguish between muscle and fat. Body Fat Percentage calculates the exact portion of your total body weight composed of fat tissue, providing a far more accurate representation of body composition." },
            { q: "How does gender affect body fat targets?", a: "Women have higher essential body fat requirements (10-13%) than men (2-5%). This biological fat is stored in breast tissue, hips, and thighs, and is critical for normal hormonal production, reproductive cycles, and basic metabolic functions." },
            { q: "What is Lean Body Mass (LBM)?", a: "Lean Body Mass represents everything in your body that is not fat. This includes skeletal muscle, bone density, organs, blood, connective tissue, and water weight. It is calculated by subtracting your body fat mass from your total weight." }
          ].map((qa, i) => (
            <details key={i} className="group p-4 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors" itemScope itemType="https://schema.org/Question">
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
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-300 font-mono mb-1.5">
              <Zap className="w-3.5 h-3.5" /> Want more?
            </div>
            <h3 className="text-lg font-extrabold mb-1">Build a custom calculator</h3>
            <p className="text-sm text-white/70 mb-3 font-normal leading-relaxed font-sans">Need a calculation we don't have? Build your own in minutes, no code required.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
              Open the builder <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        <Link href="/calculators" className="group p-5 sm:p-6 bg-white border border-neutral-200 hover:border-primary-400 rounded-2xl transition-all">
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark-500 font-mono mb-1.5">
              <CalcIcon className="w-3 h-3" /> More tools
            </div>
            <h3 className="text-lg font-extrabold text-dark-900 mb-1">Browse 500+ calculators</h3>
            <p className="text-sm text-dark-600 mb-3 font-normal leading-relaxed font-sans">Explore the full library across math, finance, health, conversion, and more.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-dark-700 group-hover:gap-2 group-hover:text-primary-700 transition-all">
              See all calculators <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}

function BmrCustomSEOContent() {
  return (
    <section className="mt-12 sm:mt-16 space-y-12" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="description" content="BMR Calculator estimates Basal Metabolic Rate (BMR) using Mifflin-St Jeor, Revised Harris-Benedict, and Katch-McArdle formulas." />

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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-3 tracking-tight">What is Basal Metabolic Rate (BMR)?</h2>
          <p className="text-base text-dark-600 leading-relaxed">
            Your <strong>Basal Metabolic Rate (BMR)</strong> is the total number of calories your body needs to perform basic, life-sustaining functions while at complete rest. These functions include breathing, blood circulation, cell production, nutrient processing, and maintaining body temperature.
          </p>
          <p className="text-base text-dark-600 leading-relaxed mt-4">
            BMR accounts for the largest portion of your daily calorie expenditure—typically 60% to 75% for most sedentary individuals. By calculating your BMR, you establish a baseline that helps you determine your **Total Daily Energy Expenditure (TDEE)**, allowing you to design weight loss, muscle gain, or maintenance nutrition plans with scientific precision.
          </p>
        </motion.div>
      </div>

      {/* ────── BMR BY WEIGHT REFERENCE ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Standard BMR Estimates by Body Weight</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          While body composition, age, and height play major roles, body weight is the strongest predictor of BMR. The table below outlines standard BMR estimates for typical weights in active adult ranges:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="p-3 font-bold text-neutral-700">Weight (kg / lbs)</th>
                  <th className="p-3 font-bold text-neutral-700">Men BMR (kcal/day)</th>
                  <th className="p-3 font-bold text-neutral-700">Women BMR (kcal/day)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-dark-700">
                <tr><td className="p-3 font-bold">50 kg / 110 lbs</td><td className="p-3">1,350 kcal</td><td className="p-3">1,210 kcal</td></tr>
                <tr><td className="p-3 font-bold">60 kg / 132 lbs</td><td className="p-3">1,480 kcal</td><td className="p-3">1,320 kcal</td></tr>
                <tr><td className="p-3 font-bold">70 kg / 154 lbs</td><td className="p-3">1,610 kcal</td><td className="p-3">1,430 kcal</td></tr>
                <tr><td className="p-3 font-bold">80 kg / 176 lbs</td><td className="p-3">1,740 kcal</td><td className="p-3">1,540 kcal</td></tr>
                <tr><td className="p-3 font-bold">90 kg / 198 lbs</td><td className="p-3">1,870 kcal</td><td className="p-3">1,650 kcal</td></tr>
                <tr><td className="p-3 font-bold">100 kg / 220 lbs</td><td className="p-3">2,000 kcal</td><td className="p-3">1,760 kcal</td></tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <img
              src="/bmr-by-weight.webp"
              alt="BMR curve graph showing basal metabolic rate calories per day plotted against weight in kilograms and pounds for both men and women."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 1: Comparison of typical BMR values by weight between men and women.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ────── TDEE MULTIPLIERS REFERENCE ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Understanding TDEE and Activity Multipliers</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          Your Total Daily Energy Expenditure (TDEE) is calculated by multiplying your base BMR by an activity factor. This accounts for digestion energy and physical motion levels:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-2 lg:order-2">
            <img
              src="/bmr-tdee-breakdown.webp"
              alt="Circular infographic displaying activity level multipliers for TDEE, showing values from 1.2x sedentary up to 1.9x extremely active."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 2: Distribution of TDEE activity factor multipliers.
            </p>
          </div>
          <div className="space-y-4 lg:order-1">
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="p-3 font-bold text-neutral-700">Activity Level</th>
                    <th className="p-3 font-bold text-neutral-700">Multiplier</th>
                    <th className="p-3 font-bold text-neutral-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-dark-700">
                  <tr><td className="p-3 font-bold">Sedentary</td><td className="p-3">1.2x</td><td className="p-3">Desk job, little to no weekly exercise.</td></tr>
                  <tr><td className="p-3 font-bold">Lightly Active</td><td className="p-3">1.375x</td><td className="p-3">Light exercise or sports 1–3 days/week.</td></tr>
                  <tr><td className="p-3 font-bold">Moderately Active</td><td className="p-3">1.465x</td><td className="p-3">Moderate exercise or sports 4–5 days/week.</td></tr>
                  <tr><td className="p-3 font-bold">Active</td><td className="p-3">1.55x</td><td className="p-3">Intense training or sports 3–4 days/week.</td></tr>
                  <tr><td className="p-3 font-bold">Very Active</td><td className="p-3">1.725x</td><td className="p-3">Hard exercise or heavy training 6–7 days/week.</td></tr>
                  <tr><td className="p-3 font-bold">Super Active</td><td className="p-3">1.9x</td><td className="p-3">Very intense exercise daily, or physical job.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────── FORMULAS ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
            <FunctionSquare className="w-3 h-3" /> BMR Estimation Equations
          </span>
        </div>

        <div className="space-y-6 font-sans">
          <div>
            <h4 className="text-sm font-bold text-neutral-800 font-mono uppercase tracking-wider mb-2">1. The Mifflin-St Jeor Equation (Modern Standard)</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-3">
              Developed in 1990, it is currently the most recommended formula by the Academy of Nutrition and Dietetics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Men</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BMR = 10 × weight (kg) + 6.25 × height (cm) - 5 × age (y) + 5
                </div>
              </div>
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Women</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BMR = 10 × weight (kg) + 6.25 × height (cm) - 5 × age (y) - 161
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-bold text-neutral-800 font-mono uppercase tracking-wider mb-2">2. The Revised Harris-Benedict Equation</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-3">
              Originally published in 1918, it was revised in 1984 by Roza and Shizgal for improved accuracy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Men</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BMR = 13.397 × weight (kg) + 4.799 × height (cm) - 5.677 × age (y) + 88.362
                </div>
              </div>
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Women</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  BMR = 9.247 × weight (kg) + 3.098 × height (cm) - 4.330 × age (y) + 447.593
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-bold text-neutral-800 font-mono uppercase tracking-wider mb-2">3. The Katch-McArdle Formula (Lean Mass Based)</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-3">
              If you know your body fat percentage, this is the most accurate formula as it calculates BMR strictly using Lean Body Mass (LBM).
            </p>
            <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">Both Sexes</div>
              <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                BMR = 370 + 21.6 × LBM (kg) &nbsp;&nbsp;[where LBM = weight × (1 - body fat % / 100)]
              </div>
            </div>
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
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-dark-500" />
          <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {[
            { q: "How do I increase my BMR?", a: "The most effective way to increase your BMR is by building skeletal muscle tissue. Muscle is metabolically active and burns more calories at rest than fat tissue. Consuming adequate protein and staying hydrated also support baseline metabolism." },
            { q: "Can you eat below your BMR?", a: "Eating below your BMR is generally not recommended unless under medical supervision. Your BMR represents the energy needed for basic cellular life; eating below it for extended periods triggers metabolic adaptation (slowdown), fatigue, nutrient deficiencies, and muscle loss." },
            { q: "What is the difference between BMR and RMR?", a: "BMR requires strict measurement conditions: waking up after 8 hours of sleep, 12 hours of fasting, in a dark, temperature-controlled environment. RMR (Resting Metabolic Rate) is measured under less restrictive conditions (normal resting state) and is typically 5-10% higher than BMR." },
            { q: "How accurate are BMR formulas?", a: "For most people, the Mifflin-St Jeor equation is within 10% of actual metabolic output. However, for highly muscular individuals or those with high body fat, the Katch-McArdle equation is far more accurate because it directly incorporates lean mass composition." }
          ].map((qa, i) => (
            <details key={i} className="group p-4 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors" itemScope itemType="https://schema.org/Question">
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
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-300 font-mono mb-1.5">
              <Zap className="w-3.5 h-3.5" /> Want more?
            </div>
            <h3 className="text-lg font-extrabold mb-1">Build a custom calculator</h3>
            <p className="text-sm text-white/70 mb-3 font-normal leading-relaxed font-sans">Need a calculation we don't have? Build your own in minutes, no code required.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
              Open the builder <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        <Link href="/calculators" className="group p-5 sm:p-6 bg-white border border-neutral-200 hover:border-primary-400 rounded-2xl transition-all">
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark-500 font-mono mb-1.5">
              <CalcIcon className="w-3 h-3" /> More tools
            </div>
            <h3 className="text-lg font-extrabold text-dark-900 mb-1">Browse 500+ calculators</h3>
            <p className="text-sm text-dark-600 mb-3 font-normal leading-relaxed font-sans">Explore the full library across math, finance, health, conversion, and more.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-dark-700 group-hover:gap-2 group-hover:text-primary-700 transition-all">
              See all calculators <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}

function WaterIntakeCustomSEOContent() {
  return (
    <section className="mt-12 sm:mt-16 space-y-12" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="description" content="Water Intake Calculator estimates your daily recommended fluid intake based on body weight, climate, exercise duration, and pregnancy/nursing status." />

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
              <CalcIcon className="w-3 h-3" /> Scientific Hydration
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-3 tracking-tight">Why Does Tracking Water Intake Matter?</h2>
          <p className="text-base text-dark-600 leading-relaxed">
            Water makes up roughly 60% of human body weight and plays a crucial role in virtually every biological process: regulating body temperature, lubricating joints, flushing out waste, carrying nutrients to cells, and maintaining cognitive performance. 
          </p>
          <p className="text-base text-dark-600 leading-relaxed mt-4">
            Even mild dehydration (losing just 1–2% of body weight in fluids) can lead to headaches, brain fog, fatigue, reduced physical stamina, and muscle cramps. Estimating your personal daily baseline lets you target your hydration goals accurately, helping you optimize athletic performance, recovery, digestive health, and energy levels.
          </p>
        </motion.div>
      </div>

      {/* ────── HYDRATION BY WEIGHT CHART ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Daily Water Recommendations by Body Weight</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          Your body mass is the single strongest indicator of baseline water requirements. Larger bodies contain more cells and metabolic processes, requiring more fluid to sustain chemical equilibria. The table below represents baseline recommendations before exercise and climate factors are added:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="p-3 font-bold text-neutral-700">Weight (kg / lbs)</th>
                  <th className="p-3 font-bold text-neutral-700">Daily Baseline (Liters)</th>
                  <th className="p-3 font-bold text-neutral-700">Daily Baseline (fl oz)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-dark-700">
                <tr><td className="p-3 font-bold">50 kg / 110 lbs</td><td className="p-3">1.8 L</td><td className="p-3">60 fl oz</td></tr>
                <tr><td className="p-3 font-bold">60 kg / 132 lbs</td><td className="p-3">2.1 L</td><td className="p-3">71 fl oz</td></tr>
                <tr><td className="p-3 font-bold">70 kg / 154 lbs</td><td className="p-3">2.5 L</td><td className="p-3">83 fl oz</td></tr>
                <tr><td className="p-3 font-bold">80 kg / 176 lbs</td><td className="p-3">2.8 L</td><td className="p-3">95 fl oz</td></tr>
                <tr><td className="p-3 font-bold">90 kg / 198 lbs</td><td className="p-3">3.2 L</td><td className="p-3">107 fl oz</td></tr>
                <tr><td className="p-3 font-bold">100 kg / 220 lbs</td><td className="p-3">3.5 L</td><td className="p-3">118 fl oz</td></tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <img
              src="/hydration-by-weight.webp"
              alt="Daily recommended water intake chart in liters plotted against body weight in kilograms and pounds."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 1: Baseline water needs based on total body weight.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ────── ENVIRONMENTAL & LIFECYCLE GUIDELINES ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Factors That Alter Hydration Needs</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          Standard water targets must be customized to fit your current lifestyle and environment. Sweat rates, physical motion, climate heat, and physiological conditions alter your fluid expenditure rate:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-2 lg:order-2">
            <img
              src="/hydration-guidelines.webp"
              alt="Vector infographic showing factors that influence daily water needs, including climate, activity level, and pregnancy/lactation offsets."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 2: Summary of physiological and environmental factors affecting daily water requirements.
            </p>
          </div>
          <div className="space-y-4 lg:order-1">
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    <th className="p-3 font-bold text-neutral-700">Factor</th>
                    <th className="p-3 font-bold text-neutral-700">Adjustment</th>
                    <th className="p-3 font-bold text-neutral-700">Description / Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-dark-700">
                  <tr>
                    <td className="p-3 font-bold">Physical Exercise</td>
                    <td className="p-3">+500 ml per 30m</td>
                    <td className="p-3">Compensates for fluid lost through respiration and sweat.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Hot / Humid Climate</td>
                    <td className="p-3">+15% baseline</td>
                    <td className="p-3">Elevated temperatures trigger thermoregulatory sweating.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Cold Climate</td>
                    <td className="p-3">-10% baseline</td>
                    <td className="p-3">Cold air reduces perspiration, slightly lowering demand.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Pregnancy</td>
                    <td className="p-3">+300 ml / day</td>
                    <td className="p-3">Supports fetal circulation, amniotic fluid volume, and blood plasma expansion.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Breastfeeding</td>
                    <td className="p-3">+750 ml / day</td>
                    <td className="p-3">Breast milk is roughly 87% water; nursing mothers require offsets.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────── MATH & FORMULA ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
            <FunctionSquare className="w-3 h-3" /> Worked Hydration Calculations
          </span>
        </div>

        <div className="space-y-6 font-sans">
          <div>
            <h4 className="text-sm font-bold text-neutral-800 font-mono uppercase tracking-wider mb-2">How Daily Hydration is Calculated</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-3">
              The calculator uses weight to determine a baseline fluid volume of 35 ml per kilogram, increments this baseline by 500 ml for every 30 minutes of training, applies climate multiplier scaling, and appends pregnancy or breastfeeding constant offsets.
            </p>
            
            <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">1. Metric System Example</div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Calculate target for a 70 kg woman exercising for 30 minutes in a hot/humid climate:
                </p>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  Baseline = 70 kg × 35 ml = 2,450 ml <br />
                  Exercise Offset = (30 mins / 30 mins) × 500 ml = 500 ml <br />
                  Climate Scaling = (2,450 ml + 500 ml) × 1.15 = 3,393 ml
                </div>
              </div>

              <div className="border-t border-neutral-250 pt-3 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">2. US Customary / Imperial Example</div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Calculate target for a 150 lbs man exercising for 60 minutes in a cold climate:
                </p>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  Weight in kg = 150 lbs × 0.453592 = 68.04 kg <br />
                  Baseline = 68.04 kg × 35 ml = 2,381 ml <br />
                  Exercise Offset = (60 mins / 30 mins) × 500 ml = 1,000 ml <br />
                  Climate Scaling = (2,381 ml + 1,000 ml) × 0.90 = 3,043 ml (~103 fl oz)
                </div>
              </div>
            </div>
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
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-dark-500" />
          <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {[
            { q: "Does coffee, tea, or soda count towards my water intake?", a: "Yes. Clinical studies show that caffeinated beverages, sodas, and juices contribute to your overall hydration levels. However, water is still the ideal choice as it contains no added sugars, artificial sweeteners, or caffeine, which has a mild, non-significant diuretic effect." },
            { q: "Can you drink too much water?", a: "Yes. Drinking excessive amounts of water in a short window can lead to hyponatremia (water intoxication). This condition occurs when blood sodium levels drop dangerously low, causing cellular swelling, confusion, headaches, and in severe cases, medical emergencies." },
            { q: "How do I check if I am hydrated without a calculator?", a: "The easiest way is to inspect your urine color. Light straw or pale yellow urine indicates healthy hydration levels. Clear urine means you may be overhydrating, while dark yellow or amber-colored urine is a clear warning sign of dehydration." },
            { q: "Does food contribute to my daily water requirement?", a: "Yes. Approximately 20% of the average person's daily fluid intake comes from food moisture. Fruits and vegetables like watermelon, strawberries, cucumbers, and zucchini are over 90% water by weight and are excellent sources of hydration." }
          ].map((qa, i) => (
            <details key={i} className="group p-4 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors" itemScope itemType="https://schema.org/Question">
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
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-300 font-mono mb-1.5">
              <Zap className="w-3.5 h-3.5" /> Want more?
            </div>
            <h3 className="text-lg font-extrabold mb-1">Build a custom calculator</h3>
            <p className="text-sm text-white/70 mb-3 font-normal leading-relaxed font-sans">Need a calculation we don't have? Build your own in minutes, no code required.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
              Open the builder <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        <Link href="/calculators" className="group p-5 sm:p-6 bg-white border border-neutral-200 hover:border-primary-400 rounded-2xl transition-all">
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark-500 font-mono mb-1.5">
              <CalcIcon className="w-3 h-3" /> More tools
            </div>
            <h3 className="text-lg font-extrabold text-dark-900 mb-1">Browse 500+ calculators</h3>
            <p className="text-sm text-dark-600 mb-3 font-normal leading-relaxed font-sans">Explore the full library across math, finance, health, conversion, and more.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-dark-700 group-hover:gap-2 group-hover:text-primary-700 transition-all">
              See all calculators <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}

function MacroCustomSEOContent() {
  return (
    <section className="mt-12 sm:mt-16 space-y-12" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="description" content="Macronutrient Calculator estimates your target calories and splits them into protein, carbohydrates, and fats based on preset or custom diets." />

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
              <CalcIcon className="w-3 h-3" /> About macronutrients
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-3 tracking-tight">What are Macronutrients (Macros)?</h2>
          <p className="text-base text-dark-600 leading-relaxed">
            Macronutrients are the chemical compounds humans consume in largest quantities to obtain energy and raw materials for growth, metabolism, and bodily functions. They are composed of three primary groups: **Proteins**, **Carbohydrates (Carbs)**, and **Fats (Lipids)**.
          </p>
          <p className="text-base text-dark-600 leading-relaxed mt-4">
            While calories determine your weight gain or loss, the distribution of those calories across the three macros determines your body composition (muscle vs. fat ratio), metabolic health, hormone levels, and energy curves throughout the day. By calculating your personal macro ratios, you can target specific fitness and athletic outcomes.
          </p>
        </motion.div>
      </div>

      {/* ────── MACRO DIETS REFERENCE ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Standard Diet Macro Ratios Comparison</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          Different nutritional strategies distribute daily calories across macros to trigger specific metabolic adaptations. The table below displays standard target ratios for typical health presets:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="p-3 font-bold text-neutral-700">Diet Strategy</th>
                  <th className="p-3 font-bold text-neutral-700">Protein (%)</th>
                  <th className="p-3 font-bold text-neutral-700">Carbs (%)</th>
                  <th className="p-3 font-bold text-neutral-700">Fat (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-dark-700">
                <tr><td className="p-3 font-bold">Balanced / Zone Diet</td><td className="p-3">30%</td><td className="p-3">40%</td><td className="p-3">30%</td></tr>
                <tr><td className="p-3 font-bold">High Protein / Bodybuilding</td><td className="p-3">35%</td><td className="p-3">35%</td><td className="p-3">30%</td></tr>
                <tr><td className="p-3 font-bold">Low Carb / Fat Adaptation</td><td className="p-3">40%</td><td className="p-3">20%</td><td className="p-3">40%</td></tr>
                <tr><td className="p-3 font-bold">Keto / Very Low Carb</td><td className="p-3">25%</td><td className="p-3">5%</td><td className="p-3">75%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <img
              src="/macro-diets.webp"
              alt="Macronutrient ratio pie charts for Balanced, High Protein, Low Carb, and Keto diet programs."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 1: Visual comparison of calorie distribution in common diets.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ────── MACRO FOOD SOURCES ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Understanding Macronutrient Functions</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          Each macro plays a unique role in your body's survival and performance. Choosing whole food sources ensures you consume quality micronutrients alongside macros:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-2 lg:order-2">
            <img
              src="/macro-sources.webp"
              alt="Modern health infographic showing healthy whole food sources for protein, carbohydrates, and lipids."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 2: Food groups rich in proteins, carbs, and fats.
            </p>
          </div>
          <div className="space-y-4 lg:order-1 font-sans text-xs">
            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
              <span className="font-bold text-blue-700 block uppercase font-mono tracking-wide">1. Proteins (4 kcal/gram)</span>
              <p className="text-dark-600 leading-relaxed">
                The building blocks of body tissues, muscles, enzymes, and hormones. Quality sources include chicken breast, lean beef, fish, eggs, tofu, and legumes.
              </p>
            </div>
            <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-xl space-y-1">
              <span className="font-bold text-orange-700 block uppercase font-mono tracking-wide">2. Carbohydrates (4 kcal/gram)</span>
              <p className="text-dark-600 leading-relaxed">
                The body's primary and most efficient energy source. Complex sources include oats, sweet potatoes, brown rice, quinoa, and vegetables.
              </p>
            </div>
            <div className="p-4 bg-yellow-50/50 border border-yellow-250 rounded-xl space-y-1">
              <span className="font-bold text-yellow-700 block uppercase font-mono tracking-wide">3. Fats (9 kcal/gram)</span>
              <p className="text-dark-600 leading-relaxed">
                Critical for hormone synthesis, cell membrane structure, and absorbing fat-soluble vitamins (A, D, E, K). Sources include avocados, olive oil, nuts, and seeds.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────── FORMULAS & WORKED EXAMPLES ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
            <FunctionSquare className="w-3 h-3" /> Converting Calories to Macro Grams
          </span>
        </div>

        <div className="space-y-6 font-sans">
          <div>
            <h4 className="text-sm font-bold text-neutral-800 font-mono uppercase tracking-wider mb-2">The Calculation Equations</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-3">
              To convert total daily calories into exact grams for each macronutrient, multiply the total calorie target by each macro's percentage split, and divide by the calorie density per gram:
            </p>
            <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-4 font-mono text-[10px] text-dark-900 leading-relaxed">
              <div>
                <div className="font-bold text-neutral-500 uppercase mb-1">Mathematical Model</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg text-center font-bold text-xs">
                  Protein (g) = [Calories × Protein %] / 4 <br />
                  Carbohydrates (g) = [Calories × Carbs %] / 4 <br />
                  Fat (g) = [Calories × Fat %] / 9
                </div>
              </div>
              <div className="border-t border-neutral-200 pt-3">
                <div className="font-bold text-neutral-500 uppercase mb-1">Worked Example</div>
                <p className="text-[11px] text-neutral-600 font-sans mb-2">
                  Target = 2,000 kcal, Balanced Diet Preset (30% Protein, 40% Carbs, 30% Fat):
                </p>
                <div className="bg-neutral-50 p-2.5 rounded-lg text-neutral-800">
                  Protein: [2,000 × 0.30] / 4 = 600 / 4 = <strong>150g</strong> (600 kcal) <br />
                  Carbs: [2,000 × 0.40] / 4 = 800 / 4 = <strong>200g</strong> (800 kcal) <br />
                  Fat: [2,000 × 0.30] / 9 = 600 / 9 = <strong>67g</strong> (600 kcal)
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────── FOOD DATABASE TABLE ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Macronutrient Content in Common Foods</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          Use the reference table below to see standard nutrient values (protein, carbs, and fat in grams) per serving size:
        </p>

        <div className="overflow-x-auto border border-neutral-200 rounded-xl">
          <table className="w-full text-left border-collapse text-[10px] font-mono">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-2.5 font-bold text-neutral-700">Food Item</th>
                <th className="p-2.5 font-bold text-neutral-700">Serving Size</th>
                <th className="p-2.5 font-bold text-neutral-700 text-right">Protein</th>
                <th className="p-2.5 font-bold text-neutral-700 text-right">Carbs</th>
                <th className="p-2.5 font-bold text-neutral-700 text-right">Fat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-dark-700">
              {/* FRUIT */}
              <tr className="bg-neutral-50/50"><td colSpan={5} className="p-2 font-bold text-neutral-500 uppercase tracking-wider text-[9px]">Fruits</td></tr>
              <tr><td className="p-2">Apple</td><td className="p-2">1 (4 oz.)</td><td className="p-2 text-right">0.27g</td><td className="p-2 text-right">14.36g</td><td className="p-2 text-right">0.18g</td></tr>
              <tr><td className="p-2">Banana</td><td className="p-2">1 (6 oz.)</td><td className="p-2 text-right">1.85g</td><td className="p-2 text-right">38.85g</td><td className="p-2 text-right">0.56g</td></tr>
              <tr><td className="p-2">Grapes</td><td className="p-2">1 cup</td><td className="p-2 text-right">1.15g</td><td className="p-2 text-right">28.96g</td><td className="p-2 text-right">0.26g</td></tr>
              <tr><td className="p-2">Orange</td><td className="p-2">1 (4 oz.)</td><td className="p-2 text-right">0.79g</td><td className="p-2 text-right">11.79g</td><td className="p-2 text-right">0.23g</td></tr>
              <tr><td className="p-2">Watermelon</td><td className="p-2">1 cup</td><td className="p-2 text-right">0.93g</td><td className="p-2 text-right">11.48g</td><td className="p-2 text-right">0.23g</td></tr>
              {/* VEGETABLES */}
              <tr className="bg-neutral-50/50"><td colSpan={5} className="p-2 font-bold text-neutral-500 uppercase tracking-wider text-[9px]">Vegetables</td></tr>
              <tr><td className="p-2">Asparagus</td><td className="p-2">1 cup</td><td className="p-2 text-right">2.95g</td><td className="p-2 text-right">5.2g</td><td className="p-2 text-right">0.16g</td></tr>
              <tr><td className="p-2">Broccoli</td><td className="p-2">1 cup</td><td className="p-2 text-right">2.57g</td><td className="p-2 text-right">6.04g</td><td className="p-2 text-right">0.34g</td></tr>
              <tr><td className="p-2">Carrots</td><td className="p-2">1 cup</td><td className="p-2 text-right">1.19g</td><td className="p-2 text-right">12.26g</td><td className="p-2 text-right">0.31g</td></tr>
              <tr><td className="p-2">Cucumber</td><td className="p-2">4 oz.</td><td className="p-2 text-right">0.67g</td><td className="p-2 text-right">2.45g</td><td className="p-2 text-right">0.18g</td></tr>
              <tr><td className="p-2">Lettuce</td><td className="p-2">1 cup</td><td className="p-2 text-right">0.5g</td><td className="p-2 text-right">1.63g</td><td className="p-2 text-right">0.08g</td></tr>
              {/* PROTEINS */}
              <tr className="bg-neutral-50/50"><td colSpan={5} className="p-2 font-bold text-neutral-500 uppercase tracking-wider text-[9px]">Proteins</td></tr>
              <tr><td className="p-2">Beef, cooked</td><td className="p-2">2 oz.</td><td className="p-2 text-right">14.2g</td><td className="p-2 text-right">0g</td><td className="p-2 text-right">10.4g</td></tr>
              <tr><td className="p-2">Chicken breast, cooked</td><td className="p-2">2 oz.</td><td className="p-2 text-right">16g</td><td className="p-2 text-right">0g</td><td className="p-2 text-right">1.84g</td></tr>
              <tr><td className="p-2">Egg</td><td className="p-2">1 large</td><td className="p-2 text-right">6.29g</td><td className="p-2 text-right">0.38g</td><td className="p-2 text-right">4.97g</td></tr>
              <tr><td className="p-2">Tofu</td><td className="p-2">4 oz.</td><td className="p-2 text-right">7.82g</td><td className="p-2 text-right">2.72g</td><td className="p-2 text-right">3.06g</td></tr>
              <tr><td className="p-2">Shrimp, cooked</td><td className="p-2">2 oz.</td><td className="p-2 text-right">15.45g</td><td className="p-2 text-right">0.69g</td><td className="p-2 text-right">1.32g</td></tr>
              {/* SNACKS */}
              <tr className="bg-neutral-50/50"><td colSpan={5} className="p-2 font-bold text-neutral-500 uppercase tracking-wider text-[9px]">Meals & Snacks</td></tr>
              <tr><td className="p-2">Bread, white</td><td className="p-2">1 slice (1 oz.)</td><td className="p-2 text-right">1.91g</td><td className="p-2 text-right">12.65g</td><td className="p-2 text-right">0.82g</td></tr>
              <tr><td className="p-2">Cheeseburger</td><td className="p-2">1 sandwich</td><td className="p-2 text-right">14.77g</td><td className="p-2 text-right">31.75g</td><td className="p-2 text-right">15.15g</td></tr>
              <tr><td className="p-2">Pizza</td><td className="p-2">1 slice (14")</td><td className="p-2 text-right">13.32g</td><td className="p-2 text-right">33.98g</td><td className="p-2 text-right">12.13g</td></tr>
              <tr><td className="p-2">Rice, brown, cooked</td><td className="p-2">1 cup</td><td className="p-2 text-right">4.5g</td><td className="p-2 text-right">44.8g</td><td className="p-2 text-right">1.6g</td></tr>
              {/* DAIRY */}
              <tr className="bg-neutral-50/50"><td colSpan={5} className="p-2 font-bold text-neutral-500 uppercase tracking-wider text-[9px]">Beverages & Dairy</td></tr>
              <tr><td className="p-2">Milk (Whole)</td><td className="p-2">1 cup</td><td className="p-2 text-right">7.86g</td><td className="p-2 text-right">11.03g</td><td className="p-2 text-right">7.93g</td></tr>
              <tr><td className="p-2">Yogurt (low-fat)</td><td className="p-2">1 cup</td><td className="p-2 text-right">12.86g</td><td className="p-2 text-right">17.25g</td><td className="p-2 text-right">3.8g</td></tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ────── FAQ ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        itemScope
        itemType="https://schema.org/FAQPage"
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-dark-500" />
          <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {[
            { q: "How much protein do I need to build muscle?", a: "To optimize muscle hypertrophy, target 1.6 to 2.2 grams of protein per kilogram of body weight (approx. 0.7 to 1.0 grams per pound) daily. Consuming adequate protein ensures positive nitrogen balance and repairs micro-tears in muscle fibers after resistance training." },
            { q: "Is a Keto diet safe for weight loss?", a: "Yes, the ketogenic diet (very low carb, high fat) is safe and effective for many people. It triggers a metabolic state called ketosis, where the liver burns fat instead of glycogen for fuel. However, highly active athletes requiring immediate glycolytic power may perform better with higher carbohydrates." },
            { q: "What happens if I eat too little fat?", a: "Healthy lipids are critical for hormonal balance, joint health, and brain functions. Eating below 15–20% of your daily calories in fats can reduce testosterone/estrogen levels, dry your skin, cause vitamin deficiencies, and cause fatigue." },
            { q: "Should I track net carbs or total carbs?", a: "For general calorie tracking, total carbohydrates are recommended. For keto or diabetic management, net carbs (total carbs minus fiber and sugar alcohols) are tracked, as fiber is not digested into glucose and does not affect blood insulin levels." }
          ].map((qa, i) => (
            <details key={i} className="group p-4 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors" itemScope itemType="https://schema.org/Question">
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
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-300 font-mono mb-1.5">
              <Zap className="w-3.5 h-3.5" /> Want more?
            </div>
            <h3 className="text-lg font-extrabold mb-1">Build a custom calculator</h3>
            <p className="text-sm text-white/70 mb-3 font-normal leading-relaxed font-sans">Need a calculation we don't have? Build your own in minutes, no code required.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
              Open the builder <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        <Link href="/calculators" className="group p-5 sm:p-6 bg-white border border-neutral-200 hover:border-primary-400 rounded-2xl transition-all">
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark-500 font-mono mb-1.5">
              <CalcIcon className="w-3 h-3" /> More tools
            </div>
            <h3 className="text-lg font-extrabold text-dark-900 mb-1">Browse 500+ calculators</h3>
            <p className="text-sm text-dark-600 mb-3 font-normal leading-relaxed font-sans">Explore the full library across math, finance, health, conversion, and more.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-dark-700 group-hover:gap-2 group-hover:text-primary-700 transition-all">
              See all calculators <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}

function OneRepMaxCustomSEOContent() {
  return (
    <section className="mt-12 sm:mt-16 space-y-12" itemScope itemType="https://schema.org/WebPage">
      <meta itemProp="description" content="One Rep Max (1RM) Calculator estimates the maximum weight you can lift for a single repetition using Epley, Brzycki, Lombardi, Mayhew, and Wathan formulas." />

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
              <CalcIcon className="w-3 h-3" /> About 1RM Estimation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-3 tracking-tight">What is a One Rep Max (1RM)?</h2>
          <p className="text-base text-dark-600 leading-relaxed">
            Your **One Rep Max (1RM)** is the maximum amount of weight you can lift for a single repetition of a given exercise with proper technique. It is the gold standard metric used in powerlifting, Olympic lifting, and general strength training to gauge absolute muscle strength.
          </p>
          <p className="text-base text-dark-600 leading-relaxed mt-4">
            Rather than performing a risky maximal effort lift, which can lead to injury and nervous system fatigue, lifters calculate their 1RM by lifting a lighter submaximal load for multiple repetitions. Mathematical formulas then project your absolute maximum from this submaximal performance, allowing you to design percentage-based strength templates safely and effectively.
          </p>
        </motion.div>
      </div>

      {/* ────── 1RM TRAINING ZONES ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Using 1RM to Target Training Zones</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          Once you establish your estimated 1RM, strength programs use percentages of this number to target specific neuromuscular adaptions:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="overflow-x-auto border border-neutral-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="p-3 font-bold text-neutral-700">Intensity Zone</th>
                  <th className="p-3 font-bold text-neutral-700">% of 1RM</th>
                  <th className="p-3 font-bold text-neutral-700">Target Reps</th>
                  <th className="p-3 font-bold text-neutral-700">Adaptation Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-dark-700">
                <tr><td className="p-3 font-bold">Absolute Strength / Power</td><td className="p-3">85% – 100%</td><td className="p-3">1 – 5 reps</td><td className="p-3">Recruits high-threshold motor units to optimize myofibrillar density.</td></tr>
                <tr><td className="p-3 font-bold">Hypertrophy / Muscle Growth</td><td className="p-3">65% – 80%</td><td className="p-3">6 – 12 reps</td><td className="p-3">Maximizes metabolic stress and sarcoplasmic volume growth.</td></tr>
                <tr><td className="p-3 font-bold">Local Muscular Endurance</td><td className="p-3">50% – 60%</td><td className="p-3">15 – 25+ reps</td><td className="p-3">Enhances capillary density, mitochondria concentration, and buffering capacity.</td></tr>
              </tbody>
            </table>
          </div>
          <div className="space-y-2">
            <img
              src="/1rm-training-zones.webp"
              alt="Vector chart mapping One Rep Max percentages to athletic training outcomes: Strength, Hypertrophy, and Endurance."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 1: Percentage of 1RM training zone distributions.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ────── SAFETY INFOGRAPHIC ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Guidelines for Safe Strength Testing</h3>
        <p className="text-sm text-dark-600 leading-relaxed">
          Directly testing a 1-repetition maximum places extreme tension on joints, tendons, and muscles. Follow these clinical safety principles during your heavy compound sessions:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-2 lg:order-2">
            <img
              src="/1rm-testing-safety.webp"
              alt="Strength training safety infographic outlining warm-ups, using spotters, setting safety bars, and maintaining strict technique."
              className="w-full h-auto rounded-xl border border-neutral-200 shadow-sm"
            />
            <p className="text-[10px] text-neutral-500 text-center mt-2 font-mono">
              Figure 2: Checklist for safety during maximal load testing.
            </p>
          </div>
          <div className="space-y-4 lg:order-1 font-sans text-xs">
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <span className="font-bold text-neutral-700 block font-mono uppercase tracking-wider mb-1">1. Set Up Safety Pins</span>
              <p className="text-dark-600 leading-relaxed">
                Always adjust the safety racks or pins in a power rack to a level just below the bottom of your range of motion. This allows you to bail out safely if you fail a lift.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <span className="font-bold text-neutral-700 block font-mono uppercase tracking-wider mb-1">2. Recruit a Qualified Spotter</span>
              <p className="text-dark-600 leading-relaxed">
                When benching or squatting heavy loads, a spotter provides immediate assistance if you hit a sticking point or fail to complete the concentric phase of the lift.
              </p>
            </div>
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
              <span className="font-bold text-neutral-700 block font-mono uppercase tracking-wider mb-1">3. Warm-Up Progressively</span>
              <p className="text-dark-600 leading-relaxed">
                Never jump straight to a working weight. Perform a thorough general warm-up, followed by specific ramping sets (e.g. 50% for 5, 70% for 3, 85% for 1) to prepare motor unit recruitment.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────── MATH & FORMULAS ────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 sm:p-8 bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200 rounded-2xl shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
            <FunctionSquare className="w-3 h-3" /> 1RM Estimation Equations
          </span>
        </div>

        <div className="space-y-6 font-sans">
          <div>
            <h4 className="text-sm font-bold text-neutral-800 font-mono uppercase tracking-wider mb-2">How 1RM is Projected</h4>
            <p className="text-xs text-dark-600 leading-relaxed mb-3">
              The calculator uses submaximal weight ($w$) and repetitions completed ($r$) to project absolute 1RM using six mathematically validated equations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">1. Epley Formula (1885)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  1RM = w × (1 + r / 30)
                </div>
              </div>
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">2. Brzycki Formula (1993)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  1RM = w / (1.0278 - 0.0278 × r)
                </div>
              </div>
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">3. Lombardi Formula (1989)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  1RM = w × r^0.10
                </div>
              </div>
              <div className="p-4 bg-white border border-neutral-300 rounded-xl space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-mono">4. O'Conner Formula (1989)</div>
                <div className="bg-neutral-50 p-2.5 rounded-lg font-mono text-[10px] text-dark-900 text-center font-bold">
                  1RM = w × (1 + 0.025 × r)
                </div>
              </div>
            </div>
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
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-dark-500" />
          <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {[
            { q: "How accurate are submaximal 1RM calculations?", a: "They are highly accurate (typically within 1–3%) when the reps completed are between 1 and 8. As repetitions increase above 10, cardiovascular fatigue, changes in mechanical leverage, and individual muscle fiber composition differences make the formulas significantly less reliable." },
            { q: "How often should I test my 1RM?", a: "Testing your actual 1RM directly should be done sparingly, such as at the end of a training block (every 8 to 12 weeks) or during a competition. For weekly programming, using submaximal estimates from the calculator is safer and places far less wear and tear on your joints." },
            { q: "Why do different formulas yield different results?", a: "Each formula was formulated by researchers studying different athletic populations. For example, the Brzycki formula is highly popular and works exceptionally well in intermediate weight ranges, while the Epley formula is often preferred for compound powerlifts (squat, bench, deadlift)." },
            { q: "Can I use this calculator for bodyweight exercises?", a: "Yes. To estimate 1RM for bodyweight movements like pull-ups or dips, use your total weight (bodyweight + any added plate weight). For exercises like push-ups, the calculator is less accurate because you only lift roughly 60-70% of your body weight in the plank position." }
          ].map((qa, i) => (
            <details key={i} className="group p-4 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-colors" itemScope itemType="https://schema.org/Question">
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
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-300 font-mono mb-1.5">
              <Zap className="w-3.5 h-3.5" /> Want more?
            </div>
            <h3 className="text-lg font-extrabold mb-1">Build a custom calculator</h3>
            <p className="text-sm text-white/70 mb-3 font-normal leading-relaxed font-sans">Need a calculation we don't have? Build your own in minutes, no code required.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
              Open the builder <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        <Link href="/calculators" className="group p-5 sm:p-6 bg-white border border-neutral-200 hover:border-primary-400 rounded-2xl transition-all">
          <div className="relative font-sans">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-dark-500 font-mono mb-1.5">
              <CalcIcon className="w-3 h-3" /> More tools
            </div>
            <h3 className="text-lg font-extrabold text-dark-900 mb-1">Browse 500+ calculators</h3>
            <p className="text-sm text-dark-600 mb-3 font-normal leading-relaxed font-sans">Explore the full library across math, finance, health, conversion, and more.</p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-dark-700 group-hover:gap-2 group-hover:text-primary-700 transition-all">
              See all calculators <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
