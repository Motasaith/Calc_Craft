import type { Metadata } from 'next'
import ResetPasswordClient from './ResetPasswordClient'

// SEO: this is a static page (works with output: 'export' on Cloudflare Pages).
// The reset key arrives in the query string and is read client-side.
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Reset Your Password | Home of Calculators',
  description: 'Set a new password for your Home of Calculators account.',
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
