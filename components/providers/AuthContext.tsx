'use client'

/**
 * AuthContext — a thin, app-shaped wrapper over Clerk.
 *
 * REPLACES the previous WordPress implementation, which posted credentials to
 * custom `/wp-json/wp/v2/users/login` endpoints and kept a token in
 * localStorage. Clerk is now the sole source of identity; WordPress is gone.
 *
 * Why wrap Clerk at all rather than calling useUser()/useAuth() everywhere:
 *   - The rest of the app already consumes `useAuth()` with a `user` object and
 *     an `isLoading` flag. Keeping that shape means the migration did not have
 *     to touch every component.
 *   - `authedFetch` is the one correct way to call our API: it attaches a fresh
 *     Clerk session token on every request. Session tokens are short-lived
 *     (~60s) and refreshed by the SDK, so they must never be cached — having a
 *     single helper stops that mistake being made per call site.
 *   - `isAdmin` is a UI convenience only. It gates what is *shown*. Every admin
 *     API verifies the token signature and the allowlist server-side
 *     (functions/_shared/admin.js) — the client claim is never trusted.
 */

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react'
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/react'

interface User {
  id: string
  email: string
  name: string
  imageUrl?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  /** Fetch wrapper that attaches a fresh Clerk session token. Use for all /api calls. */
  authedFetch: (input: string, init?: RequestInit) => Promise<Response>
  signOut: () => Promise<void>
  /** Sends the visitor to the sign-in page, preserving where they were. */
  promptSignIn: (mode?: 'sign-in' | 'sign-up') => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  authedFetch: async () => new Response(null, { status: 401 }),
  signOut: async () => {},
  promptSignIn: () => {},
})

/**
 * Admin emails, mirrored to the client so the dashboard can hide admin-only UI.
 * Not a security boundary — see the note in the file header.
 */
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

/**
 * Auth context for when Clerk cannot run at all — no publishable key was present
 * at build time.
 *
 * This exists because the previous fallback rendered <AuthProvider> outside
 * <ClerkProvider> while AuthProvider unconditionally calls useUser(). With no
 * Clerk context `isLoaded` never becomes true, so `isLoading` stayed true
 * forever and every gated page (/build-ai, /dashboard) span on a loader with no
 * error and no way out. Hooks cannot be called conditionally, so the two cases
 * have to be separate components.
 *
 * Here the answer is simply "signed out, and finished deciding that" — pages
 * render their signed-out state instead of hanging.
 */
export function AuthUnavailableProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<AuthContextType>(
    () => ({
      user: null,
      isLoading: false,
      isAdmin: false,
      authedFetch: async () =>
        new Response(JSON.stringify({ error: 'Sign-in is not configured on this deployment.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      signOut: async () => {},
      promptSignIn: () => {
        // eslint-disable-next-line no-alert
        alert(
          'Sign-in is temporarily unavailable on this site. Please try again later, or contact support@homeofcalculators.com.'
        )
      },
    }),
    []
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** How long to wait for Clerk before giving up and rendering as signed-out. */
const CLERK_LOAD_TIMEOUT_MS = 12000

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const { getToken } = useClerkAuth()
  const clerk = useClerk()

  // Watchdog. Clerk can fail to initialise for reasons the page cannot detect —
  // a revoked key, an origin the instance does not allow, a blocked network
  // request. `isLoaded` simply stays false in all of them. Without this, the
  // whole app sits on a spinner indefinitely; with it, the visitor gets the
  // signed-out UI, which is at least usable and honest.
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (isLoaded) return
    const timer = setTimeout(() => {
      setTimedOut(true)
      console.error(
        '[auth] Clerk did not finish loading within ' +
          CLERK_LOAD_TIMEOUT_MS / 1000 +
          's. Rendering signed-out. Check that NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set for this ' +
          'deployment and that this domain is an allowed origin on the Clerk instance.'
      )
    }, CLERK_LOAD_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [isLoaded])

  const user = useMemo<User | null>(() => {
    if (!isSignedIn || !clerkUser) return null
    return {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress?.toLowerCase() || '',
      name:
        clerkUser.fullName ||
        clerkUser.username ||
        clerkUser.primaryEmailAddress?.emailAddress ||
        'there',
      imageUrl: clerkUser.imageUrl,
    }
  }, [isSignedIn, clerkUser])

  const isAdmin = useMemo(() => {
    if (!user) return false
    if (ADMIN_EMAILS.includes(user.email)) return true
    return (clerkUser?.publicMetadata as any)?.role === 'admin'
  }, [user, clerkUser])

  const authedFetch = useCallback(
    async (input: string, init: RequestInit = {}) => {
      // Always mint a fresh token — they expire in about a minute.
      const token = await getToken()

      const headers = new Headers(init.headers || {})
      if (token) headers.set('Authorization', `Bearer ${token}`)
      if (init.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
      }

      return fetch(input, { ...init, headers })
    },
    [getToken]
  )

  const signOut = useCallback(async () => {
    await clerk.signOut()
  }, [clerk])

  const promptSignIn = useCallback((mode: 'sign-in' | 'sign-up' = 'sign-in') => {
    if (typeof window === 'undefined') return
    const here = window.location.pathname + window.location.search
    // Send them back where they were once Clerk is done.
    const target = here && here !== '/' ? `?redirect_url=${encodeURIComponent(here)}` : ''
    window.location.href = `/${mode}${target}`
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        // Once the watchdog fires, stop claiming to be loading.
        isLoading: !isLoaded && !timedOut,
        isAdmin,
        authedFetch,
        signOut,
        promptSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
