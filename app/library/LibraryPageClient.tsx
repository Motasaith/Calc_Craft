'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Calculator as CalcIcon,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { serializeConfig } from '@/lib/url-serializer'
import { useAuth } from '@/components/providers/AuthContext'

interface LibraryCalculator {
  id: string
  title: string
  slug: string
  config: unknown
  isPublic: boolean
  isApproved: boolean
  createdAt: Date
}

export default function LibraryPageClient() {
  const { user, isLoading } = useAuth()
  const [calculators, setCalculators] = useState<LibraryCalculator[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    // For now, load saved calculators from local storage if logged in
    if (user) {
      const saved = localStorage.getItem('my_calculators')
      if (saved) {
        try {
          setCalculators(JSON.parse(saved))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [user])

  if (isLoading) return <div className="min-h-screen bg-dark-900" />

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-2xl font-bold text-white mb-3">
            Sign in to view your library
          </h1>
          <p className="text-sm text-dark-300 mb-6">
            Save calculators from the builder and access them here anytime.
          </p>
          <Link
            href="/login" // Need to create a new login page
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  function copyShareLink(calc: LibraryCalculator) {
    const configStr = serializeConfig(calc.config as any)
    const url = `${window.location.origin}/calculators/custom#${configStr}`
    navigator.clipboard.writeText(url)
    setCopiedId(calc.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white mb-1">
              My Library
            </h1>
            <p className="text-sm text-dark-300">
              {calculators.length} saved calculator
              {calculators.length !== 1 ? 's' : ''}.
            </p>
          </div>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
          >
            <CalcIcon className="w-4 h-4" />
            Open Builder
          </Link>
        </div>

        {calculators.length === 0 ? (
          <div className="glass-dark rounded-xl border border-dark-700 p-12 text-center">
            <CalcIcon className="w-10 h-10 text-dark-500 mx-auto mb-4" />
            <p className="text-dark-300 mb-4">
              No saved calculators yet. Build one and click &ldquo;Save to my
              library&rdquo;.
            </p>
            <Link
               href="/builder"
               className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-colors"
            >
               Start building
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {calculators.map((calc) => (
              <div
                key={calc.id}
                className="glass-dark rounded-xl border border-dark-700 p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">
                    {calc.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyShareLink(calc)}
                    className="p-2 rounded-lg text-dark-300 hover:bg-dark-600 hover:text-white transition-colors"
                    title="Copy share link"
                  >
                    {copiedId === calc.id ? (
                      <span className="text-xs text-emerald-400">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`/calculators/custom#${serializeConfig(
                      calc.config as any,
                    )}`}
                    target="_blank"
                    className="p-2 rounded-lg text-dark-300 hover:bg-dark-600 hover:text-white transition-colors"
                    title="Open calculator"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}