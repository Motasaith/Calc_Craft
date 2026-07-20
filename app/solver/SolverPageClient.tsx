'use client'

/**
 * SolverPageClient — AI Math Solver.
 *
 * Users can TYPE a math question or UPLOAD/PHOTO a math problem. The vision
 * model (gemma4:31b) reads the image; the chat model (gpt-oss:120b) handles
 * text. The result is shown as:
 *   - A big "Answer" card (the final concise answer)
 *   - A "Step-by-step explanation" sidebar (markdown, detailed)
 *   - A "AI can make mistakes — double-check it" disclaimer
 *
 * Talks to the Cloudflare Pages Function at /api/solve, which holds the
 * Ollama API key server-side (never shipped to the browser).
 *
 * Uploaded images are stored ONLY in the user's browser (in-memory state +
 * localStorage so the user can see their last upload across reloads). They
 * are NOT uploaded anywhere except to our own /api/solve endpoint for the
 * one-time solve. The vision model sees them via the base64 data URL sent
 * in that request.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Send, Sparkles, Calculator, AlertTriangle, ClipboardCopy, Check, Eraser } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface SolveResult {
  answer: string
  steps: string
  model: string
}

const IMAGE_STORAGE_KEY = 'hoc-solver-image-v1'
const TEXT_STORAGE_KEY = 'hoc-solver-text-v1'

export default function SolverPageClient() {
  const [question, setQuestion] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SolveResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const isMounted = useRef(false)

  // Restore last-used image + text from localStorage (user's own cookies).
  useEffect(() => {
    isMounted.current = true
    try {
      const savedImg = localStorage.getItem(IMAGE_STORAGE_KEY)
      const savedText = localStorage.getItem(TEXT_STORAGE_KEY)
      if (savedImg) setImageDataUrl(savedImg)
      if (savedText) setQuestion(savedText)
    } catch {}
    return () => {
      isMounted.current = false
    }
  }, [])

  // Persist text input.
  useEffect(() => {
    try {
      if (question) localStorage.setItem(TEXT_STORAGE_KEY, question)
      else localStorage.removeItem(TEXT_STORAGE_KEY)
    } catch {}
  }, [question])

  // Persist uploaded image (user's own browser only).
  useEffect(() => {
    try {
      if (imageDataUrl) {
        // Only store if reasonably small (<1.5MB base64) to avoid quota issues.
        if (imageDataUrl.length < 1_500_000) localStorage.setItem(IMAGE_STORAGE_KEY, imageDataUrl)
      } else {
        localStorage.removeItem(IMAGE_STORAGE_KEY)
      }
    } catch {}
  }, [imageDataUrl])

  const onFileChosen = useCallback((file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, or WebP).')
      return
    }
    if (file.size > 4_000_000) {
      setError('Image is too large. Please use an image under 4 MB.')
      return
    }
    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setImageDataUrl(url)
    }
    reader.onerror = () => setError('Could not read that image. Please try another.')
    reader.readAsDataURL(file)
  }, [])

  const removeImage = () => {
    setImageDataUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const solve = async () => {
    if (!question.trim() && !imageDataUrl) {
      setError('Type a question or upload an image first.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          image: imageDataUrl || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || `Solver failed (${res.status}).`)
      }
      setResult({
        answer: data.answer || 'No answer returned.',
        steps: data.steps || '',
        model: data.model || '',
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach the solver service.')
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setQuestion('')
    removeImage()
    setResult(null)
    setError(null)
  }

  const copyAnswer = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.answer)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white">
        {/* ── Hero ── */}
        <section className="relative pt-28 pb-10 sm:pt-32 sm:pb-12 overflow-hidden">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-primary-100/40 blur-3xl rounded-full" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-primary-200 text-[11px] font-bold font-mono uppercase tracking-wider mb-5 text-primary-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> AI Math Solver
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-dark-900 mb-4 leading-[1.05]">
              Snap a photo. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Get the answer.</span>
            </h1>
            <p className="text-base sm:text-lg text-dark-500 max-w-2xl mx-auto leading-relaxed">
              Upload or photograph any math problem and our AI vision solver returns the answer plus a clear,
              step-by-step explanation in the sidebar. Works for algebra, calculus, arithmetic, and word problems.
            </p>
          </div>
        </section>

        {/* ── Solver ── */}
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
              {/* Input card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <h2 className="text-lg font-bold text-dark-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary-600" /> Your question
                </h2>

                {/* Text input */}
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  placeholder="Type your math question, e.g. solve 2x² + 5x - 3 = 0, or: a car travels 240 km in 4 hours, what is its speed?"
                  aria-label="Type your math question"
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-y"
                />

                <div className="flex items-center my-3 gap-3 text-[11px] text-gray-400 uppercase tracking-wider">
                  <span className="flex-1 h-px bg-gray-200" /> or use an image <span className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Image upload */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 text-sm font-semibold hover:bg-primary-100 transition-colors"
                  >
                    <Camera className="w-4 h-4" /> Take photo
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Upload image
                  </button>
                  {/* hidden inputs — accept any image type; capture env on camera input for mobile rear camera */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onFileChosen(e.target.files?.[0])}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => onFileChosen(e.target.files?.[0])}
                  />
                </div>

                {/* Preview */}
                <AnimatePresence>
                  {imageDataUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="relative mt-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageDataUrl} alt="Your uploaded math problem" className="w-full max-h-64 object-contain bg-white" />
                      <button
                        onClick={removeImage}
                        aria-label="Remove image"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={solve}
                    disabled={loading || (!question.trim() && !imageDataUrl)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 disabled:opacity-40 transition-colors shadow-sm"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Solving…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Solve it
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <Eraser className="w-4 h-4" /> Clear
                  </button>
                </div>
              </div>

              {/* Result card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col">
                <h2 className="text-lg font-bold text-dark-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-600" /> Solution
                </h2>

                {!result && !loading && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 text-gray-400">
                    <Calculator className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-sm max-w-[260px]">
                      Your answer and a step-by-step explanation will appear here.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3 text-gray-500">
                    <span className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-sm">The AI is thinking…</p>
                  </div>
                )}

                <AnimatePresence>
                  {result && !loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex-1 flex flex-col gap-4"
                    >
                      {/* Answer card */}
                      <div className="rounded-xl bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-200 p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-primary-700">Answer</span>
                          <button
                            onClick={copyAnswer}
                            className="text-[11px] inline-flex items-center gap-1 text-primary-700 hover:text-primary-900"
                            aria-label="Copy answer"
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <p className="text-xl sm:text-2xl font-extrabold text-dark-900 break-words whitespace-pre-wrap">
                          {result.answer}
                        </p>
                      </div>

                      {/* Steps */}
                      <div className="flex-1 rounded-xl bg-gray-50 border border-gray-200 p-4 overflow-y-auto max-h-[420px]">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
                          Step-by-step explanation
                        </p>
                        <div
                          className="prose-solver text-sm text-dark-800 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(result.steps) }}
                        />
                      </div>

                      {/* Disclaimer */}
                      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>
                          AI can make mistakes. Double-check important results, especially for school, financial,
                          or scientific work.
                        </span>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Examples */}
            <div className="mt-10">
              <h3 className="text-sm font-bold text-dark-700 mb-3 uppercase tracking-wider">Try an example</h3>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setQuestion(ex)
                      setResult(null)
                      setError(null)
                    }}
                    className="text-[12px] px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

const EXAMPLES = [
  'Solve 2x² + 5x - 3 = 0',
  'Differentiate x³ + 2x² - 5x + 1',
  'A car travels 240 km in 4 hours. What is its average speed?',
  'Simplify (3x + 2)(x - 5)',
  'What is 15% of 480?',
  'Find the area of a circle with radius 7 cm',
]

/** Small markdown renderer for the steps panel. */
function renderMarkdown(md: string): string {
  const esc = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  let s = esc
  // Markdown links
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-700 underline">$1</a>')
  // Headings (## and ###)
  s = s.replace(/^##\s+(.+)$/gm, '<h4 class="font-bold text-dark-900 mt-3 mb-1">$1</h4>')
  s = s.replace(/^###\s+(.+)$/gm, '<h5 class="font-semibold text-dark-800 mt-2 mb-1">$1</h5>')
  // Bold + italic
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
  // Inline code
  s = s.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-200/60 rounded text-[0.85em] font-mono">$1</code>')
  // Numbered list items (1. ...)
  s = s.replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 my-1"><span class="font-bold text-primary-700">$1.</span><span>$2</span></div>')
  // Bullet items (- or *)
  s = s.replace(/^[-*]\s+(.+)$/gm, '<div class="flex gap-2 my-1"><span class="text-primary-600">•</span><span>$1</span></div>')
  // Line breaks
  s = s.replace(/\n/g, '<br/>')
  return s
}