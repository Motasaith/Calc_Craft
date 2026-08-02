'use client'

// Landing point for OAuth redirects (Google / GitHub / LinkedIn). Clerk parses
// the callback parameters here, then forwards to redirectUrlComplete.
//
// 'use client' is required: @clerk/react is a plain React library with no
// directive of its own, so without this Next tries to evaluate it during the
// static export and fails with "createContext is not a function".

import { AuthenticateWithRedirectCallback } from '@clerk/react'

export default function SSOCallback() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center text-dark-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-dark-500">Completing sign in…</p>
      </div>
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      />
    </div>
  )
}
