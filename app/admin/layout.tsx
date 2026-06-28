import { auth, signOut } from '@/auth'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Users,
  Calculator,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'

export const dynamic = 'force-dynamic'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/calculators', label: 'Calculators', icon: Calculator },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Middleware already gates /admin routes — if we reach here without a
  // valid admin session, render a minimal fallback instead of redirecting
  // (redirecting from the layout would loop for /admin/login which is a
  // child of this layout).
  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    // /admin/login has its own full-page UI and doesn't need the sidebar.
    // Just render children bare — the login page handles its own layout.
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="p-6 border-b border-dark-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-primary-400" />
            </div>
            <span className="font-heading font-bold text-white text-sm">
              {BRAND.shortName} Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-200 hover:bg-dark-700 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-dark-700 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </a>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/admin/login' })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <header className="h-14 bg-dark-800 border-b border-dark-700 flex items-center px-6 sticky top-0 z-10">
          <span className="text-sm text-dark-300">
            Signed in as{' '}
            <span className="text-white font-medium">{session.user.email}</span>
          </span>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}