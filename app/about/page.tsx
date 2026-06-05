import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Calculator,
  Wrench,
  Code2,
  Globe,
  Heart,
  Target,
  Sparkles,
  Users,
  Zap,
  Shield,
  MessageCircle,
  ArrowRight,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About Calc_Craft - Our Mission, Story & the Team Behind Free Calculators | Calc_Craft',
  description:
    'Learn about Calc_Craft: a free, privacy-first calculator platform that gives you 50+ ready-made calculators, a no-code visual builder, and embeddable widgets for any website.',
  keywords: [
    'about calc_craft',
    'calculator platform',
    'visual calculator builder',
    'embed calculators',
    'white label calculator',
    'mission statement',
  ],
  openGraph: {
    title: 'About Calc_Craft | Calc_Craft',
    description: 'Our mission, story, and the team building the world\'s most flexible calculator platform.',
    type: 'website',
  },
  alternates: { canonical: 'https://calc_craft.com/about' },
}

const stats = [
  { value: '50+', label: 'Ready-made calculators', sub: 'across 9 categories' },
  { value: '128-bit', label: 'Calculation precision', sub: 'BigNumber arithmetic' },
  { value: '100%', label: 'Free forever', sub: 'no paid tiers, no upsells' },
  { value: '0', label: 'Servers storing your inputs', sub: 'all calculations in your browser' },
]

const values = [
  {
    icon: Shield,
    title: 'Privacy first, always',
    body: "Calculations happen in your browser. We never see your inputs. We never sell data. Privacy isn't a feature we added — it's the architecture.",
  },
  {
    icon: Heart,
    title: 'Free for everyone, forever',
    body: 'No paywalls. No premium tiers. No "upgrade to remove ads." A calculator is too useful to gatekeep behind a subscription.',
  },
  {
    icon: Sparkles,
    title: 'Simplicity over feature-creep',
    body: 'Every calculator should do one thing exceptionally well. We resist the temptation to bloat.',
  },
  {
    icon: Code2,
    title: 'Open and extensible',
    body: 'The visual builder means anyone can extend Calc_Craft. If you need a calculator we haven\'t built, build it yourself in minutes.',
  },
]

const capabilities = [
  { icon: Calculator, title: '50+ ready-made calculators', body: 'Math, finance, health, conversion, datetime, statistics, trigonometry, geometry, and everyday tools — all free, all browser-based.' },
  { icon: Wrench, title: 'Visual calculator builder', body: 'A WordPress-style drag-and-drop editor. Add fields, write formulas, pick a theme. Your custom calculator is live in minutes.' },
  { icon: Globe, title: 'Embed on any website', body: 'One-line iframe snippets. Drop a Calc_Craft calculator into your blog, your Shopify store, or your internal docs.' },
  { icon: Code2, title: 'JSON import / export', body: 'Back up, version, or share your custom calculator configurations as plain JSON files.' },
  { icon: Sparkles, title: 'White-label theming', body: 'Custom colors, your own logo, brand name on the widget. Make any Calc_Craft calculator look like it came from your brand.' },
  { icon: Shield, title: 'Privacy by design', body: 'Every calculation runs in your browser. We never see your inputs. GDPR-friendly, CCPA-friendly, no third-party tracking.' },
]

const timeline = [
  {
    year: '2024',
    title: 'The spark',
    body: 'A frustrated developer realizes that every "free online calculator" website either shows ads, harvests inputs, or lacks the one specific calculator they need. The idea for Calc_Craft is born.',
  },
  {
    year: '2024',
    title: 'First 20 calculators',
    body: 'Math, finance, health, conversion — the foundational categories ship. The mathjs-powered engine ensures every calculation is accurate to 128 digits.',
  },
  {
    year: '2025',
    title: 'Visual builder launched',
    body: 'Drag-and-drop calculator construction arrives. Users can now build calculators without writing a single line of code, using the same engine that powers the built-in ones.',
  },
  {
    year: '2025',
    title: 'Embeddable widgets',
    body: 'One-line iframe embeds let any website display a Calc_Craft calculator. White-labeling, custom themes, and JSON export turn the platform into a real toolkit.',
  },
  {
    year: '2026',
    title: 'Where we are now',
    body: '50+ calculators. 9 categories. 96+ automated engine tests. A thriving community of users who build, share, and embed their own calculators. The platform is mature — but the journey is just beginning.',
  },
]

const team = [
  { name: 'The Engineering Team', role: 'Architecture & Engine', bio: 'Maintains the math engine, frontend, and infrastructure that keep Calc_Craft running smoothly across the globe.' },
  { name: 'The Design Team', role: 'UX & Visual Design', bio: 'Crafts the interface, the 14-segment digital displays, and the retro-modern aesthetic that makes Calc_Craft feel alive.' },
  { name: 'The Content Team', role: 'Calculators & Documentation', bio: 'Builds each of the 50+ calculators, writes the help docs, and ensures every formula is verified for accuracy.' },
  { name: 'The Community', role: 'You', bio: 'Thousands of users, builders, and embedders who test new calculators, share feedback, and shape what Calc_Craft becomes next.' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label="About Calc_Craft" className="min-h-screen bg-white">
        {/* ───────── HERO ───────── */}
        <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-14 overflow-hidden bg-gradient-to-b from-white via-neutral-50/40 to-white">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[440px] bg-primary-100/40 blur-3xl rounded-full" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] font-bold font-mono uppercase tracking-wider mb-5 text-dark-700 shadow-sm">
              <Heart className="w-3.5 h-3.5 text-primary-600" /> Our Story
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-dark-900 mb-5 leading-[1.05]">
              Calculators should be
              <span className="block mt-1">
                <span className="relative inline-block">
                  <span className="relative z-10">free, private &amp; yours to shape</span>
                  <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2.5 sm:h-3 bg-primary-300/40 -skew-x-6 rounded-sm" aria-hidden="true" />
                </span>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-dark-500 max-w-2xl mx-auto leading-relaxed">
              Calc_Craft started as a frustration and became a platform. Today it powers 50+ free calculators, a no-code visual builder, and embeddable widgets used by thousands of people every day.
            </p>
          </div>
        </section>

        {/* ───────── MISSION ───────── */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white" itemScope itemType="https://schema.org/AboutPage">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[10px] font-bold font-mono uppercase tracking-wider mb-4 text-dark-700">
                  <Target className="w-3 h-3 text-primary-600" /> Our Mission
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-900 mb-4 tracking-tight">
                  Make calculation accessible, accurate, and owned by the user.
                </h2>
                <p className="text-base text-dark-600 leading-relaxed mb-4">
                  Most online calculators treat you as the product — your inputs are logged, your behavior is tracked, and the page is cluttered with ads. Calc_Craft takes the opposite approach: <strong>no tracking, no ads, no paywalls</strong>. Just accurate math, done in your browser.
                </p>
                <p className="text-base text-dark-600 leading-relaxed mb-6">
                  And because not every calculation fits a pre-built template, we built a <strong>visual calculator builder</strong> — the same WordPress-style editor, but for calculators. Need a niche mortgage formula? A custom workout-calorie estimator? A/B test ROI? You can build it in minutes, embed it on your site, and even white-label it with your own brand.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/calculators" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-dark-900 hover:bg-black text-white rounded-lg text-sm font-bold active:scale-95 transition-all">
                    <Calculator className="w-4 h-4" /> Browse Calculators
                  </Link>
                  <Link href="/builder" className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-neutral-200 hover:border-primary-400 rounded-lg text-sm font-bold text-dark-800 active:scale-95 transition-all">
                    <Wrench className="w-4 h-4" /> Open Builder
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md hover:border-neutral-300 transition-all">
                    <div className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-1">{s.value}</div>
                    <div className="text-xs font-bold text-dark-800 mb-0.5">{s.label}</div>
                    <div className="text-[10px] text-dark-500 font-mono">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───────── WHAT WE OFFER ───────── */}
        <section className="py-12 sm:py-16 lg:py-20 bg-neutral-50/50 border-y border-neutral-200/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[10px] font-bold font-mono uppercase tracking-wider mb-3 text-dark-700">
                <Sparkles className="w-3 h-3 text-primary-600" /> What You Can Do
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-900 mb-3 tracking-tight">A complete calculator platform</h2>
              <p className="text-base text-dark-500 max-w-2xl mx-auto">
                Calc_Craft is more than a list of calculators. It's a full toolkit for building, sharing, embedding, and branding them.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {capabilities.map((card) => (
                <div key={card.title} className="group p-5 bg-white border border-neutral-200 hover:border-primary-400 hover:shadow-lg rounded-2xl transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center mb-3 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-dark-900 mb-1.5">{card.title}</h3>
                  <p className="text-xs text-dark-500 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── VALUES ───────── */}
        <section className="py-12 sm:py-16 lg:py-20 bg-dark-900 text-white relative overflow-hidden" itemScope itemType="https://schema.org/Organization">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold font-mono uppercase tracking-wider mb-3">
                <Heart className="w-3 h-3" /> Our Values
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight">What we believe</h2>
              <p className="text-base text-white/70 max-w-2xl mx-auto">Four principles that guide every decision we make about Calc_Craft.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                    <v.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── TIMELINE ───────── */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[10px] font-bold font-mono uppercase tracking-wider mb-3 text-dark-700">
                <Zap className="w-3 h-3 text-primary-600" /> Our Journey
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-900 mb-3 tracking-tight">From idea to platform</h2>
            </div>

            <div className="relative">
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-primary-200" aria-hidden="true" />
              <div className="space-y-8">
                {timeline.map((t, i) => (
                  <div key={t.year + t.title} className={`relative flex items-start gap-4 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                    <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-white" />
                    <div className="pl-10 sm:pl-0 sm:w-1/2">
                      <div className={`p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm ${i % 2 === 0 ? 'sm:mr-8' : 'sm:ml-8'}`}>
                        <div className="text-[10px] font-bold font-mono text-primary-600 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded inline-block mb-2">{t.year}</div>
                        <h3 className="text-base font-bold text-dark-900 mb-1.5">{t.title}</h3>
                        <p className="text-sm text-dark-600 leading-relaxed">{t.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───────── TEAM ───────── */}
        <section className="py-12 sm:py-16 lg:py-20 bg-neutral-50/50 border-y border-neutral-200/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-[10px] font-bold font-mono uppercase tracking-wider mb-3 text-dark-700">
                <Users className="w-3 h-3 text-primary-600" /> The Crew
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-900 mb-3 tracking-tight">Who builds Calc_Craft</h2>
              <p className="text-base text-dark-500 max-w-xl mx-auto">A small, distributed team united by the belief that good tools should be free.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {team.map((m) => (
                <div key={m.name} className="p-5 bg-white border border-neutral-200 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-dark-900 text-white flex items-center justify-center font-extrabold text-sm mb-3">
                    {m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <h3 className="text-sm font-bold text-dark-900">{m.name}</h3>
                  <div className="text-[10px] font-bold font-mono text-primary-600 uppercase tracking-wider mb-2">{m.role}</div>
                  <p className="text-xs text-dark-500 leading-relaxed">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section className="py-12 sm:py-16 bg-white" itemScope itemType="https://schema.org/FAQPage">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-8 tracking-tight text-center">Common questions</h2>
            <div className="space-y-3">
              {[
                { q: 'Is Calc_Craft really 100% free?', a: 'Yes. No paywalls. No premium tiers. No in-app purchases. The entire platform is free to use, forever.' },
                { q: 'Do you see the values I enter into calculators?', a: 'No. All calculations run locally in your browser using JavaScript. We never see or store your inputs.' },
                { q: 'Can I embed a Calc_Craft calculator on my own website?', a: 'Yes. Open any calculator (or one you build), click Share → Embed, and copy the iframe snippet. It works on any website that allows iframes.' },
                { q: 'Can I build a completely custom calculator?', a: 'Yes. Our visual builder lets you add fields, write formulas, choose a theme, and add your own logo. The result is a calculator you can share or embed.' },
                { q: 'How do you make money if everything is free?', a: 'Calc_Craft is independently operated and supported by its founders. We keep costs low with efficient static hosting and avoid the surveillance-ad business model.' },
              ].map((qa, i) => (
                <details key={i} className="group p-4 sm:p-5 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300 transition-all" itemScope itemType="https://schema.org/Question">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="text-sm font-bold text-dark-900 pr-3" itemProp="name">{qa.q}</h3>
                    <span className="text-dark-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-dark-600 leading-relaxed" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <span itemProp="text">{qa.a}</span>
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section className="py-12 sm:py-16 bg-dark-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-20 left-1/3 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight">Ready to start calculating?</h2>
            <p className="text-base text-white/70 mb-6 max-w-xl mx-auto">
              Browse the library, build your own, or embed one on your site — it's all free, and it all happens in your browser.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/calculators" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-dark-900 rounded-xl text-sm font-bold hover:bg-neutral-100 active:scale-95 transition-all">
                <Calculator className="w-4 h-4" /> Browse Calculators <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/builder" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur border border-white/30 text-white rounded-xl text-sm font-bold hover:bg-white/20 active:scale-95 transition-all">
                <Wrench className="w-4 h-4" /> Open Builder
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
