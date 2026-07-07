'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowLeft, Wrench, AlertTriangle, Calculator, Code2, Copy, CheckCircle2, X, Bookmark } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCalculatorRenderer, { CustomCalculatorConfig } from '@/components/calculators/shared/CustomCalculatorRenderer'
import { deserializeConfig, serializeConfig } from '@/lib/url-serializer'

export default function CustomCalculatorPageClient() {
  const [config, setConfig] = useState<CustomCalculatorConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    if (config) {
      const saved = localStorage.getItem('my_custom_calculators')
      if (saved) {
        const savedList: CustomCalculatorConfig[] = JSON.parse(saved)
        setIsBookmarked(savedList.some(c => c.id === config.id))
      }
    }
  }, [config])

  const handleBookmark = () => {
    if (!config) return
    const saved = localStorage.getItem('my_custom_calculators')
    let savedList: CustomCalculatorConfig[] = saved ? JSON.parse(saved) : []
    
    if (isBookmarked) {
      savedList = savedList.filter(c => c.id !== config.id)
    } else {
      savedList.push(config)
    }
    
    localStorage.setItem('my_custom_calculators', JSON.stringify(savedList))
    setIsBookmarked(!isBookmarked)
  }

  const handleCopyEmbed = () => {
    if (!config) return
    const embedUrl = `${window.location.origin}/embed#config=${serializeConfig(config as any)}`
    const iframeCode = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0" loading="lazy" sandbox="allow-scripts allow-same-origin" style="border-radius:12px;overflow:hidden;"></iframe>`
    navigator.clipboard.writeText(iframeCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 items-start">
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
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-dark-900">{config.name}</h1>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBookmark}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-sm font-bold shrink-0 shadow-sm ${
                          isBookmarked 
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200' 
                            : 'bg-white text-dark-600 hover:bg-neutral-50 border-neutral-200'
                        }`}
                        title={isBookmarked ? "Remove from Library" : "Save to Library"}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                      </button>
                      <button
                        onClick={() => setShowEmbedModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors text-sm font-bold shrink-0 shadow-sm"
                      >
                        <Code2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Embed</span>
                      </button>
                    </div>
                  </div>
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

      {/* Embed Modal */}
      {showEmbedModal && config && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-200">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center gap-2 text-dark-900 font-bold">
                <Code2 className="w-5 h-5 text-emerald-500" />
                Embed Calculator
              </div>
              <button 
                onClick={() => setShowEmbedModal(false)}
                className="p-1 text-neutral-400 hover:text-dark-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-sm text-dark-500 leading-relaxed">
                Copy and paste the code below into your website's HTML to embed the <strong>{config.name}</strong>. It's completely free and responsive.
              </p>
              
              <div className="relative">
                <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-xl text-xs font-mono overflow-x-auto border border-neutral-800 whitespace-pre-wrap word-break">
                  {`<iframe src="${window.location.origin}/embed#config=${serializeConfig(config as any)}" width="100%" height="500" frameborder="0" loading="lazy" sandbox="allow-scripts allow-same-origin" style="border-radius:12px;overflow:hidden;"></iframe>`}
                </pre>
                <button
                  onClick={handleCopyEmbed}
                  className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
                  title="Copy code"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              {copied && (
                <div className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
