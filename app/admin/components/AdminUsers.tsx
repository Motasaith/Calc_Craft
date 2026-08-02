'use client'

/**
 * Admin → Users.
 *
 * Lists everyone who has signed in, merging Clerk's identity data with the
 * `users.role` column and each person's calculator count from the database.
 *
 * Auth now goes through `authedFetch` (a real Clerk session token). The
 * previous version sent `Bearer temp-token` plus an `x-admin-user-id` header,
 * which the secured endpoints reject — and which used to be the way anyone
 * could impersonate an admin.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, ShieldCheck, ShieldOff, RefreshCw, AlertCircle, Search, Eye } from 'lucide-react'
import { fetchAdminUsers, deleteAdminUser, setUserRole } from '@/lib/admin-api'
import { useAuth } from '@/components/providers/AuthContext'
import AdminUserDetail from './AdminUserDetail'

export default function AdminUsers({ darkMode }: { darkMode: boolean }) {
  const { authedFetch, user: me } = useAuth()

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [openUserId, setOpenUserId] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminUsers(authedFetch)
      setUsers(Array.isArray(data.users) ? data.users : [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [authedFetch])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Permanently delete ${email}?\n\nThis removes their Clerk account and every calculator they built. It cannot be undone.`)) {
      return
    }
    setBusyId(id)
    try {
      await deleteAdminUser(authedFetch, id)
      await loadUsers()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const handleRole = async (id: string, next: 'admin' | 'user') => {
    setBusyId(id)
    try {
      await setUserRole(authedFetch, id, next)
      await loadUsers()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        (u.email || '').toLowerCase().includes(q) ||
        (u.firstName || '').toLowerCase().includes(q) ||
        (u.lastName || '').toLowerCase().includes(q) ||
        (u.id || '').toLowerCase().includes(q)
    )
  }, [users, search])

  const cardBase = darkMode ? 'border-white/5 bg-[#12121a]' : 'border-gray-200 bg-white'

  if (loading) {
    return (
      <div className={`rounded-xl border p-8 flex items-center justify-center gap-3 ${cardBase}`}>
        <RefreshCw className="w-4 h-4 animate-spin opacity-50" />
        <span className="text-sm opacity-60">Loading users…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`rounded-xl border p-6 ${cardBase}`}>
        <div className="flex items-start gap-3 text-red-500">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Could not load users</p>
            <p className="text-xs opacity-80 mt-1">{error}</p>
            <button
              onClick={loadUsers}
              className="mt-3 text-xs font-bold underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${cardBase}`}>
      {openUserId && (
        <AdminUserDetail
          userId={openUserId}
          darkMode={darkMode}
          onClose={() => setOpenUserId(null)}
          onChanged={loadUsers}
        />
      )}

      <div className={`flex flex-wrap items-center justify-between gap-3 p-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
        <p className="text-sm font-bold">
          {filtered.length === users.length
            ? `${users.length} ${users.length === 1 ? 'user' : 'users'}`
            : `${filtered.length} of ${users.length}`}
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email or ID…"
              className={`h-8 pl-8 pr-3 rounded-lg text-xs w-56 focus:outline-none ${
                darkMode
                  ? 'bg-black/30 border border-white/5 focus:border-white/20'
                  : 'bg-gray-50 border border-gray-200 focus:border-gray-400'
              }`}
            />
          </div>
          <button
            onClick={loadUsers}
            className="inline-flex items-center gap-1.5 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead
            className={`text-left text-[10px] uppercase tracking-wider ${
              darkMode ? 'border-b border-white/5 text-neutral-500' : 'border-b border-gray-200 text-gray-500'
            }`}
          >
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Calculators</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isAdmin = u.dbRole === 'admin' || u.clerkRole === 'admin'
              const isMe = me?.id === u.id
              return (
                <tr
                  key={u.id}
                  onClick={() => setOpenUserId(u.id)}
                  className={`border-b cursor-pointer transition-colors ${
                    darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <td className="p-4">
                    <div className="font-bold">{u.email || 'No email'}</div>
                    <div className="font-mono text-[10px] opacity-40">{u.id}</div>
                  </td>
                  <td className="p-4 text-xs opacity-60">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-4 text-xs">{u.calculatorCount ?? 0}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                        isAdmin ? 'bg-violet-500/10 text-violet-500' : 'bg-indigo-500/10 text-indigo-500'
                      }`}
                    >
                      {isAdmin ? 'admin' : 'user'}
                    </span>
                  </td>
                  {/* Stop row-click from firing when an action button is used. */}
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setOpenUserId(u.id)}
                        title="View full detail — devices, IPs, sessions"
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Eye className="w-4 h-4 opacity-60" />
                      </button>
                      <button
                        onClick={() => handleRole(u.id, isAdmin ? 'user' : 'admin')}
                        disabled={busyId === u.id || isMe}
                        title={isMe ? 'You cannot change your own role' : isAdmin ? 'Demote to user' : 'Promote to admin'}
                        className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        {isAdmin ? (
                          <ShieldOff className="w-4 h-4 text-amber-500" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-violet-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.email)}
                        disabled={busyId === u.id || isMe}
                        title={isMe ? 'You cannot delete your own account' : 'Delete user'}
                        className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className={`p-4 text-[11px] leading-relaxed ${darkMode ? 'text-neutral-500 border-t border-white/5' : 'text-gray-500 border-t border-gray-100'}`}>
        Promoting someone here sets their role in the database. Admins listed in the{' '}
        <code className="font-mono">ADMIN_EMAILS</code> environment variable are always admins and cannot be
        demoted from this screen.
      </p>
    </div>
  )
}
