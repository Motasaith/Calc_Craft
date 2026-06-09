import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen, Tag } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const ARTICLES: Record<string, {
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  body: { heading: string; paragraphs: string[] }[]
  related: { slug: string; title: string }[]
  relatedCategory: string
}> = {
  'how-to-build-custom-calculator-no-code': {
    title: 'How to Build a Custom Calculator in 5 Minutes (No Code Required)',
    excerpt: 'A step-by-step walkthrough of Home of Calculators\'s visual builder — from a blank canvas to an embeddable, white-labeled calculator on your website.',
    category: 'Tutorial',
    date: 'June 4, 2026',
    readTime: '6 min read',
    relatedCategory: 'tutorial',
    body: [
      {
        heading: 'Why build a custom calculator?',
        paragraphs: [
          'Every niche has its own calculations. A mortgage broker needs an affordability calculator. A fitness coach needs a macro split estimator. A SaaS founder needs an ROI calculator. Off-the-shelf tools rarely fit — they\'re either too generic, too expensive, or come with ads and tracking.',
          'Home of Calculators\'s visual builder lets you skip the engineering and ship a branded, embeddable calculator in minutes. No JavaScript, no servers, no build pipeline.',
        ],
      },
      {
        heading: 'Step 1: Open the builder',
        paragraphs: [
          'Navigate to /builder. You\'ll see a three-panel workspace: the toolbox on the left (Number, Slider, Select, Checkbox), the canvas in the middle, and the inspector on the right (settings for the selected element).',
          'Or skip the blank canvas: click TEMPLATES in the top bar and pick a starting point — BMI, Tip Calculator, Compound Interest, Discount, and more.',
        ],
      },
      {
        heading: 'Step 2: Add your input fields',
        paragraphs: [
          'Click any input type on the left to add it. Each field automatically gets a variable name (like "x" or "rate") based on its label. You can rename variables in the inspector.',
          'For numeric inputs, set min/max/step. For sliders, choose a unit. For dropdowns, define the options and labels.',
        ],
      },
      {
        heading: 'Step 3: Write a formula',
        paragraphs: [
          'Click "Add Formula" in the canvas (or use the inspector). Use the variable names from your fields, plus math functions like sqrt(), pow(), pi, and e. Click any function in the Insertion Panel to add it without typing.',
          'Example: a compound interest formula is "principal * pow(1 + rate/100, years)". The builder parses this in real-time and shows the result.',
        ],
      },
      {
        heading: 'Step 4: Pick a theme',
        paragraphs: [
          'Open the SETTINGS tab. Pick a preset theme (Retro, Dark, Modern, Pastel, Cyberpunk) or design your own with custom colors. Add your logo and brand name to white-label the output.',
        ],
      },
      {
        heading: 'Step 5: Save and share',
        paragraphs: [
          'Click SAVE to add the calculator to your library. Click SHARE to get a public link. Click the embed code button to drop the calculator on your own site via a one-line iframe.',
          'That\'s it. You\'ve shipped a custom calculator.',
        ],
      },
    ],
    related: [
      { slug: 'calculator-engines-mathjs-precision', title: 'Why Floating-Point Math Lies to You' },
      { slug: 'understanding-loan-emi-calculation', title: 'Understanding Loan EMI Calculations' },
    ],
  },
  'understanding-loan-emi-calculation': {
    title: 'Understanding Loan EMI Calculations: The Math Behind the Monthly Payment',
    excerpt: 'EMI isn\'t magic — it\'s a precise amortization formula. Here\'s the derivation, what it means, and how to use it to compare loan offers.',
    category: 'Finance',
    date: 'May 28, 2026',
    readTime: '8 min read',
    relatedCategory: 'finance',
    body: [
      {
        heading: 'What is an EMI?',
        paragraphs: [
          'EMI stands for Equated Monthly Installment. It\'s the fixed amount you pay every month to repay a loan over a set period. Each payment covers two components: principal (the amount you originally borrowed) and interest (the lender\'s charge for lending you the money).',
          'In the early years of a loan, most of your EMI goes to interest. In the later years, most of it goes to principal. This is called amortization.',
        ],
      },
      {
        heading: 'The EMI formula',
        paragraphs: [
          'The monthly EMI is calculated using the formula: EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ - 1), where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the total number of monthly payments (years × 12).',
          'This is sometimes called the "annuity formula" because it\'s the same math used to calculate any fixed periodic payment — pensions, insurance premiums, even car leases.',
        ],
      },
      {
        heading: 'A worked example',
        paragraphs: [
          'Suppose you borrow $100,000 at 8% annual interest for 20 years (240 months). r = 0.08 / 12 = 0.00667. Plugging in: EMI = 100,000 × 0.00667 × (1.00667)²⁴⁰ / ((1.00667)²⁴⁰ - 1) ≈ $836.88.',
          'Over 20 years, you\'ll pay $200,852 — almost double the original loan — with $100,852 going entirely to interest.',
        ],
      },
      {
        heading: 'Why a longer loan costs more',
        paragraphs: [
          'Stretching the same $100,000 loan to 30 years drops the EMI to about $733.76 — but you\'ll pay $264,154 in total, with $164,154 of that being interest.',
          'The lower monthly payment feels good, but the total cost is 31% higher. Always compare loans on total cost, not just monthly payment.',
        ],
      },
      {
        heading: 'How to use the calculator',
        paragraphs: [
          'Our EMI calculator handles this math for you, with 128-digit BigNumber precision. Try entering different principal amounts, rates, and tenures to see how the total interest changes. The amortization schedule (year-by-year breakdown of principal vs. interest) makes it easy to see when you cross the halfway mark.',
        ],
      },
    ],
    related: [
      { slug: 'how-to-build-custom-calculator-no-code', title: 'How to Build a Custom Calculator (No Code)' },
      { slug: 'calculator-engines-mathjs-precision', title: 'Why Floating-Point Math Lies to You' },
    ],
  },
  'calculator-engines-mathjs-precision': {
    title: 'Why Floating-Point Math Lies to You — and How BigNumber Arithmetic Saves the Day',
    excerpt: 'JavaScript\'s default Number type silently loses precision at 16 digits. Here\'s why that matters for finance, science, and even everyday calculations.',
    category: 'Engineering',
    date: 'May 21, 2026',
    readTime: '7 min read',
    relatedCategory: 'engineering',
    body: [
      {
        heading: 'The classic gotcha: 0.1 + 0.2',
        paragraphs: [
          'Open any JavaScript console and type 0.1 + 0.2. The answer is 0.30000000000000004 — not 0.3. This isn\'t a bug. It\'s how floating-point arithmetic works on every modern computer, in every language.',
          'The reason: computers store numbers in binary, and 0.1 has no exact binary representation. Just like 1/3 can\'t be written exactly in decimal (it\'s 0.333…), 0.1 can\'t be written exactly in binary (it\'s 0.00011001100… repeating).',
        ],
      },
      {
        heading: 'Why it matters',
        paragraphs: [
          'For most calculations, the tiny error doesn\'t matter. 0.30000000000000004 displays as 0.3 just fine. But for finance — calculating interest on a million-dollar loan, multiplying by a daily rate 365 times — those tiny errors accumulate into real money.',
          'A friend of mine once debugged a billing system that was off by $0.07 per invoice because of this exact issue, multiplied across 100,000 invoices per month. The result was a $7,000 monthly discrepancy that nobody noticed for six months.',
        ],
      },
      {
        heading: 'The fix: BigNumber arithmetic',
        paragraphs: [
          'Libraries like mathjs, decimal.js, and bignumber.js solve the problem by storing numbers as strings of decimal digits and doing the math digit-by-digit. They\'re slower than native floating-point, but they\'re exact.',
          'Home of Calculators uses mathjs\'s BigNumber mode configured to 64 digits of precision for general calculations and 128 digits for financial ones. That\'s vastly more than any real-world calculation needs — 128 decimal digits could represent the number of atoms in the universe many times over — but it ensures that no rounding error ever creeps into a result.',
        ],
      },
      {
        heading: 'What this means for you',
        paragraphs: [
          'When our EMI calculator says your monthly payment is $836.88, it really is exactly that — not $836.8800000000001. When our BMI calculator says you\'re 24.7, it\'s not a fuzzy approximation; it\'s the true value to 14 significant figures.',
          'For a calculator you can trust, BigNumber precision is non-negotiable. The performance cost (a few microseconds per operation) is invisible to the user, and the correctness benefit is permanent.',
        ],
      },
    ],
    related: [
      { slug: 'how-to-build-custom-calculator-no-code', title: 'How to Build a Custom Calculator (No Code)' },
      { slug: 'understanding-loan-emi-calculation', title: 'Understanding Loan EMI Calculations' },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES[slug]
  if (!article) return { title: 'Article Not Found' }
  return {
    title: `${article.title} | Home of Calculators Blog`,
    description: article.excerpt,
    keywords: [article.category, 'homeofcalculators blog', 'calculator tutorial', article.relatedCategory],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
    },
    alternates: { canonical: `https://homeofcalculators.com/blog/${slug}` },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = ARTICLES[slug]
  if (!article) notFound()

  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label={article.title} className="min-h-screen bg-white">
        <article className="pt-24 pb-16" itemScope itemType="https://schema.org/BlogPosting">
          <meta itemProp="datePublished" content={article.date} />
          <meta itemProp="author" content="Home of Calculators Team" />

          {/* Header */}
          <header className="relative pb-10 overflow-hidden">
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary-100/30 blur-3xl rounded-full" />
            </div>
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-dark-500 hover:text-dark-800 mb-6 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
              </Link>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 border border-primary-100 text-[10px] font-bold uppercase tracking-wider text-primary-700">
                  <Tag className="w-3 h-3" /> {article.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-dark-600 text-[10px] font-mono font-bold">
                  <Calendar className="w-3 h-3" /> {article.date}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-dark-600 text-[10px] font-mono font-bold">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-dark-900 leading-[1.1] mb-4" itemProp="headline">
                {article.title}
              </h1>
              <p className="text-base sm:text-lg text-dark-500 leading-relaxed" itemProp="description">
                {article.excerpt}
              </p>
            </div>
          </header>

          {/* Body */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="prose prose-slate max-w-none">
              {article.body.map((section, i) => (
                <section key={i} className="mb-10">
                  <h2 className="text-2xl font-extrabold text-dark-900 mb-4 tracking-tight">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((p, j) => (
                    <p key={j} className="text-base text-dark-600 leading-[1.8] mb-4">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 p-6 bg-dark-900 text-white rounded-2xl text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <BookOpen className="w-7 h-7 mx-auto mb-2" />
                <h3 className="text-lg font-extrabold mb-1">Ready to build your own calculator?</h3>
                <p className="text-sm text-white/70 mb-4 max-w-md mx-auto">The visual builder is free, no signup, and takes about 5 minutes.</p>
                <Link href="/builder" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-dark-900 rounded-lg text-sm font-bold hover:bg-neutral-100 active:scale-95 transition-all">
                  Open the builder <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Related */}
            {article.related.length > 0 && (
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <h3 className="text-lg font-extrabold text-dark-900 mb-4">Keep reading</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {article.related.map((r) => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="group p-4 bg-white border border-neutral-200 hover:border-primary-400 hover:shadow-md rounded-xl transition-all">
                      <div className="text-[10px] font-bold text-dark-500 uppercase tracking-wider mb-1">Related</div>
                      <div className="text-sm font-bold text-dark-900 group-hover:text-primary-700 transition-colors">{r.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
