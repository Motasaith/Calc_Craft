'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import {
  Calculator as CalcIcon,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  ExternalLink,
} from 'lucide-react'
import {
  toggleCalculatorPublic,
  deleteCalculatorFromLibrary,
} from './actions'
import { serializeConfig } from '@/lib/url-serializer'

interface LibraryCalculator {
  id: string
  title: string
  slug: string
  config: unknown
  isPublic: boolean
  isApproved: boolean
  createdAt: Date
}

export default function LibraryPageClient({
  calculators,
}: {
  calculators: LibraryCalculator[]
}) {
  const [pending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        calc.isPublic
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-dark-600 text-dark-300'
                      }`}
                    >
                      {calc.isPublic ? 'Public' : 'Private'}
                    </span>
                    {calc.isApproved && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400">
                        Approved
                      </span>
                    )}
                    <span className="text-xs text-dark-400">
                      {new Date(calc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await toggleCalculatorPublic(calc.id, !calc.isPublic)
                      })
                    }
                    disabled={pending}
                    className="p-2 rounded-lg text-dark-300 hover:bg-dark-600 hover:text-white transition-colors"
                    title={calc.isPublic ? 'Make private' : 'Make public'}
                  >
                    {calc.isPublic ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
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
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await deleteCalculatorFromLibrary(calc.id)
                      })
                    }
                    disabled={pending}
                    className="p-2 rounded-lg text-dark-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}