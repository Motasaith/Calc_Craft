'use client'

import React, { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import CustomCalculatorRenderer, { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'
import { deserializeConfig } from '@/lib/url-serializer'

export default function EmbedPageClient() {
  const [config, setConfig] = useState<CustomCalculatorConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Hide scrollbars on body for clean iframe containment
    document.body.style.overflow = 'auto'
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.body.style.backgroundColor = 'transparent'

    const handleHashChange = () => {
      const hash = window.location.hash
      if (!hash) {
        setError('Embed Error: No calculator configuration hash parameter provided.')
        setLoading(false)
        return
      }

      let configStr = ''
      if (hash.startsWith('#config=')) {
        configStr = hash.replace('#config=', '')
      } else {
        configStr = hash.substring(1)
      }

      if (!configStr) {
        setError('Embed Error: Calculator configuration string is empty.')
        setLoading(false)
        return
      }

      const decoded = deserializeConfig(configStr)
      if (decoded) {
        setConfig(decoded)
        setError(null)
      } else {
        setError('Embed Error: Invalid/corrupt calculator configuration string.')
      }
      setLoading(false)
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div className="w-full min-h-screen p-2 flex items-start justify-center bg-transparent">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50/90 rounded-2xl border border-gray-100 max-w-sm w-full mx-auto shadow-sm">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-[10px] font-mono text-dark-500 font-bold uppercase tracking-wider">Decoding Embed Widget...</p>
        </div>
      ) : error ? (
        <div className="p-5 bg-white border border-red-200 rounded-2xl shadow-sm text-center space-y-2 max-w-sm w-full mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
          <h4 className="text-xs font-bold text-dark-800 uppercase tracking-wide">Widget Load Failed</h4>
          <p className="text-[9px] font-mono text-dark-500 leading-normal bg-red-50 p-2 rounded border border-red-100">
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
