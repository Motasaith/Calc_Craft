import type { Metadata } from 'next'
import EmbedPageClient from './EmbedPageClient'

export const metadata: Metadata = {
  title: 'Embed Calculator',
  robots: {
    index: false,
    follow: false,
  },
}

export default function EmbedPage() {
  return <EmbedPageClient />
}
