import { getAllSlugs, getCalculatorBySlug as getLocalCalc } from '@/lib/calculators'
import type { Metadata } from 'next'
import EmbedSlugClient from './EmbedSlugClient'

// Embeddable version of a catalogue calculator: /embed/<slug>.
//
// Calculators now come solely from the local registry in lib/calculators.ts.
// This route used to query the WordPress `calculator` custom post type first
// and fall back to the registry; WordPress is the blog CMS only now, so the
// fallback has become the single source of truth.
//
// (User-built calculators are a different route — /embed/c?id=<publicId> — and
// are served from the database.)

export const dynamicParams = false
export const dynamic = 'force-static'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const localCalc = getLocalCalc(slug)

  if (!localCalc) return { title: 'Calculator Not Found' }

  return {
    title: `${localCalc.name} Embed | Home of Calculators`,
    robots: {
      index: false, // Do not index embed iframes
      follow: false,
    },
  }
}

export default async function EmbedSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const localCalc = getLocalCalc(slug)

  if (!localCalc) {
    return (
      <div className="w-full min-h-screen p-4 flex items-center justify-center bg-transparent">
        <div className="text-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h1 className="text-lg font-bold text-dark-800">Calculator Not Found</h1>
          <p className="text-sm text-dark-500 mt-2">The requested embedded calculator could not be loaded.</p>
        </div>
      </div>
    )
  }

  return <EmbedSlugClient slug={localCalc.slug} name={localCalc.name} />
}
