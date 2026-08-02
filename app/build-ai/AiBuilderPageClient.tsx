'use client'

/**
 * AiBuilderPageClient — AI Calculator Builder.
 *
 * The user describes a calculator in plain English ("a quote calculator for my
 * roofing business"), optionally adds their business details, and the AI
 * returns a full CustomCalculatorConfig. They preview it live, refine it by
 * chatting ("add a rush fee", "make it dark"), save it to their profile, and
 * copy an <iframe> snippet to drop on their own website.
 *
 * Talks to the Cloudflare Pages Function at /api/build-calculator, which holds
 * the Ollama API key server-side (never shipped to the browser). Everything the
 * model returns passes through normalizeAiConfig() before it is rendered.
 *
 * Sign-in is required — saved calculators and embed links live on the user's
 * profile (WordPress user meta, via UserDataContext).
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Wand2, Send, Loader2, Save, Code2, Copy, Check, RotateCcw,
  Building2, ChevronDown, AlertTriangle, Lock, Upload, X, Lightbulb,
  PencilRuler, ExternalLink, Trash2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/providers/AuthContext'
import { useUserData } from '@/components/providers/UserDataContext'
import CustomCalculatorRenderer, {
  CustomCalculatorConfig,
} from '@/components/calculators/shared/CustomCalculatorRenderer'
import { normalizeAiConfig, describeConfig } from '@/lib/ai-calc-schema'
import { serializeConfig } from '@/lib/url-serializer'

// ─── Business context the user can optionally supply ───────────────────────
interface BusinessContext {
  name: string
  industry: string
  website: string
  audience: string
  currency: string
  units: string
  brandColors: string
  tone: string
  notes: string
}

const EMPTY_BUSINESS: BusinessContext = {
  name: '',
  industry: '',
  website: '',
  audience: '',
  currency: '',
  units: '',
  brandColors: '',
  tone: '',
  notes: '',
}

const PROMPT_KEY = 'hoc-ai-builder-prompt-v1'
const BUSINESS_KEY = 'hoc-ai-builder-business-v1'
const CONFIG_KEY = 'hoc-ai-builder-config-v1'

const EXAMPLES = [
  'A quote calculator for my roofing business — roof area, pitch, material rate, and 10% waste',
  'Shipping cost calculator: weight, distance band, and an express option',
  'Freelance project estimator with hourly rate, hours, and a rush surcharge',
  'Loan repayment calculator showing the monthly payment and total interest',
  'Solar panel savings calculator for UK homeowners',
  'Gym membership ROI calculator — visits per week vs monthly fee',
]

interface BuildResponse {
  notes: string
  suggestions: string[]
  model: string
}

export default function AiBuilderPageClient() {
  const { user, isLoading: authLoading, setAuthModalOpen, setAuthModalTab } = useAuth()
  const { addCustomCalculator, addEmbeddedCalculator } = useUserData()

  // ── Input state ──
  const [prompt, setPrompt] = useState('')
  const [business, setBusiness] = useState<BusinessContext>(EMPTY_BUSINESS)
  const [businessOpen, setBusinessOpen] = useState(false)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)

  // ── Result state ──
  const [config, setConfig] = useState<CustomCalculatorConfig | null>(null)
  const [meta, setMeta] = useState<BuildResponse | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Refinement ──
  const [instruction, setInstruction] = useState('')

  // ── Save / embed ──
  const [saved, setSaved] = useState(false)
  const [embedOpen, setEmbedOpen] = useState(false)
  const [embedWidth, setEmbedWidth] = useState('100%')
  const [embedHeight, setEmbedHeight] = useState('520')
  const [copied, setCopied] = useState<'embed' | 'link' | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  // ── Restore the last session so a reload doesn't lose their work ──
  useEffect(() => {
    try {
      const p = localStorage.getItem(PROMPT_KEY)
      if (p) setPrompt(p)

      const b = localStorage.getItem(BUSINESS_KEY)
      if (b) {
        const parsed = JSON.parse(b)
        setBusiness({ ...EMPTY_BUSINESS, ...parsed })
        if (Object.values(parsed).some(Boolean)) setBusinessOpen(true)
      }

      const c = localStorage.getItem(CONFIG_KEY)
      if (c) {
        const { config: restored } = normalizeAiConfig(JSON.parse(c))
        if (restored) setConfig(restored)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      if (prompt) localStorage.setItem(PROMPT_KEY, prompt)
      else localStorage.removeItem(PROMPT_KEY)
    } catch {}
  }, [prompt])

  useEffect(() => {
    try {
      if (Object.values(business).some(Boolean)) {
        localStorage.setItem(BUSINESS_KEY, JSON.stringify(business))
      } else {
        localStorage.removeItem(BUSINESS_KEY)
      }
    } catch {}
  }, [business])

  useEffect(() => {
    try {
      if (config) localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
      else localStorage.removeItem(CONFIG_KEY)
    } catch {}
  }, [config])

  const setBusinessField = (key: keyof BusinessContext, value: string) =>
    setBusiness((prev) => ({ ...prev, [key]: value }))

  const onFileChosen = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or WebP).')
      return
    }
    if (file.size > 4_000_000) {
      setError('That image is too large. Please use one under 4 MB.')
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onload = () => setImageDataUrl(reader.result as string)
    reader.onerror = () => setError('Could not read that image. Please try another.')
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageDataUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── The one call that does both create and refine ──
  const callBuilder = useCallback(
    async (payload: Record<string, unknown>, existingId?: string) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/build-calculator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))

        if (!res.ok) throw new Error(data?.error || `The builder failed (${res.status}).`)

        const { config: normalized, warnings: warns } = normalizeAiConfig(data.config, { existingId })

        if (!normalized) {
          setError(warns[0] || 'The AI could not build that calculator. Try describing it differently.')
          return false
        }

        setConfig(normalized)
        setWarnings(warns)
        setMeta({
          notes: data.notes || '',
          suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
          model: data.model || '',
        })
        setSaved(false)
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not reach the AI Calculator Builder.')
        return false
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const generate = async () => {
    if (!prompt.trim() && !imageDataUrl) {
      setError('Describe the calculator you want, or upload a picture of one to rebuild.')
      return
    }
    const ok = await callBuilder({
      prompt: prompt.trim(),
      business: Object.values(business).some(Boolean) ? business : undefined,
      image: imageDataUrl || undefined,
    })
    if (ok) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }

  const refine = async (text?: string) => {
    const change = (text ?? instruction).trim()
    if (!change || !config) return
    const ok = await callBuilder(
      {
        instruction: change,
        config,
        prompt: prompt.trim(),
        business: Object.values(business).some(Boolean) ? business : undefined,
      },
      config.id
    )
    if (ok) setInstruction('')
  }

  // ── Save to the user's profile ──
  const handleSave = () => {
    if (!config) return
    if (!user) {
      setAuthModalTab('login')
      setAuthModalOpen(true)
      return
    }
    const toSave: CustomCalculatorConfig = {
      ...config,
      id: config.id || `ai-${Date.now()}`,
      createdAt: config.createdAt || new Date().toISOString(),
      createdWith: 'ai',
      aiPrompt: prompt.trim() || config.aiPrompt,
    }
    addCustomCalculator(toSave)
    setConfig(toSave)
    setSaved(true)
    setEmbedOpen(true)
  }

  const openInVisualBuilder = () => {
    if (!config) return
    try {
      localStorage.setItem('calc_craft_builder_draft', JSON.stringify(config))
      window.location.href = '/builder'
    } catch {
      setError('Could not hand this over to the visual builder. Please save it first.')
    }
  }

  const startOver = () => {
    setConfig(null)
    setMeta(null)
    setWarnings([])
    setError(null)
    setInstruction('')
    setSaved(false)
    setEmbedOpen(false)
    removeImage()
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://homeofcalculators.com'
  const configHash = config ? serializeConfig(config) : ''
  const shareLink = configHash ? `${origin}/calculators/custom#config=${configHash}` : ''
  const embedCode = configHash
    ? `<iframe src="${origin}/embed#config=${configHash}" width="${embedWidth}" height="${embedHeight}" style="border:none;border-radius:16px;overflow:hidden;" loading="lazy" title="${config?.name || 'Calculator'}"></iframe>`
    : ''

  const copy = (text: string, which: 'embed' | 'link') => {
    navigator.clipboard.writeText(text)
    setCopied(which)
    setTimeout(() => setCopied(null), 2000)
    if (which === 'embed' && config && user) {
      addEmbeddedCalculator({
        id: config.id,
        name: config.name,
        isCustom: true,
        embeddedAt: new Date().toISOString(),
      })
    }
  }

  // ── Session still resolving — hold the layout rather than flashing the
  //    sign-in gate at someone who is already logged in. ─────────────────
  if (authLoading) {
    return (
      <>
        <Navbar />
        <main id="main-content" className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
          <Hero />
          <div className="flex justify-center pb-32">
            <span className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── Signed-out gate ────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <Navbar />
        <main id="main-content" className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
          <Hero />
          <section className="pb-24">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-extrabold text-dark-900 mb-2">Sign in to build your calculator</h2>
                <p className="text-sm text-dark-500 leading-relaxed mb-6 max-w-md mx-auto">
                  Your AI-built calculators are saved to your profile so you can come back, edit them, and keep
                  a permanent embed link for your website. It takes a few seconds and it&apos;s free.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => {
                      setAuthModalTab('register')
                      setAuthModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" /> Create a free account
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalTab('login')
                      setAuthModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
                <p className="text-xs text-dark-400 mt-6">
                  Just want to try building one by hand?{' '}
                  <Link href="/builder" className="text-primary-700 font-semibold hover:underline">
                    Use the free visual builder
                  </Link>
                  .
                </p>
              </div>

              <HowItWorks />
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  // ── Main app ───────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
        <Hero />

        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-[1fr_1.05fr] gap-6 items-start">
              {/* ── Describe panel ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <h2 className="text-lg font-bold text-dark-900 mb-1 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary-600" /> Describe your calculator
                </h2>
                <p className="text-xs text-dark-500 mb-4">
                  Plain English is fine. Say what goes in and what should come out.
                </p>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  placeholder="e.g. A quote calculator for my landscaping company. The customer enters lawn size in square metres, picks a service (mowing, turfing, or full redesign) and whether they want monthly maintenance. Show the one-off price and the monthly cost."
                  aria-label="Describe the calculator you want"
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-y"
                />

                {/* Examples */}
                <div className="mt-3">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
                    Or start from an example
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setPrompt(ex)}
                        className="text-[11px] text-left px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
                      >
                        {ex.length > 58 ? `${ex.slice(0, 58)}…` : ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rebuild from an image */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
                    Optional — rebuild an existing one
                  </p>
                  {!imageDataUrl ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <Upload className="w-4 h-4" /> Upload a screenshot or price sheet
                    </button>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageDataUrl} alt="Calculator to rebuild" className="w-full max-h-48 object-contain bg-white" />
                      <button
                        onClick={removeImage}
                        aria-label="Remove image"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFileChosen(e.target.files?.[0])}
                  />
                </div>

                {/* Business context */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setBusinessOpen((o) => !o)}
                    className="w-full flex items-center justify-between gap-2 text-left group"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-dark-800">
                      <Building2 className="w-4 h-4 text-primary-600" />
                      Tell the AI about your business
                      <span className="text-[10px] font-normal text-gray-400 uppercase tracking-wider">Optional</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${businessOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <p className="text-[11px] text-gray-500 mt-1">
                    The more you give it, the more the calculator sounds like yours — your brand, your currency,
                    your real rates.
                  </p>

                  <AnimatePresence initial={false}>
                    {businessOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 grid sm:grid-cols-2 gap-3">
                          <Field label="Business name" value={business.name} onChange={(v) => setBusinessField('name', v)} placeholder="Riverside Roofing" />
                          <Field label="Industry" value={business.industry} onChange={(v) => setBusinessField('industry', v)} placeholder="Roofing contractor" />
                          <Field label="Website" value={business.website} onChange={(v) => setBusinessField('website', v)} placeholder="riversideroofing.com" />
                          <Field label="Who uses it" value={business.audience} onChange={(v) => setBusinessField('audience', v)} placeholder="Homeowners getting a quote" />
                          <Field label="Currency" value={business.currency} onChange={(v) => setBusinessField('currency', v)} placeholder="USD ($)" />
                          <Field label="Units" value={business.units} onChange={(v) => setBusinessField('units', v)} placeholder="Imperial (sq ft)" />
                          <Field label="Brand colours" value={business.brandColors} onChange={(v) => setBusinessField('brandColors', v)} placeholder="#0f766e and #f59e0b" />
                          <Field label="Look and feel" value={business.tone} onChange={(v) => setBusinessField('tone', v)} placeholder="Clean and modern" />
                        </div>
                        <div className="mt-3">
                          <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
                            Your rates, pricing and anything else
                          </label>
                          <textarea
                            value={business.notes}
                            onChange={(e) => setBusinessField('notes', e.target.value)}
                            rows={3}
                            placeholder="Labour is $65/hr. Asphalt shingles $4.50/sq ft, metal $9/sq ft. Always add 10% for waste. Minimum job $850."
                            className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-y"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={generate}
                    disabled={loading || (!prompt.trim() && !imageDataUrl)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 disabled:opacity-40 transition-colors shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Building…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> {config ? 'Rebuild from scratch' : 'Build my calculator'}
                      </>
                    )}
                  </button>
                  {config && (
                    <button
                      onClick={startOver}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Start over
                    </button>
                  )}
                </div>
              </div>

              {/* ── Preview panel ── */}
              <div ref={resultRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col min-h-[420px]">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h2 className="text-lg font-bold text-dark-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary-600" /> Your calculator
                  </h2>
                  {config && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 whitespace-nowrap pt-1.5">
                      {describeConfig(config)}
                    </span>
                  )}
                </div>

                {!config && !loading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 text-gray-400">
                    <PencilRuler className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-sm max-w-[280px]">
                      Describe what you need and the AI will design the fields, write the maths, and style it —
                      ready to embed.
                    </p>
                  </div>
                )}

                {loading && !config && (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <p className="text-sm">Designing your calculator…</p>
                    <p className="text-xs text-gray-400">This usually takes 10–20 seconds.</p>
                  </div>
                )}

                <AnimatePresence>
                  {config && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex-1 flex flex-col gap-4"
                    >
                      {/* Live preview — the exact widget that gets embedded */}
                      <div className={`rounded-xl bg-gray-50 border border-gray-200 p-3 sm:p-4 ${loading ? 'opacity-50' : ''}`}>
                        <CustomCalculatorRenderer config={config} isPreview={false} />
                      </div>

                      {loading && (
                        <p className="text-xs text-primary-700 flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Applying your change…
                        </p>
                      )}

                      {meta?.notes && (
                        <p className="text-xs text-dark-600 bg-primary-50/60 border border-primary-100 rounded-lg px-3 py-2 leading-relaxed">
                          {meta.notes}
                        </p>
                      )}

                      {warnings.length > 0 && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 space-y-1">
                          {warnings.map((w, i) => (
                            <p key={i} className="flex items-start gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                              <span>{w}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Refine */}
                      <div className="pt-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-2">
                          Not quite right? Tell the AI what to change
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !loading) refine()
                            }}
                            placeholder="e.g. add a 15% deposit line and switch it to euros"
                            className="flex-1 min-w-0 text-sm px-3 h-10 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                          />
                          <button
                            onClick={() => refine()}
                            disabled={loading || !instruction.trim()}
                            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-dark-900 text-white text-sm font-bold hover:bg-dark-800 disabled:opacity-40 transition-colors shrink-0"
                          >
                            <Send className="w-4 h-4" /> Apply
                          </button>
                        </div>

                        {meta && meta.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {meta.suggestions.map((s) => (
                              <button
                                key={s}
                                onClick={() => refine(s)}
                                disabled={loading}
                                className="text-[11px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700 disabled:opacity-40 transition-colors"
                              >
                                <Lightbulb className="w-3 h-3" /> {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 disabled:opacity-40 transition-colors shadow-sm"
                        >
                          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                          {saved ? 'Saved to your profile' : 'Save to my profile'}
                        </button>
                        <button
                          onClick={() => setEmbedOpen(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                          <Code2 className="w-4 h-4" /> Embed code
                        </button>
                        <button
                          onClick={openInVisualBuilder}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors"
                          title="Fine-tune this calculator by hand in the visual builder"
                        >
                          <PencilRuler className="w-4 h-4" /> Edit by hand
                        </button>
                      </div>

                      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>
                          AI can get the maths wrong. Check the numbers with a real example before you put this
                          calculator in front of customers.
                        </span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Embed panel */}
            <AnimatePresence>
              {embedOpen && config && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-dark-900 flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary-600" /> Put it on your website
                      </h2>
                      <p className="text-xs text-dark-500 mt-1">
                        Paste this snippet into any HTML page, WordPress block, Shopify section, or Webflow embed.
                      </p>
                    </div>
                    <button
                      onClick={() => setEmbedOpen(false)}
                      aria-label="Close embed panel"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {!saved && (
                    <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                      This snippet works right now, but save the calculator to your profile so you can find it
                      again from your dashboard.
                    </p>
                  )}

                  <div className="grid sm:grid-cols-[auto_auto_1fr] gap-3 items-end mb-3">
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Width
                      </label>
                      <input
                        type="text"
                        value={embedWidth}
                        onChange={(e) => setEmbedWidth(e.target.value)}
                        className="w-28 h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Height (px)
                      </label>
                      <input
                        type="text"
                        value={embedHeight}
                        onChange={(e) => setEmbedHeight(e.target.value)}
                        className="w-28 h-9 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <textarea
                    readOnly
                    value={embedCode}
                    rows={3}
                    onFocus={(e) => e.currentTarget.select()}
                    className="w-full p-3 bg-dark-900 text-emerald-300 font-mono text-[11px] rounded-xl resize-none leading-relaxed"
                  />

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => copy(embedCode, 'embed')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors"
                    >
                      {copied === 'embed' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === 'embed' ? 'Copied' : 'Copy embed code'}
                    </button>
                    <button
                      onClick={() => copy(shareLink, 'link')}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                      {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === 'link' ? 'Copied' : 'Copy share link'}
                    </button>
                    <a
                      href={shareLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> Open live page
                    </a>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> Go to my dashboard
                    </Link>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
                    The calculator is encoded directly in the link, so it keeps working even if you edit it here
                    later — but if you change it, copy the new snippet and replace the old one on your site.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <HowItWorks />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

// ─── Small presentational pieces ───────────────────────────────────────────

function Hero() {
  return (
    <section className="relative pt-28 pb-10 sm:pt-32 sm:pb-12 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-primary-100/40 blur-3xl rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-primary-200 text-[11px] font-bold font-mono uppercase tracking-wider mb-5 text-primary-700 shadow-sm">
          <Wand2 className="w-3.5 h-3.5" /> AI Calculator Builder
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-dark-900 mb-4 leading-[1.05]">
          Describe it. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Embed it.</span>
        </h1>
        <p className="text-base sm:text-lg text-dark-500 max-w-2xl mx-auto leading-relaxed">
          Tell the AI what you need in plain English — a quote tool, a pricing estimator, an ROI calculator —
          and it builds a working, branded calculator you can drop straight onto your own website.
        </p>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: Wand2, title: 'Describe it', body: 'Say what goes in and what should come out. Add your business details and rates so it speaks like you.' },
    { icon: Sparkles, title: 'The AI builds it', body: 'It designs the fields, writes the maths, and styles the widget. Refine it by chatting until it is right.' },
    { icon: Code2, title: 'Embed it', body: 'Save it to your profile and copy one line of HTML onto your site. Works in WordPress, Shopify, Webflow, anywhere.' },
  ]
  return (
    <div className="mt-12 grid sm:grid-cols-3 gap-4">
      {steps.map((s, i) => (
        <div key={s.title} className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
              <s.icon className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Step {i + 1}</span>
          </div>
          <h3 className="text-sm font-bold text-dark-900 mb-1">{s.title}</h3>
          <p className="text-xs text-dark-500 leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      />
    </div>
  )
}
