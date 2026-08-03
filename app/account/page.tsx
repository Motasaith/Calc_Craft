import type { Metadata } from 'next'
import AccountPageClient from './AccountPageClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Account Settings | Home of Calculators',
  description: 'Manage your profile, password, connected logins and active devices.',
  robots: { index: false, follow: false },
}

export default function AccountPage() {
  return <AccountPageClient />
}
