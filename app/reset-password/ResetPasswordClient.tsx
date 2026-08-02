'use client'

/**
 * ResetPasswordClient — step 2 of the forgot-password flow.
 *
 * WordPress emails a link to /reset-password?key=<one-time-key>&login=<username>.
 * This page reads those from the query string, takes a new password, and posts
 * them to the WordPress REST endpoint via AuthContext.resetPassword().
 *
 * The key is single-use and expires on the WordPress side — this page just
 * carries it. Read from window.location rather than useSearchParams so the page
 * stays compatible with `output: 'export'` (no Suspense boundary needed).
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { KeyRound, Lock, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/providers/AuthContext'

type Status = 'reading' | 'ready' | 'invalid' | 'done'

export default function ResetPasswordClient() {
  const { resetPassword, setAuthModalOpen, setAuthModalTab } = useAuth()

  const [status, setStatus] = useState<Status>('reading')
  const [resetKey, setResetKey] = useState('')
  const [loginName, setLoginName] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const key = params.get('key') || ''
    // WordPress calls it `login`; accept `user` too in case the email template
    // was customised.
    const login = params.get('login') || params.get('user') || ''

    if (key && login) {
      setResetKey(key)
      setLoginName(login)
      setStatus('ready')
    } else {
      setStatus('invalid')
    }
  }, [])

  const strength = passwordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Please use at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('The two passwords do not match.')
      return
    }

    setLoading(true)
    const res = await resetPassword(resetKey, loginName, password)
    setLoading(false)

    if (res.success) {
      setStatus('done')
    } else {
      setError(res.error || 'Could not reset your password.')
    }
  }

  const openSignIn = () => {
    setAuthModalTab('login')
    setAuthModalOpen(true)
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
        <section className="pt-32 pb-24 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8"
          >
            {/* ── Header ── */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 mb-3">
                {status === 'done' ? <CheckCircle2 className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
              </div>
              <h1 className="text-xl font-extrabold text-dark-900">
                {status === 'done' ? 'Password updated' : 'Choose a new password'}
              </h1>
              {status === 'ready' && (
                <p className="text-xs text-dark-500 mt-1">
                  Setting a new password for <span className="font-bold text-dark-700">{loginName}</span>
                </p>
              )}
            </div>

            {/* ── Reading the link ── */}
            {status === 'reading' && (
              <div className="flex justify-center py-6">
                <span className="w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              </div>
            )}

            {/* ── Bad or missing link ── */}
            {status === 'invalid' && (
              <div className="space-y-4">
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    This reset link is incomplete or has already been used. Reset links are valid once and expire
                    after 24 hours.
                  </span>
                </p>
                <button
                  onClick={() => {
                    setAuthModalTab('forgot')
                    setAuthModalOpen(true)
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors"
                >
                  Request a new reset link
                </button>
                <Link
                  href="/"
                  className="block text-center text-xs text-dark-500 hover:text-dark-800 transition-colors"
                >
                  Back to the homepage
                </Link>
              </div>
            )}

            {/* ── The form ── */}
            {status === 'ready' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 font-semibold">
                    {error}
                  </p>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-dark-500 uppercase tracking-widest block pl-1">
                    New password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full h-11 pl-10 pr-11 bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-xl text-sm text-dark-800 placeholder:text-gray-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {password && (
                    <div className="flex items-center gap-2 pt-1.5">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${strength.color}`}
                          style={{ width: `${strength.percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 w-14 text-right">
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-dark-500 uppercase tracking-widest block pl-1">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Type it again"
                      className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 rounded-xl text-sm text-dark-800 placeholder:text-gray-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Set new password'
                  )}
                </button>
              </form>
            )}

            {/* ── Success ── */}
            {status === 'done' && (
              <div className="space-y-4">
                <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Your password has been changed. You can sign in with it now.</span>
                </p>
                <button
                  onClick={openSignIn}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors"
                >
                  Sign in
                </button>
                <Link
                  href="/dashboard"
                  className="block text-center text-xs text-dark-500 hover:text-dark-800 transition-colors"
                >
                  Go to my dashboard
                </Link>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}

/** Rough visual feedback only — the real rules are enforced by WordPress. */
function passwordStrength(pw: string): { percent: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++

  if (score <= 2) return { percent: 33, label: 'Weak', color: 'bg-red-500' }
  if (score <= 3) return { percent: 66, label: 'Okay', color: 'bg-amber-500' }
  return { percent: 100, label: 'Strong', color: 'bg-emerald-500' }
}
