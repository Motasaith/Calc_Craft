import type { Metadata } from 'next'
import ForgotPasswordClient from './ForgotPasswordClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Reset Your Password',
  description: 'Reset the password for your Home of Calculators account.',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />
}
