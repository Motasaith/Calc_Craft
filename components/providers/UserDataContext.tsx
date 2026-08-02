'use client'

/**
 * UserDataContext — a signed-in user's saved, embedded, and self-built
 * calculators, stored in CockroachDB.
 *
 * REPLACES an implementation that kept user-built calculators in localStorage
 * and authenticated the rest with `Authorization: 'Bearer temp-token'` plus an
 * `x-user-id` header. That had three real problems:
 *   1. The token was a placeholder and the user ID came from the client, so the
 *      server could not tell one user from another (see functions/_shared/clerk.js).
 *   2. Custom calculators lived in one browser. Sign in on a phone and they
 *      were gone.
 *   3. Embeds encoded the whole calculator into the iframe URL, so editing one
 *      meant re-pasting the snippet everywhere it was used.
 *
 * Now: every request carries a real, freshly minted Clerk session token via
 * `authedFetch`, and calculators live in `user_calculators` keyed to the
 * verified Clerk user. Embeds are served from /embed/c/<publicId>, which stays
 * valid across edits.
 *
 * localStorage survives in one narrow role: a scratchpad for people who build
 * something before signing in. It is migrated to the database on first sign-in
 * so nobody loses work by trying the builder first.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'

/** A calculator the user built, as stored server-side. */
export interface UserCalculator {
  id: string
  publicId: string
  name: string
  description: string
  config: CustomCalculatorConfig
  createdWith: 'ai' | 'builder'
  aiPrompt?: string | null
  isPublic: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

interface UserDataContextType {
  /** Calculators this user built, in the AI or visual builder. */
  myCalculators: UserCalculator[]
  /** Slugs of catalogue calculators the user bookmarked. */
  savedCalculators: string[]
  /** Slugs/ids the user has taken an embed code for. */
  embeddedCalculators: string[]
  isLoadingData: boolean
  isSyncing: boolean
  error: string | null

  saveCalculator: (
    config: CustomCalculatorConfig,
    opts?: { id?: string; aiPrompt?: string }
  ) => Promise<UserCalculator | null>
  deleteCalculator: (id: string) => Promise<boolean>

  addSavedCalculator: (slug: string) => Promise<void>
  removeSavedCalculator: (slug: string) => Promise<void>
  addEmbeddedCalculator: (slug: string) => Promise<void>

  refresh: () => Promise<void>
}

const noop = async () => {}

const UserDataContext = createContext<UserDataContextType>({
  myCalculators: [],
  savedCalculators: [],
  embeddedCalculators: [],
  isLoadingData: true,
  isSyncing: false,
  error: null,
  saveCalculator: async () => null,
  deleteCalculator: async () => false,
  addSavedCalculator: noop,
  removeSavedCalculator: noop,
  addEmbeddedCalculator: noop,
  refresh: noop,
})

/** Pre-sign-in scratchpad keys. */
const LOCAL_DRAFTS_KEY = 'hoc-local-calculators-v1'
const LOCAL_SAVED_KEY = 'hoc-local-saved-v1'

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key: string, value: unknown) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota or private mode — losing the scratchpad is survivable.
  }
}

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading, authedFetch } = useAuth()

  const [myCalculators, setMyCalculators] = useState<UserCalculator[]>([])
  const [savedCalculators, setSavedCalculators] = useState<string[]>([])
  const [embeddedCalculators, setEmbeddedCalculators] = useState<string[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Guards the one-time draft migration so re-renders can't run it twice.
  const migratedFor = useRef<string | null>(null)

  // ── Load ────────────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    if (!user) {
      setMyCalculators(readLocal<UserCalculator[]>(LOCAL_DRAFTS_KEY, []))
      setSavedCalculators(readLocal<string[]>(LOCAL_SAVED_KEY, []))
      setEmbeddedCalculators([])
      setIsLoadingData(false)
      return
    }

    setIsLoadingData(true)
    setError(null)

    try {
      const [calcRes, dataRes] = await Promise.all([
        authedFetch('/api/user/calculators'),
        authedFetch('/api/user/data'),
      ])

      if (calcRes.ok) {
        const body = await calcRes.json()
        setMyCalculators(Array.isArray(body.calculators) ? body.calculators : [])
      } else {
        const body = await calcRes.json().catch(() => ({}))
        setError(body.error || 'Could not load your calculators.')
      }

      if (dataRes.ok) {
        const body = await dataRes.json()
        setSavedCalculators(Array.isArray(body.saved) ? body.saved : [])
        setEmbeddedCalculators(Array.isArray(body.embedded) ? body.embedded : [])
      }
    } catch {
      setError('Could not reach the server. Your changes are not being saved.')
    } finally {
      setIsLoadingData(false)
    }
  }, [user, authedFetch])

  useEffect(() => {
    if (authLoading) return
    refresh()
  }, [authLoading, refresh])

  // ── Migrate anything built before signing in ────────────────────────────
  useEffect(() => {
    if (!user || migratedFor.current === user.id) return

    const drafts = readLocal<UserCalculator[]>(LOCAL_DRAFTS_KEY, [])
    const localSaved = readLocal<string[]>(LOCAL_SAVED_KEY, [])

    migratedFor.current = user.id
    if (drafts.length === 0 && localSaved.length === 0) return

    ;(async () => {
      setIsSyncing(true)
      try {
        for (const draft of drafts) {
          if (!draft || !draft.config) continue
          await authedFetch('/api/user/calculators', {
            method: 'POST',
            body: JSON.stringify({ config: draft.config, aiPrompt: draft.aiPrompt }),
          })
        }
        for (const slug of localSaved) {
          await authedFetch('/api/user/data', {
            method: 'POST',
            body: JSON.stringify({ type: 'saved', action: 'add', slug }),
          })
        }
        // Only clear once the uploads succeeded — a failure part-way through
        // must not destroy the user's only copy.
        writeLocal(LOCAL_DRAFTS_KEY, [])
        writeLocal(LOCAL_SAVED_KEY, [])
        await refresh()
      } catch {
        // Leave the scratchpad intact and try again on the next sign-in.
      } finally {
        setIsSyncing(false)
      }
    })()
  }, [user, authedFetch, refresh])

  // ── Mutations ───────────────────────────────────────────────────────────

  const saveCalculator = useCallback(
    async (config: CustomCalculatorConfig, opts: { id?: string; aiPrompt?: string } = {}) => {
      if (!user) {
        // Signed out: hold it locally so the work survives until they sign in.
        const local: UserCalculator = {
          id: opts.id && opts.id.startsWith('local-') ? opts.id : `local-${Date.now()}`,
          publicId: '',
          name: config.name,
          description: config.description || '',
          config,
          createdWith: config.createdWith === 'ai' ? 'ai' : 'builder',
          aiPrompt: opts.aiPrompt,
          isPublic: true,
          viewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        const next = [
          local,
          ...readLocal<UserCalculator[]>(LOCAL_DRAFTS_KEY, []).filter((c) => c.id !== local.id),
        ]
        writeLocal(LOCAL_DRAFTS_KEY, next)
        setMyCalculators(next)
        return local
      }

      setIsSyncing(true)
      setError(null)
      try {
        const res = await authedFetch('/api/user/calculators', {
          method: 'POST',
          body: JSON.stringify({
            config,
            // A local- id has no server row behind it; sending it would just 404.
            id: opts.id && !opts.id.startsWith('local-') ? opts.id : undefined,
            aiPrompt: opts.aiPrompt,
          }),
        })
        const body = await res.json().catch(() => ({}))

        if (!res.ok) {
          setError(body.error || 'Could not save that calculator.')
          return null
        }

        const saved: UserCalculator = body.calculator
        setMyCalculators((prev) => [saved, ...prev.filter((c) => c.id !== saved.id)])
        return saved
      } catch {
        setError('Could not reach the server. Please try again.')
        return null
      } finally {
        setIsSyncing(false)
      }
    },
    [user, authedFetch]
  )

  const deleteCalculator = useCallback(
    async (id: string) => {
      if (!user) {
        const next = readLocal<UserCalculator[]>(LOCAL_DRAFTS_KEY, []).filter((c) => c.id !== id)
        writeLocal(LOCAL_DRAFTS_KEY, next)
        setMyCalculators(next)
        return true
      }

      // Optimistic — snapping back on failure reads better than a spinner.
      const previous = myCalculators
      setMyCalculators((prev) => prev.filter((c) => c.id !== id))

      try {
        const res = await authedFetch(`/api/user/calculators?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        })
        if (!res.ok) {
          setMyCalculators(previous)
          const body = await res.json().catch(() => ({}))
          setError(body.error || 'Could not delete that calculator.')
          return false
        }
        return true
      } catch {
        setMyCalculators(previous)
        setError('Could not reach the server. Please try again.')
        return false
      }
    },
    [user, authedFetch, myCalculators]
  )

  /** Shared write path for the two slug lists. */
  const mutateSlug = useCallback(
    async (type: 'saved' | 'embedded', action: 'add' | 'remove', slug: string) => {
      const setList = type === 'saved' ? setSavedCalculators : setEmbeddedCalculators

      setList((prev) =>
        action === 'add'
          ? prev.includes(slug)
            ? prev
            : [slug, ...prev]
          : prev.filter((s) => s !== slug)
      )

      if (!user) {
        if (type === 'saved') {
          const current = readLocal<string[]>(LOCAL_SAVED_KEY, [])
          const next =
            action === 'add'
              ? Array.from(new Set([slug, ...current]))
              : current.filter((s) => s !== slug)
          writeLocal(LOCAL_SAVED_KEY, next)
        }
        return
      }

      try {
        await authedFetch('/api/user/data', {
          method: 'POST',
          body: JSON.stringify({ type, action, slug }),
        })
      } catch {
        setError('Could not reach the server. Please try again.')
      }
    },
    [user, authedFetch]
  )

  const addSavedCalculator = useCallback((slug: string) => mutateSlug('saved', 'add', slug), [mutateSlug])
  const removeSavedCalculator = useCallback((slug: string) => mutateSlug('saved', 'remove', slug), [mutateSlug])
  const addEmbeddedCalculator = useCallback((slug: string) => mutateSlug('embedded', 'add', slug), [mutateSlug])

  return (
    <UserDataContext.Provider
      value={{
        myCalculators,
        savedCalculators,
        embeddedCalculators,
        isLoadingData,
        isSyncing,
        error,
        saveCalculator,
        deleteCalculator,
        addSavedCalculator,
        removeSavedCalculator,
        addEmbeddedCalculator,
        refresh,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export const useUserData = () => useContext(UserDataContext)
