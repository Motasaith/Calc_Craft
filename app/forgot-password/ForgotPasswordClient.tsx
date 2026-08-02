'use client'

/**
 * Password reset, via Clerk.
 *
 * app/sign-in/page.tsx has always linked to /forgot-password, but the route did
 * not exist — the link 404'd. This implements Clerk's two-step reset in one
 * page: request a code by email, then submit the code with a new password.
 *
 * (The previous WordPress reset flow at /reset-password has been removed along
 * with the rest of the WordPress auth stack. Clerk owns identity now, so it
 * also owns password resets — there is no server-side code of ours involved.)
 */

import { useState } from 'react'
import Link from 'next/link'
import { useSignIn } from '@clerk/react/legacy'
import {
  KeyRound, Mail, Lock, ArrowLeft, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'

type Step = 'request' | 'reset' | 'done'

export default function ForgotPasswordClient() {
  const { isLoaded, signIn, setActive } = useSignIn()

  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const clerkError = (err: any, fallback: string) =>
    err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || fallback

  // ── Step 1: email a reset code ─────────────────────────────────────────
  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn) return

    setLoading(true)
    setError('')
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      })
      setStep('reset')
    } catch (err: any) {
      setError(clerkError(err, 'Could not send a reset email. Check the address and try again.'))
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: code + new password ────────────────────────────────────────
  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn) return

    if (password.length < 8) {
      setError('Please use at least 8 characters.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password,
      })

      if (result.status === 'complete') {
        setStep('done')
        // Reset succeeded and Clerk handed back a session — activate it so the
        // user lands signed in rather than being asked to log in again.
        await setActive({ session: result.createdSessionId, redirectUrl: '/dashboard' })
        return
      }

      if (result.status === 'needs_second_factor') {
        setError('Two-factor authentication is on for this account. Finish signing in from the sign-in page.')
      } else {
        setError(`Could not complete the reset (${result.status}).`)
      }
    } catch (err: any) {
      setError(clerkError(err, 'That code is incorrect or has expired. Request a new one.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f5ef] text-dark-900 flex items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-sm">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-dark-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>

        <div className="bg-white rounded-2xl border border-dark-800/10 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 mb-3">
              {step === 'done' ? <CheckCircle2 className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              {step === 'request' && 'Reset your password'}
              {step === 'reset' && 'Check your email'}
              {step === 'done' && 'Password updated'}
            </h1>
            <p className="mt-1.5 text-xs text-dark-500 font-medium">
              {step === 'request' && `We'll email you a code to set a new password for your ${BRAND.name} account.`}
              {step === 'reset' && `We sent a code to ${email}. Enter it below with your new password.`}
              {step === 'done' && 'Signing you in…'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={requestCode} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-dark-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-dark-800/15 rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-dark-900 hover:bg-dark-800 text-white font-extrabold text-sm py-3 rounded-2xl shadow-[0_4px_0_#dfaa44] hover:-translate-y-0.5 active:translate-y-px transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset code'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={submitReset} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1">
                  Reset code
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-white border border-dark-800/15 rounded-xl px-4 py-2.5 text-sm tracking-[0.3em] font-mono placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1">
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
                    className="w-full bg-white border border-dark-800/15 rounded-xl pl-10 pr-11 py-2.5 text-sm placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-700 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-dark-900 hover:bg-dark-800 text-white font-extrabold text-sm py-3 rounded-2xl shadow-[0_4px_0_#dfaa44] hover:-translate-y-0.5 active:translate-y-px transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set new password'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('request'); setError(''); setCode('') }}
                className="w-full text-xs font-bold text-dark-500 hover:text-dark-900 transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
