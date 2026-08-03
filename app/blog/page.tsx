import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BookOpen, ArrowRight, Calendar } from 'lucide-react'
import { getPosts, plainExcerpt, postAuthor, postImage } from '@/lib/wp'

/**
 * Blog index.
 *
 * This page was a hardcoded "Our Blog is Coming Soon" placeholder — it shipped
 * while lib/wp.ts was stubbed out, and stayed behind when the WordPress client
 * was restored. Individual posts at /blog/<slug> were building correctly the
 * whole time; there was simply nothing linking to them.
 */

export const revalidate = 60

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

function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-white pt-28 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-primary-200 text-[11px] font-bold font-mono uppercase tracking-wider mb-5 text-primary-700 shadow-sm">
              <BookOpen className="w-3.5 h-3.5" /> The Blog
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-dark-900 mb-4 leading-[1.05]">
              Guides, tutorials &amp; insights
            </h1>
            <p className="text-base sm:text-lg text-dark-500 leading-relaxed">
              How to get more out of the calculators, and how to build and embed your own.
            </p>
          </div>

          {posts.length === 0 ? (
            /* Genuinely empty, or the CMS is unreachable. Either way, say something
               useful rather than pretending the blog does not exist yet. */
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-primary-300 mx-auto mb-4" />
              <h2 className="text-xl font-extrabold text-dark-900 mb-2">No articles yet</h2>
              <p className="text-dark-500 max-w-md mx-auto mb-6">
                We&apos;re working on the first batch of guides. In the meantime, there are 490 calculators
                ready to use.
              </p>
              <Link
                href="/calculators"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-colors"
              >
                Browse calculators <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const image = postImage(post)
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all"
                  >
                    {image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={image}
                        alt=""
                        className="w-full h-44 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-primary-100 to-blue-100 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-primary-400" />
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-center gap-1.5 text-[11px] text-dark-400 mb-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.date)}
                        <span className="opacity-40">·</span>
                        {postAuthor(post)}
                      </div>

                      <h2
                        className="text-base font-extrabold text-dark-900 leading-snug mb-2 group-hover:text-primary-700 transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />

                      <p className="text-sm text-dark-500 leading-relaxed flex-1">
                        {plainExcerpt(post, 120)}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary-700">
                        Read article
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
