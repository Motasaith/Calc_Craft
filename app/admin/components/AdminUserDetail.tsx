'use client'

/**
 * Admin → Users → one user.
 *
 * Everything Clerk knows plus everything this site knows, on one screen:
 * identity and verification state, linked social logins, MFA/password status,
 * every session with its IP address, city, browser and device, and the
 * calculators they've built here with view counts.
 *
 * The device and network detail comes from Clerk's session records
 * (`latest_activity`), which is the only place the Backend API exposes IP and
 * geo. See functions/api/admin/user/[userId].ts.
 */

import React, { useEffect, useState, useCallback } from 'react'
import {
  X, Shield, ShieldOff, Smartphone, Monitor, Globe, Mail, KeyRound, LogOut,
  AlertCircle, RefreshCw, CheckCircle2, XCircle, Calculator, Eye, Ban, Unlock,
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthContext'

interface Props {
  userId: string
  darkMode: boolean
  onClose: () => void
  onChanged?: () => void
}

export default function AdminUserDetail({ userId, darkMode, onClose, onChanged }: Props) {
  const { authedFetch, user: me } = useAuth()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authedFetch(`/api/admin/user/${encodeURIComponent(userId)}`)
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Could not load that user.')
      setData(body)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [authedFetch, userId])

  useEffect(() => {
    load()
  }, [load])

  // Escape closes the panel — expected behaviour for anything drawer-shaped.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const act = async (action: string, confirmMsg?: string) => {
    if (confirmMsg && !confirm(confirmMsg)) return
    setBusy(true)
    try {
      const res = await authedFetch(`/api/admin/user/${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'That action failed.')
      await load()
      onChanged?.()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setBusy(false)
    }
  }

  const panel = darkMode ? 'bg-[#12121a] border-white/5 text-neutral-200' : 'bg-white border-gray-200 text-gray-800'
  const sub = darkMode ? 'text-neutral-500' : 'text-gray-500'
  const rowBorder = darkMode ? 'border-white/5' : 'border-gray-100'

  const p = data?.profile
  const isMe = me?.id === userId

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative w-full max-w-2xl h-full overflow-y-auto border-l ${panel}`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-start justify-between gap-4 p-5 border-b backdrop-blur ${panel} ${rowBorder}`}>
          <div className="flex items-center gap-3 min-w-0">
            {p?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-indigo-500" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-bold truncate">
                {p ? [p.firstName, p.lastName].filter(Boolean).join(' ') || p.primaryEmail || 'User' : 'Loading…'}
              </h2>
              <p className={`text-xs truncate ${sub}`}>{p?.primaryEmail}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 shrink-0" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="p-10 flex items-center justify-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin opacity-50" />
            <span className="text-sm opacity-60">Loading…</span>
          </div>
        )}

        {error && (
          <div className="p-6">
            <div className="flex items-start gap-3 text-red-500">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Could not load this user</p>
                <p className="text-xs opacity-80 mt-1">{error}</p>
                <button onClick={load} className="mt-3 text-xs font-bold underline">Try again</button>
              </div>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="p-5 space-y-6">
            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <Badge on={p.banned} labelOn="Banned" labelOff="Active" toneOn="red" toneOff="emerald" />
              <Badge on={p.locked} labelOn="Locked" labelOff="Unlocked" toneOn="amber" toneOff="neutral" />
              <Badge on={p.twoFactorEnabled} labelOn="2FA on" labelOff="No 2FA" toneOn="violet" toneOff="neutral" />
              <Badge on={p.passwordEnabled} labelOn="Password" labelOff="Social only" toneOn="blue" toneOff="neutral" />
              {p.role === 'admin' && <Badge on labelOn="Admin" labelOff="" toneOn="violet" toneOff="neutral" />}
            </div>

            {/* Identity */}
            <Section title="Identity" darkMode={darkMode}>
              <Row label="User ID" darkMode={darkMode}>
                <code className="text-[11px] font-mono opacity-70">{p.id}</code>
              </Row>
              <Row label="Joined" darkMode={darkMode}>{fmt(p.createdAt)}</Row>
              <Row label="Last sign-in" darkMode={darkMode}>{fmt(p.lastSignInAt)}</Row>
              {p.username && <Row label="Username" darkMode={darkMode}>{p.username}</Row>}
            </Section>

            {/* Emails */}
            <Section title="Email addresses" darkMode={darkMode}>
              {p.emails.length === 0 && <p className={`text-xs ${sub}`}>None on file.</p>}
              {p.emails.map((e: any) => (
                <div key={e.email} className={`flex items-center justify-between gap-3 py-2 border-b last:border-0 ${rowBorder}`}>
                  <span className="text-sm truncate">{e.email}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {e.primary && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
                        primary
                      </span>
                    )}
                    {e.verified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-label="Verified" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500" aria-label="Unverified" />
                    )}
                  </div>
                </div>
              ))}
            </Section>

            {/* How they sign in */}
            <Section title="Sign-in methods" darkMode={darkMode}>
              <div className="flex flex-wrap gap-2">
                {p.passwordEnabled && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 font-bold">
                    <KeyRound className="w-3.5 h-3.5" /> Password
                  </span>
                )}
                {p.socialAccounts.map((a: any) => (
                  <span
                    key={a.provider + a.email}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-violet-500/10 text-violet-500 font-bold capitalize"
                    title={a.email || a.username || ''}
                  >
                    <Globe className="w-3.5 h-3.5" /> {a.provider}
                  </span>
                ))}
                {!p.passwordEnabled && p.socialAccounts.length === 0 && (
                  <p className={`text-xs ${sub}`}>No sign-in method recorded.</p>
                )}
              </div>
            </Section>

            {/* Sessions — the device / IP / location detail */}
            <Section title={`Sessions & devices (${data.devices.length})`} darkMode={darkMode}>
              {data.devices.length === 0 && (
                <p className={`text-xs ${sub}`}>
                  No sessions recorded. Clerk keeps a limited history, so this is normal for an account
                  that has not signed in recently.
                </p>
              )}
              <div className="space-y-2">
                {data.devices.map((d: any) => (
                  <div key={d.sessionId} className={`p-3 rounded-xl border ${rowBorder} ${darkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {d.isMobile ? (
                          <Smartphone className="w-4 h-4 text-indigo-500 shrink-0" />
                        ) : (
                          <Monitor className="w-4 h-4 text-indigo-500 shrink-0" />
                        )}
                        <span className="text-sm font-bold truncate">{d.browser || 'Unknown browser'}</span>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          d.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-neutral-500/10 text-neutral-500'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <div className={`grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] ${sub}`}>
                      <span>IP: <span className="font-mono opacity-90">{d.ipAddress || '—'}</span></span>
                      <span>Location: {[d.city, d.country].filter(Boolean).join(', ') || '—'}</span>
                      <span>Device: {d.os || '—'}</span>
                      <span>Last active: {fmt(d.lastActiveAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* What they've built here */}
            <Section title="Activity on this site" darkMode={darkMode}>
              {data.data.error ? (
                <p className="text-xs text-amber-500">{data.data.error}</p>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <Stat label="Built" value={data.data.calculators.length} darkMode={darkMode} />
                    <Stat label="Views" value={data.data.totalViews} darkMode={darkMode} />
                    <Stat label="Saved" value={data.data.savedCount} darkMode={darkMode} />
                    <Stat label="Embeds" value={data.data.embedCount} darkMode={darkMode} />
                  </div>

                  {data.data.calculators.length === 0 ? (
                    <p className={`text-xs ${sub}`}>They haven&apos;t built a calculator yet.</p>
                  ) : (
                    <div className="space-y-1">
                      {data.data.calculators.map((c: any) => (
                        <div key={c.id} className={`flex items-center justify-between gap-3 py-2 border-b last:border-0 ${rowBorder}`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <Calculator className="w-3.5 h-3.5 opacity-40 shrink-0" />
                            <span className="text-xs truncate">{c.name}</span>
                            {c.createdWith === 'ai' && (
                              <span className="text-[9px] uppercase font-bold px-1 py-0.5 rounded bg-indigo-500/10 text-indigo-500 shrink-0">
                                AI
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-[11px] flex items-center gap-1 ${sub}`}>
                              <Eye className="w-3 h-3" /> {c.views}
                            </span>
                            {c.publicId && (
                              <a
                                href={`/embed/c?id=${c.publicId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-bold text-indigo-500 hover:underline"
                              >
                                Open
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Section>

            {/* Actions */}
            <Section title="Actions" darkMode={darkMode}>
              {isMe ? (
                <p className={`text-xs ${sub}`}>
                  This is your own account — ban and lock are disabled to stop you locking yourself out.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    onClick={() => act(p.banned ? 'unban' : 'ban', p.banned ? undefined : 'Ban this user? They will be signed out and unable to sign back in.')}
                    disabled={busy}
                    icon={p.banned ? Shield : Ban}
                    tone={p.banned ? 'emerald' : 'red'}
                    label={p.banned ? 'Unban' : 'Ban user'}
                  />
                  <ActionButton
                    onClick={() => act(p.locked ? 'unlock' : 'lock')}
                    disabled={busy}
                    icon={p.locked ? Unlock : ShieldOff}
                    tone="amber"
                    label={p.locked ? 'Unlock' : 'Lock'}
                  />
                  <ActionButton
                    onClick={() => act('signOutAll', 'Sign this user out of every device?')}
                    disabled={busy}
                    icon={LogOut}
                    tone="neutral"
                    label="Sign out everywhere"
                  />
                </div>
              )}
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Small pieces ──────────────────────────────────────────────────────────

function Section({ title, children, darkMode }: { title: string; children: React.ReactNode; darkMode: boolean }) {
  return (
    <div>
      <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
        {title}
      </h3>
      <div className={`rounded-xl border p-3 ${darkMode ? 'border-white/5 bg-black/20' : 'border-gray-200 bg-gray-50/60'}`}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, children, darkMode }: { label: string; children: React.ReactNode; darkMode: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-1.5 border-b last:border-0 ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
      <span className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{label}</span>
      <span className="text-xs font-medium text-right truncate">{children}</span>
    </div>
  )
}

function Stat({ label, value, darkMode }: { label: string; value: number; darkMode: boolean }) {
  return (
    <div className={`rounded-lg p-2 text-center ${darkMode ? 'bg-white/5' : 'bg-white border border-gray-200'}`}>
      <div className="text-lg font-extrabold leading-none">{value}</div>
      <div className={`text-[9px] uppercase tracking-wider mt-1 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
        {label}
      </div>
    </div>
  )
}

function Badge({
  on, labelOn, labelOff, toneOn, toneOff,
}: { on: boolean; labelOn: string; labelOff: string; toneOn: string; toneOff: string }) {
  if (!on && !labelOff) return null
  const tone = on ? toneOn : toneOff
  const tones: Record<string, string> = {
    red: 'bg-red-500/10 text-red-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
    violet: 'bg-violet-500/10 text-violet-500',
    blue: 'bg-blue-500/10 text-blue-500',
    neutral: 'bg-neutral-500/10 text-neutral-500',
  }
  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg ${tones[tone] || tones.neutral}`}>
      {on ? labelOn : labelOff}
    </span>
  )
}

function ActionButton({
  onClick, disabled, icon: Icon, tone, label,
}: { onClick: () => void; disabled: boolean; icon: any; tone: string; label: string }) {
  const tones: Record<string, string> = {
    red: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
    neutral: 'bg-neutral-500/10 text-neutral-400 hover:bg-neutral-500/20',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${tones[tone]}`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  )
}

function fmt(value: number | string | null) {
  if (!value) return '—'
  const d = typeof value === 'number' ? new Date(value) : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
