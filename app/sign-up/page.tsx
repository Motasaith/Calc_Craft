'use client'

import { useClerk } from '@clerk/react'
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
  const clerk = useClerk()

  const [username, setUsername] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Verification Code State
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle standard registration form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clerk.loaded) return

    setLoading(true)
    setError('')

    try {
      await clerk.client.signUp.create({
        username,
        emailAddress,
        password,
      })

      // Send the email verification code
      await clerk.client.signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: any) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Failed to create account. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Handle Email Verification Code submit
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clerk.loaded) return

    setLoading(true)
    setError('')

    try {
      const completeSignUp = await clerk.client.signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await clerk.setActive({ session: completeSignUp.createdSessionId })
        window.location.href = '/'
      } else {
        console.log('Verification status:', completeSignUp.status)
        setError('Verification incomplete. Please check your code.')
      }
    } catch (err: any) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Invalid verification code.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Handle OAuth Sign Up
  const handleOAuth = (provider: 'oauth_google' | 'oauth_github' | 'oauth_linkedin') => {
    if (!clerk.loaded) return
    setError('')
    clerk.client.signUp.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: window.location.origin + '/sso-callback',
      redirectUrlComplete: window.location.origin + '/',
    })
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

              {/* Custom Social Buttons */}
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => handleOAuth('oauth_google')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-dark-800/10 hover:border-dark-800/20 hover:bg-dark-50 transition-all text-xs font-bold text-dark-700 active:scale-[0.98]"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth('oauth_github')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-dark-800/10 hover:border-dark-800/20 hover:bg-dark-50 transition-all text-xs font-bold text-dark-700 active:scale-[0.98]"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-dark-900" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth('oauth_linkedin')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white border border-dark-800/10 hover:border-dark-800/20 hover:bg-dark-50 transition-all text-xs font-bold text-dark-700 active:scale-[0.98]"
                >
                  <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
                  </svg>
                  <span>LinkedIn</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-800/10" />
                </div>
                <span className="relative px-3 bg-[#f7f5ef] text-[10px] font-bold text-dark-400 uppercase tracking-widest">
                  Or register with email
                </span>
              </div>

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

                <button
                  type="submit"
                  disabled={loading || !clerk.loaded}
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

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-dark-600 mb-1 text-center">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-white border border-dark-800/15 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-widest text-dark-900 placeholder-dark-300 focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !clerk.loaded}
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
