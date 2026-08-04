import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

// A redirect stub, not a page. Without its own metadata it inherited the root
// layout's title and description, so it was indexable and presented itself to
// crawlers as a second copy of the homepage.
export const metadata: Metadata = {
  title: { absolute: 'Redirecting to your dashboard' },
  robots: { index: false, follow: false },
}

export default function LibraryPage() {
  redirect('/dashboard')
}
