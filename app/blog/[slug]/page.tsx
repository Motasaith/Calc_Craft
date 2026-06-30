import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, BookOpen, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPosts, getPostBySlug } from '@/lib/wp'

// Allow dynamic generation of new blog posts published to WP after build
export const dynamicParams = true
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post: any) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Article Not Found' }
  
  // Create a plain text excerpt from rendered HTML for SEO
  const excerptText = post.excerpt?.rendered?.replace(/<[^>]*>?/gm, '') || ''
  
  return {
    title: `${post.title.rendered} | Home of Calculators Blog`,
    description: excerptText.slice(0, 150),
    openGraph: {
      title: post.title.rendered,
      description: excerptText.slice(0, 150),
      type: 'article',
      publishedTime: post.date,
    },
    alternates: { canonical: `https://homeofcalculators.com/blog/${slug}` },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const publishedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label={post.title.rendered} className="min-h-screen bg-white">
        <article className="pt-24 pb-16" itemScope itemType="https://schema.org/BlogPosting">
          <meta itemProp="datePublished" content={publishedDate} />
          <meta itemProp="author" content="Home of Calculators Team" />

          <header className="relative pb-10 overflow-hidden">
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary-100/30 blur-3xl rounded-full" />
            </div>
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-dark-500 hover:text-dark-800 mb-6 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
              </Link>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-dark-600 text-[10px] font-mono font-bold">
                  <Calendar className="w-3 h-3" /> {publishedDate}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-dark-900 leading-[1.1] mb-4" itemProp="headline" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              
              {post.excerpt && post.excerpt.rendered && (
                <div className="text-base sm:text-lg text-dark-500 leading-relaxed" itemProp="description" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              )}
            </div>
          </header>

          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? '' }}
            />

            <div className="mt-12 p-6 bg-dark-900 text-white rounded-2xl text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <BookOpen className="w-7 h-7 mx-auto mb-2" />
                <h3 className="text-lg font-extrabold mb-1">
                  Ready to build your own calculator?
                </h3>
                <p className="text-sm text-white/70 mb-4 max-w-md mx-auto">
                  The visual builder is free, no signup, and takes about 5 minutes.
                </p>
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-dark-900 rounded-lg text-sm font-bold hover:bg-neutral-100 active:scale-95 transition-all"
                >
                  Open the builder <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
