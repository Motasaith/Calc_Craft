'use client'

/**
 * EmbedByIdClient — renders a user-built calculator from the database.
 *
 * This is what the short embed URL serves: /embed/c?id=<publicId>. It fetches
 * /api/calculator/<publicId>, which is public and unauthenticated but only
 * returns calculators the owner has left published.
 *
 * The older /embed#config=<base64> route still works and is still used for
 * unsaved calculators, but it has two flaws this one fixes: the URL carries the
 * entire calculator (so a big one produces an enormous snippet), and editing
 * the calculator does nothing for sites that already pasted the old URL.
 *
 * Why a query parameter rather than /embed/c/<id>: `output: 'export'` has to
 * enumerate every dynamic route at build time, and these ids are created by
 * users long afterwards. A single static page reading `?id=` needs no
 * server-side rendering and no rewrite rules — which matters, because this page
 * runs inside other people's websites and must not depend on hosting config.
 */

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import CustomCalculatorRenderer, {
  CustomCalculatorConfig,
} from '@/components/calculators/shared/CustomCalculatorRenderer'
import { normalizeAiConfig } from '@/lib/ai-calc-schema'

export default function EmbedByIdClient() {
  const [config, setConfig] = useState<CustomCalculatorConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Iframe hygiene — no scrollbars, no margin, inherit the host's backdrop.
    document.body.style.overflow = 'auto'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.backgroundColor = 'transparent'

    const publicId = new URLSearchParams(window.location.search).get('id') || ''

    if (!publicId) {
      setError('This embed link is missing a calculator id.')
      setLoading(false)
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch(`/api/calculator/${encodeURIComponent(publicId)}`)
        const body = await res.json().catch(() => ({}))

        if (cancelled) return

        if (!res.ok) {
          setError(body.error || 'That calculator is not available.')
          setLoading(false)
          return
        }

        // The stored config went through validation before it was saved, but it
        // has been round-tripped through the database since — re-normalise so a
        // malformed row degrades to a clear message instead of a broken render.
        const { config: normalized } = normalizeAiConfig(body.config)

        if (!normalized) {
          setError('This calculator could not be loaded.')
        } else {
          setConfig(normalized)
        }
      } catch {
        if (!cancelled) setError('Could not reach the server.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="w-full min-h-screen p-2 flex items-start justify-center bg-transparent">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50/90 rounded-2xl border border-gray-100 max-w-sm w-full mx-auto shadow-sm">
          <div className="w-8 h-8 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-[10px] font-mono text-dark-500 font-bold uppercase tracking-wider">
            Loading calculator…
          </p>
        </div>
      ) : error ? (
        <div className="p-5 bg-white border border-red-200 rounded-2xl shadow-sm text-center space-y-2 max-w-sm w-full mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
          <h4 className="text-xs font-bold text-dark-800 uppercase tracking-wide">Widget unavailable</h4>
          <p className="text-[10px] font-mono text-dark-500 leading-normal bg-red-50 p-2 rounded border border-red-100">
            {error}
          </p>
        </div>
      ) : config ? (
        <div className="w-full max-w-xl mx-auto py-1">
          <CustomCalculatorRenderer config={config} isPreview={false} />
        </div>
      ) : null}
    </div>
  )
}
