'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowLeft, Wrench, AlertTriangle, Calculator } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCalculatorRenderer, { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'
import { deserializeConfig } from '@/lib/url-serializer'

export default function CustomCalculatorPage() {
  const [config, setConfig] = useState<CustomCalculatorConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (!hash) {
        setError('No calculator configuration found in URL.')
        setLoading(false)
        return
      }

      // Check if hash has config query parameter
      let configStr = ''
      if (hash.startsWith('#config=')) {
        configStr = hash.replace('#config=', '')
      } else {
        configStr = hash.substring(1) // Fallback to raw hash
      }

      if (!configStr) {
        setError('Empty calculator configuration hash.')
        setLoading(false)
        return
      }

      const decoded = deserializeConfig(configStr)
      if (decoded) {
        setConfig(decoded)
        setError(null)
      } else {
        setError('Failed to parse calculator configuration. The link might be corrupt or incomplete.')
      }
      setLoading(false)
    }

    // Run on initial mount
    handleHashChange()

    // Add event listener for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4 bg-gray-50 flex flex-col justify-between">
        <div className="max-w-6xl mx-auto w-full flex-1">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-dark-400 mb-6 font-mono">
            <Link href="/" className="hover:text-dark-800 transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/calculators" className="hover:text-dark-800 transition-colors">
              CALCULATORS
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <span className="text-dark-700 font-bold uppercase truncate max-w-[160px]">
              {loading ? 'LOADING...' : config ? config.name : 'CUSTOM'}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Main Calculator Screen */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                  <p className="text-xs font-mono text-dark-500 font-bold">Decoding customized layout configuration...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16 px-6 bg-white rounded-3xl border border-red-100 shadow-sm space-y-4 max-w-xl mx-auto">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                  <h2 className="text-lg font-bold text-dark-800">Calculator Load Error</h2>
                  <p className="text-xs text-dark-500 leading-relaxed font-mono max-w-md mx-auto bg-red-50/50 p-3 rounded-lg border border-red-50">
                    {error}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/calculators"
                      className="px-5 py-2.5 text-xs font-mono font-black text-white bg-[#222326] rounded-lg border-t border-[#4a4b4f] shadow-[0_3.5px_0_#0a0b0d] hover:bg-[#2b2c30] hover:translate-y-[0.5px] active:translate-y-[3.5px] active:shadow-[0_0px_0_#0a0b0d] transition-all inline-flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      BACK TO REGISTRY
                    </Link>
                  </div>
                </div>
              ) : config ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CustomCalculatorRenderer config={config} isPreview={false} />
                </motion.div>
              ) : null}
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
              {/* Creator Info Callout */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Calculator Builder
                </span>
                <h3 className="text-sm font-bold text-dark-800">Want to build your own math widget?</h3>
                <p className="text-xs text-dark-500 leading-relaxed">
                  This calculator was visually designed and themed using our custom WordPress-style drag-and-drop builder. You can add input fields, sliders, select boxes, customize brand logos, and configure calculations in seconds.
                </p>
                <div className="pt-1">
                  <Link
                    href="/builder"
                    className="w-full text-center px-4 py-2.5 text-xs font-mono font-black text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm shadow-indigo-600/10"
                  >
                    <Wrench className="w-4 h-4" />
                    CREATE A WIDGET NOW
                  </Link>
                </div>
              </div>

              {/* Security info */}
              <div className="bg-[#eae7df]/40 border border-[#dad6cd]/60 rounded-2xl p-5 font-mono text-[10px] text-neutral-600 leading-normal space-y-2">
                <div className="font-bold text-neutral-800 flex items-center gap-1 uppercase">
                  <Calculator className="w-3.5 h-3.5 text-neutral-700" />
                  Client Security Checked
                </div>
                <p>
                  No mathematical formula evaluates using JavaScript eval() instructions. All expressions are analyzed by our custom safe expression tokenizer for client-side security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
