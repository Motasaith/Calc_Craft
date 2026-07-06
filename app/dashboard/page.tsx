import type { Metadata } from 'next'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'My Dashboard - Home of Calculators',
  description: 'Manage your saved calculators, custom builds, and embedded widgets. Access all your calculator tools in one place.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://homeofcalculators.com/dashboard' },
}

export const dynamic = 'force-static'

export default function DashboardPage() {
  return <DashboardClient />
}