'use client'

import { useSignIn } from '@clerk/react/legacy'
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
  ShieldCheck
} from 'lucide-react'

export default function CustomSignInPage() {
  // useSignIn() is the supported way to drive a custom flow. The previous code
  // reached into `clerk.client.signIn` directly and called `setActive` followed
  // immediately by a hard `window.location.href` assignment — the navigation
  // raced session activation, which is why sign-in often appeared to do nothing.
  const { isLoaded, signIn, setActive } = useSignIn()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /** Where to land after signing in — honours ?redirect_url= from promptSignIn(). */
  const destination = () => {
    if (typeof window === 'undefined') return '/'
    const target = new URLSearchParams(window.location.search).get('redirect_url')
    // Only allow same-site paths; an absolute URL here would be an open redirect.
    return target && target.startsWith('/') && !target.startsWith('//') ? target : '/'
  }

  // Handle standard Email / Username + Password sign in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn) return

    setLoading(true)
    setError('')

    try {
      const result = await signIn.create({ identifier, password })

      if (result.status === 'complete') {
        // Await setActive fully, and let Clerk perform the navigation via
        // redirectUrl rather than racing it with a manual assignment.
        await setActive({ session: result.createdSessionId, redirectUrl: destination() })
        return
      }

      if (result.status === 'needs_first_factor' || result.status === 'needs_second_factor') {
        setError('This account needs a verification code. Check your email, or use a social login above.')
      } else if (result.status === 'needs_new_password') {
        setError('Your password must be reset before you can sign in. Use "Forgot?" below.')
      } else {
        setError(`Sign-in could not be completed (${result.status}). Please try again.`)
      }
    } catch (err: any) {
      const msg =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        'Failed to sign in. Please check your credentials.'
      setError(msg)
    } finally {
      setLoading(false)
    }
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
            className="text-xs font-bold text-dark-500 hover:text-dark-900 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dark-800/10 bg-white/40 hover:bg-white/80"
          >
            Back to site
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Center Form Container (constrained to avoid scroll) */}
        <div className="my-auto max-w-sm w-full mx-auto">
          
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-dark-900 tracking-tight">
              Sign In
            </h1>
            <p className="mt-1.5 text-xs text-dark-500 font-medium">
              Enter your credentials to access your Calc Craft dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{error}</div>
            </div>
          )}

          {/* Google, GitHub and LinkedIn sign-in were removed here along with the
              "or continue with email" divider, which only made sense as a
              separator between the two options. The providers are disabled in
              Clerk, so the buttons could only ever produce an error. */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1">
                Email or Username
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-dark-800/15 rounded-xl px-4 py-2.5 text-sm text-dark-900 placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-primary-700 hover:text-primary-800 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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

            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full mt-2 bg-dark-900 hover:bg-dark-800 text-white font-extrabold text-sm py-3 rounded-2xl shadow-[0_4px_0_#dfaa44] hover:-translate-y-0.5 active:translate-y-px transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs text-dark-500 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-primary-700 font-bold hover:underline ml-1">
              Create free account
            </Link>
          </div>

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
            src="/images/auth/signin-bg.webp"
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
