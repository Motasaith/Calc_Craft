import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, BookOpen, Calculator, Wrench, Globe, TrendingUp, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Home of Calculators Blog - Calculator Tips, Tutorials & Industry Insights | Home of Calculators',
  description:
    'In-depth guides on using calculators for finance, health, math, and everyday life. Plus tutorials on building custom calculators with our visual builder and embedding them anywhere.',
  keywords: [
    'calculator blog',
    'finance tips',
    'math tutorials',
    'health calculator guide',
    'visual builder tutorial',
    'embed calculator',
  ],
  openGraph: {
    title: 'Home of Calculators Blog | Home of Calculators',
    description: 'Tips, tutorials, and industry insights on calculators and custom calculator development.',
    type: 'website',
  },
  alternates: { canonical: 'https://homeofcalculators.com/blog' },
}

interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  icon: any
  featured?: boolean
}

const ARTICLES: Article[] = [
  {
    slug: 'how-to-build-custom-calculator-no-code',
    title: 'How to Build a Custom Calculator in 5 Minutes (No Code Required)',
    excerpt: 'A step-by-step walkthrough of Home of Calculators\'s visual builder, from a blank canvas to an embeddable, white-labeled calculator on your website.',
    category: 'Tutorial',
    date: 'June 4, 2026',
    readTime: '6 min read',
    icon: Wrench,
    featured: true,
  },
  {
    slug: 'understanding-loan-emi-calculation',
    title: 'Understanding Loan EMI Calculations: The Math Behind the Monthly Payment',
    excerpt: 'EMI isn\'t magic; it\'s a precise amortization formula. Here\'s the derivation, what it means, and how to use it to compare loan offers.',
    category: 'Finance',
    date: 'May 28, 2026',
    readTime: '8 min read',
    icon: TrendingUp,
  },
  {
    slug: 'calculator-engines-mathjs-precision',
    title: 'Why Floating-Point Math Lies to You, and How BigNumber Arithmetic Saves the Day',
    excerpt: 'JavaScript\'s default Number type silently loses precision at 16 digits. Here\'s why that matters for finance, science, and even everyday calculations.',
    category: 'Engineering',
    date: 'May 21, 2026',
    readTime: '7 min read',
    icon: Calculator,
  },
]

export default function BlogPage() {
  const featured = ARTICLES.find((a) => a.featured)!
  const rest = ARTICLES.filter((a) => !a.featured)

  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label="Home of Calculators Blog" className="min-h-screen bg-white">
        {/* ───────── HERO ───────── */}
        <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-14 overflow-hidden bg-gradient-to-b from-white via-neutral-50/40 to-white">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[440px] bg-primary-100/30 blur-3xl rounded-full" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] font-bold font-mono uppercase tracking-wider mb-5 text-dark-700 shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-primary-600" /> The Blog
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-dark-900 mb-5 leading-[1.05]">
              Insights, tutorials &amp;
              <span className="block mt-1">
                <span className="relative inline-block">
                  <span className="relative z-10">the math behind the calculators</span>
                  <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2.5 sm:h-3 bg-primary-300/40 -skew-x-6 rounded-sm" aria-hidden="true" />
                </span>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-dark-500 max-w-2xl mx-auto leading-relaxed">
              Deep dives on how calculators work, how to use them for better decisions, and how to build your own.
            </p>
          </div>
        </section>

        {/* ───────── FEATURED ───────── */}
        <section className="pb-10 sm:pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8 p-6 sm:p-8 bg-dark-900 text-white rounded-3xl relative overflow-hidden hover:shadow-2xl transition-all">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />

                <div className="relative flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                        {featured.category}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight group-hover:underline">
                      {featured.title}
                    </h2>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-4">
                      {featured.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-white/60">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {featured.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                      Read article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center justify-center min-h-[200px] lg:min-h-0">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <featured.icon className="w-16 h-16 lg:w-20 lg:h-20 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* ───────── ALL ARTICLES ───────── */}
        <section className="py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-dark-900 tracking-tight">Latest articles</h2>
              <span className="text-[10px] font-mono text-dark-500 uppercase tracking-wider">{ARTICLES.length} articles</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="group p-5 bg-white border border-neutral-200 hover:border-primary-400 hover:shadow-lg rounded-2xl transition-all flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <a.icon className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border bg-white border-neutral-200 text-dark-700">
                      {a.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-dark-900 mb-2 leading-tight group-hover:text-primary-700 transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-xs text-dark-500 leading-relaxed flex-1 mb-3 line-clamp-3">
                    {a.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-dark-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {a.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── NEWSLETTER ───────── */}
        <section className="py-10 sm:py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="p-6 sm:p-8 bg-dark-900 text-white rounded-2xl text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <h3 className="text-lg sm:text-xl font-extrabold mb-1">Get new articles by email</h3>
                <p className="text-sm text-white/70 mb-4">One short, useful email per month. No spam, unsubscribe anytime.</p>
                <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 h-10 px-3 bg-white/10 border border-white/30 rounded-lg text-sm placeholder:text-white/50 focus:outline-none focus:bg-white/20"
                  />
                  <button type="submit" className="px-4 h-10 bg-white text-dark-900 font-bold rounded-lg text-sm active:scale-95 hover:bg-neutral-100 transition-all">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
