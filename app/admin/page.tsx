import Link from 'next/link'
import { FileText, Users, Calculator, Clock } from 'lucide-react'
import { getDashboardStats } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    {
      label: 'Blog Posts',
      value: stats.postCount,
      icon: FileText,
      href: '/admin/blog',
      accent: 'text-primary-400',
    },
    {
      label: 'Users',
      value: stats.userCount,
      icon: Users,
      href: '/admin/users',
      accent: 'text-emerald-400',
    },
    {
      label: 'Pending Calculators',
      value: stats.pendingCount,
      icon: Clock,
      href: '/admin/calculators',
      accent: 'text-amber-400',
    },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-white mb-1">
        Dashboard
      </h1>
      <p className="text-sm text-dark-300 mb-8">
        Overview of your site&apos;s content and activity.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="glass-dark rounded-xl border border-dark-700 p-6 hover:border-dark-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-dark-300">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.accent}`} />
              </div>
              <div className="font-heading text-3xl font-bold text-white">
                {card.value}
              </div>
            </Link>
          )
        })}
      </div>

      <div className="glass-dark rounded-xl border border-dark-700 p-6">
        <h2 className="font-heading text-lg font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
          >
            <FileText className="w-4 h-4" />
            New Blog Post
          </Link>
          <Link
            href="/admin/calculators"
            className="inline-flex items-center gap-2 rounded-lg bg-dark-700 px-4 py-2 text-sm font-medium text-white hover:bg-dark-600 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Review Calculators
          </Link>
        </div>
      </div>
    </div>
  )
}