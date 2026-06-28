import { approveCalculator, rejectCalculator } from '@/app/admin/actions'
import { getAllCustomCalculators } from '@/lib/db/queries'
import { Check, X } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Calculators',
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

export default async function AdminCalculatorsPage() {
  const calcs = await getAllCustomCalculators()

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-white mb-1">
        Community Calculators
      </h1>
      <p className="text-sm text-dark-300 mb-6">
        {calcs.length} submission{calcs.length !== 1 ? 's' : ''}. Approve
        calculators to show them in the public gallery.
      </p>

      <div className="glass-dark rounded-xl border border-dark-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700 text-left text-dark-300">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Visibility</th>
              <th className="px-4 py-3 font-medium">Approved</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {calcs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-dark-400"
                >
                  No community calculators yet.
                </td>
              </tr>
            ) : (
              calcs.map((calc) => (
                <tr
                  key={calc.id}
                  className="border-b border-dark-700/50 hover:bg-dark-700/30"
                >
                  <td className="px-4 py-3 text-white">{calc.title}</td>
                  <td className="px-4 py-3 text-dark-200">
                    {calc.userEmail ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        calc.isPublic
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-dark-600 text-dark-300'
                      }`}
                    >
                      {calc.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {calc.isApproved ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-dark-300">
                    {formatDate(calc.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form
                        action={async () => {
                          'use server'
                          await approveCalculator(calc.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      </form>
                      <form
                        action={async () => {
                          'use server'
                          await rejectCalculator(calc.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-2.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30 transition-colors"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}