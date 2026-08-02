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
import { AuthProvider } from '@/components/providers/AuthContext'
import { UserDataProvider } from '@/components/providers/UserDataContext'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''

export default function Providers({ children }: { children: React.ReactNode }) {
  // Without a key Clerk throws on mount and takes the whole app down. A missing
  // key is a deployment mistake, not a user error — render the app signed-out
  // rather than a white screen, and say so loudly in the console.
  if (!publishableKey) {
    if (typeof window !== 'undefined') {
      console.error(
        '[auth] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. ' +
          'Sign-in is disabled and saved calculators will not load. ' +
          'Set it in the Cloudflare Pages environment variables and redeploy.'
      )
    }
    return (
      <AuthProvider>
        <UserDataProvider>{children}</UserDataProvider>
      </AuthProvider>
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
