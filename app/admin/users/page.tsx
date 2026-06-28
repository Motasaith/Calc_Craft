import { toggleUserDisabled } from '@/app/admin/actions'
import { getAllUsers } from '@/lib/db/queries'
import { ShieldCheck, Ban, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Users',
  robots: { index: false, follow: false },
}

function formatDate(date: Date | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function AdminUsersPage() {
  const allUsers = await getAllUsers()

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-white mb-1">Users</h1>
      <p className="text-sm text-dark-300 mb-6">
        {allUsers.length} registered user{allUsers.length !== 1 ? 's' : ''}.
      </p>

      <div className="glass-dark rounded-xl border border-dark-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700 text-left text-dark-300">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Last sign in</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-dark-700/50 hover:bg-dark-700/30"
              >
                <td className="px-4 py-3 text-white">{user.email}</td>
                <td className="px-4 py-3 text-dark-200">{user.name ?? '—'}</td>
                <td className="px-4 py-3 text-dark-300 capitalize">
                  {user.provider ?? '—'}
                </td>
                <td className="px-4 py-3 text-dark-300">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3 text-dark-300">
                  {formatDate(user.lastSignIn)}
                </td>
                <td className="px-4 py-3">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 text-xs text-primary-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin
                    </span>
                  ) : (
                    <span className="text-xs text-dark-400">User</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {user.isAdmin ? null : (
                    <form
                      action={async () => {
                        'use server'
                        await toggleUserDisabled(user.id, !user.isDisabled)
                      }}
                    >
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          user.isDisabled
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                        }`}
                      >
                        {user.isDisabled ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Enable
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            Disable
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}