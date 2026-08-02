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

import React, { createContext, useContext, useCallback, useMemo } from 'react'
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const { getToken } = useClerkAuth()
  const clerk = useClerk()

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
        isLoading: !isLoaded,
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
