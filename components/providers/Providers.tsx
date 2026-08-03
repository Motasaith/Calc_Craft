'use client'

/**
 * Client-side provider stack.
 *
 * `app/layout.tsx` is a Server Component, and @clerk/react is a plain React
 * library with no 'use client' directive of its own — rendering ClerkProvider
 * straight from the layout made Next try to evaluate it on the server, which
 * fails with "createContext is not a function". This file is the client
 * boundary that keeps the whole auth stack in the browser where it belongs.
 *
 * Why @clerk/react instead of @clerk/nextjs: the Next.js package ships Server
 * Actions, and `output: 'export'` rejects those outright. See app/layout.tsx.
 */

import React from 'react'
import { ClerkProvider } from '@clerk/react'
import { AuthProvider, AuthUnavailableProvider } from '@/components/providers/AuthContext'
import { UserDataProvider } from '@/components/providers/UserDataContext'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''

export default function Providers({ children }: { children: React.ReactNode }) {
  // NEXT_PUBLIC_* values are inlined at build time, so an empty key here means
  // the variable was missing when the deploy was built — adding it afterwards
  // does nothing until a rebuild.
  //
  // This branch previously rendered <AuthProvider> (which calls Clerk hooks)
  // without a <ClerkProvider> above it. With no Clerk context `isLoaded` never
  // became true, so every gated page span on a loader forever instead of
  // showing its signed-out state. AuthUnavailableProvider serves a static
  // "signed out, done loading" context instead.
  if (!publishableKey) {
    if (typeof window !== 'undefined') {
      console.error(
        '[auth] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY was not set when this build was created. ' +
          'Sign-in is disabled and saved calculators will not load. ' +
          'Set it in Cloudflare Pages → Settings → Variables and redeploy (a rebuild is required).'
      )
    }
    return (
      <AuthUnavailableProvider>
        <UserDataProvider>{children}</UserDataProvider>
      </AuthUnavailableProvider>
    )
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <AuthProvider>
        <UserDataProvider>{children}</UserDataProvider>
      </AuthProvider>
    </ClerkProvider>
  )
}
