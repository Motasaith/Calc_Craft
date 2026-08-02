import type { Metadata } from 'next'
import EmbedByIdClient from './EmbedByIdClient'

// Static shell; the calculator id arrives as ?id= and is resolved client-side.
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Calculator',
  // Embeds are iframed into other people's pages — they should never compete
  // with the host page in search results.
  robots: { index: false, follow: false },
}

export default function EmbedByIdPage() {
  return <EmbedByIdClient />
}
