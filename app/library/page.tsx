import LibraryPageClient from './LibraryPageClient'

export const metadata = {
  title: 'My Library',
  robots: { index: false, follow: false },
}

export default function LibraryPage() {
  // Static export: client handles data fetching
  return <LibraryPageClient />
}