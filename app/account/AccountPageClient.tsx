'use client'

/**
 * Account management, on a page of our own rather than Clerk's modal.
 *
 * <UserProfile /> is deliberately kept rather than rebuilt. It carries email and
 * phone management, password changes, MFA enrolment, connected social accounts,
 * active device sessions and account deletion — each a multi-step verified flow.
 * Rebuilding them by hand would mean reimplementing all of that and keeping it
 * in step with Clerk forever.
 *
 * Instead it is restyled through lib/clerk-appearance.ts, and wrapped in the
 * site's own Navbar, Footer and page chrome, so it reads as part of the site
 * while every Clerk feature stays intact.
 */

import { UserProfile } from '@clerk/react'
import Link from 'next/link'
import { ArrowLeft, LayoutDashboard, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/providers/AuthContext'
import { clerkAppearance } from '@/lib/clerk-appearance'

export default function AccountPageClient() {
  const { user, isLoading, promptSignIn } = useAuth()

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#f7f5ef]">
          <span className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-24 px-4 bg-[#f7f5ef]">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-dark-800/10 p-8 shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-extrabold text-dark-900 mb-2">Sign in to manage your account</h1>
            <p className="text-sm text-dark-500 mb-6">
              Your profile, password and security settings live here.
            </p>
            <button
              onClick={() => promptSignIn()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-900 text-white font-bold text-sm hover:bg-dark-800 shadow-[0_4px_0_#dfaa44] transition-all"
            >
              Sign in
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-24 px-4 sm:px-6 bg-[#f7f5ef]">
        <div className="max-w-5xl mx-auto">
          {/* Page chrome — this is what makes it feel like our page rather than
              a third-party widget dropped onto a blank background. */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-dark-900 transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-dark-900">
                Account settings
              </h1>
              <p className="mt-1.5 text-sm text-dark-500">
                Your profile, password, connected logins and active devices.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-dark-800/10 text-dark-700 font-bold text-sm hover:bg-white/70 transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" /> My calculators
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-dark-800/10 shadow-sm overflow-hidden">
            <UserProfile
              routing="hash"
              appearance={clerkAppearance as any}
            />
          </div>

          <p className="mt-6 text-center text-[11px] text-dark-400">
            Account security is handled by Clerk. We never see or store your password.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
