import type { Metadata } from 'next'
import AdminDashboardClient from './AdminDashboardClient'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Home of Calculators',
  description: 'Admin control panel for Home of Calculators',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminDashboardClient />
}
