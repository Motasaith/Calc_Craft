'use client'

import { useSignUp } from '@clerk/react/legacy'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BRAND } from '@/lib/brand'
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Calculator, 
  ShieldCheck,
  MailCheck
} from 'lucide-react'

export default function CustomSignUpPage() {
  // useSignUp() is the supported hook. The page previously used useClerk() plus
  // clerk.client.signUp — in @clerk/react v6 that object's `loaded` flag is
  // undefined, so `disabled={loading || !isLoaded}` left Create Account
  // permanently greyed out and the form could never be submitted.
  const { isLoaded, signUp, setActive } = useSignUp()

  const [username, setUsername] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Verification Code State
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  /** Where to land afterwards — honours ?redirect_url= from promptSignIn(). */
  const destination = () => {
    if (typeof window === 'undefined') return '/dashboard'
    const target = new URLSearchParams(window.location.search).get('redirect_url')
    // Same-site paths only; an absolute URL here would be an open redirect.
    return target && target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard'
  }

  // Handle standard registration form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signUp) return

    setLoading(true)
    setError('')

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      })

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: any) {
      // Log the whole thing — Clerk's failures are far more specific than the
      // banner can show, and a silent one is impossible to debug from a report
      // of "the button does nothing".
      console.error('[sign-up] create failed:', err?.errors || err)

      const first = err?.errors?.[0]
      const code = first?.code || ''

      if (code.includes('captcha')) {
        setError(
          'Verification could not be completed. Please refresh the page and try again — if it keeps happening, disable any ad blocker for this site.'
        )
      } else {
        setError(
          first?.longMessage ||
            first?.message ||
            err?.message ||
            'Failed to create account. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle Email Verification Code submit
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signUp) return

    setLoading(true)
    setError('')

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code })

      if (completeSignUp.status === 'complete') {
        // Await activation fully and let Clerk navigate, rather than racing it
        // with a manual location assignment.
        await setActive({ session: completeSignUp.createdSessionId, redirectUrl: destination() })
        return
      }

      if (completeSignUp.status === 'missing_requirements') {
        setError('Almost there — some required details are still missing. Check the fields above.')
      } else {
        setError(`Verification could not be completed (${completeSignUp.status}).`)
      }
    } catch (err: any) {
      console.error('[sign-up] verify failed:', err?.errors || err)

      const first = err?.errors?.[0]
      const errCode = first?.code || ''

      // Clerk locks a verification attempt after a few wrong codes. The raw
      // message ("Too many failed attempts...") does not tell the user what to
      // actually do next, and the page has no obvious way forward.
      if (errCode.includes('too_many') || /too many/i.test(first?.message || '')) {
        setError(
          'Too many incorrect codes. Request a new one below, and use the most recent email — earlier codes stop working once a new one is sent.'
        )
      } else if (errCode.includes('expired')) {
        setError('That code has expired. Request a new one below.')
      } else {
        setError(first?.longMessage || first?.message || 'That code is not correct.')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Send a fresh verification code.
   *
   * Needed because codes expire and Clerk locks a verification attempt after a
   * few wrong ones ("Too many failed attempts"). Without this the page was a
   * dead end: the only escape was knowing to reload by hand.
   */
  const resendCode = async () => {
    if (!isLoaded || !signUp) return
    setLoading(true)
    setError('')
    setCode('')
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setNotice('A new code is on its way. Use the newest email — older codes no longer work.')
    } catch (err: any) {
      console.error('[sign-up] resend failed:', err?.errors || err)
      setError(
        err?.errors?.[0]?.longMessage ||
          err?.errors?.[0]?.message ||
          'Could not send a new code. Please start over.'
      )
    } finally {
      setLoading(false)
    }
  }

  /** Abandon this attempt and return to the form. */
  const startOver = () => {
    setPendingVerification(false)
    setCode('')
    setError('')
    setNotice('')
  }

  return (
    <div className="h-screen w-full bg-[#f7f5ef] text-dark-900 flex overflow-hidden font-sans select-none">
      
      {/* LEFT PANEL: Custom Form (Full width on mobile, 50% on desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 xl:p-16 h-full relative z-10">
        
        {/* Top Header: Brand Logo Link */}
        <div className="flex items-center justify-between shrink-0">
          <Link 
            href="/" 
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
            aria-label="Back to home"
          >
            <div className="w-9 h-9 rounded-xl bg-dark-900 flex items-center justify-center shadow-md">
              <Calculator className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-dark-900 leading-none">
              {BRAND.name}
            </span>
          </Link>

          <Link 
            href="/"
            className="text-xs font-bold text-dark-500 hover:text-dark-900 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dark-800/10 bg-white/40 hover:bg-white/80"
          >
            Back to site
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Center Container (constrained to avoid scroll) */}
        <div className="my-auto max-w-sm w-full mx-auto">
          
          {!pendingVerification ? (
            /* STEP 1: Registration Form */
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-dark-900 tracking-tight">
                  Sign Up
                </h1>
                <p className="mt-1.5 text-xs text-dark-500 font-medium">
                  Create a free account to customize and save your calculators.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{error}</div>
                </div>
              )}

              {/* Google, GitHub and LinkedIn sign-up were removed here along with
                  the "or register with email" divider, which only made sense as a
                  separator between the two options. The providers are disabled in
                  Clerk, so the buttons could only ever produce an error. */}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full bg-white border border-dark-800/15 rounded-xl px-4 py-2.5 text-sm text-dark-900 placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white border border-dark-800/15 rounded-xl px-4 py-2.5 text-sm text-dark-900 placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full bg-white border border-dark-800/15 rounded-xl pl-4 pr-11 py-2.5 text-sm text-dark-900 placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-700 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Clerk mounts its bot-protection widget (Cloudflare Turnstile)
                    into this element. It is REQUIRED for custom sign-up flows:
                    production instances enable captcha by default, and without
                    this node signUp.create() is rejected before it reaches the
                    account-creation step.

                    It never appeared in development because Clerk disables bot
                    protection on dev instances — the failure only shows up once
                    you move to a pk_live_ key.

                    "smart" widget type means it renders invisibly for ordinary
                    visitors and only shows a challenge when a request looks
                    suspicious, so this usually occupies no visible space. */}
                <div id="clerk-captcha" className="mt-2 empty:hidden" />

                <button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className="w-full mt-2 bg-dark-900 hover:bg-dark-800 text-white font-extrabold text-sm py-3 rounded-2xl shadow-[0_4px_0_#dfaa44] hover:-translate-y-0.5 active:translate-y-px transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch to Sign In */}
              <div className="mt-6 text-center text-xs text-dark-500 font-medium">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-primary-700 font-bold hover:underline ml-1">
                  Sign in instead
                </Link>
              </div>
            </>
          ) : (
            /* STEP 2: Email Verification Code Input */
            <div className="animate-fade-in">
              <div className="mb-6 text-center">
                <div className="w-11 h-11 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-3 text-primary-700">
                  <MailCheck className="w-5.5 h-5.5" />
                </div>
                <h2 className="text-2xl font-extrabold text-dark-900 tracking-tight">
                  Verify Email
                </h2>
                <p className="mt-1.5 text-xs text-dark-500">
                  Enter the code sent to <span className="font-bold text-dark-800">{emailAddress}</span>.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{error}</div>
                </div>
              )}

              {/* Confirmation that a new code was sent — distinct from an error,
                  so the two are not confused after a failed attempt. */}
              {notice && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                  <MailCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{notice}</div>
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1 text-center">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-white border border-dark-800/15 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-dark-900 placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !isLoaded}
                  className="w-full bg-dark-900 hover:bg-dark-800 text-white font-extrabold text-sm py-3 rounded-2xl shadow-[0_4px_0_#dfaa44] hover:-translate-y-0.5 active:translate-y-px transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Escape hatches. Without these the verification step is a dead
                    end once a code expires or the attempt gets locked after a few
                    wrong tries — the only way out was reloading the page. */}
                <div className="flex items-center justify-center gap-3 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={loading || !isLoaded}
                    className="font-bold text-primary-700 hover:text-primary-800 hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Send a new code
                  </button>
                  <span className="text-dark-300">·</span>
                  <button
                    type="button"
                    onClick={startOver}
                    disabled={loading}
                    className="font-bold text-dark-500 hover:text-dark-800 hover:underline disabled:opacity-40 transition-colors"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Footer info: Privacy Notice */}
        <div className="flex items-center justify-between text-[10px] text-dark-400 font-semibold shrink-0 pt-4 border-t border-dark-800/5">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SSL Encrypted</span>
          </div>
          <span>© {new Date().getFullYear()} {BRAND.name}</span>
        </div>

      </div>

      {/* RIGHT PANEL: Framed Visual Showcase (No text on image, matches site) */}
      <div className="hidden lg:block lg:w-1/2 h-full p-6 sm:p-8 relative">
        <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-xl border border-dark-800/10">
          <Image
            src="/images/auth/signup-bg.webp"
            alt="Calculator Showcase"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

    </div>
  )
}
