'use client'

/**
 * HeroSearch — a calculator + blog search bar for the hero section.
 *
 * - Fetches /site-index.json (generated at build time, always up to date).
 * - Filters calculators (by name, keywords, category) and blog posts (by
 *   title/excerpt) as the user types.
 * - Shows a dropdown of results with absolute links (target=_blank via
 *   Link is single-page nav, but we render <a> with target=_blank for
 *   external new-tab behaviour per the user's requirement).
 * - Keyboard accessible (arrow keys, Enter, Escape).
 * - Responsive: full-width on mobile, max-w-2xl centered on desktop.
 * - Empty-state suggestions: top categories as quick chips.
 *
 * Designed to slot in BELOW the CTAs in the hero — non-invasive.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Search, ArrowRight, FileText, Calculator as CalcIcon, Hash } from 'lucide-react'

interface IndexCalculator {
  slug: string
  name: string
  category: string
  categoryLabel: string
  description: string
  keywords: string[]
  url: string
}
interface IndexPost {
  slug: string
  title: string
  excerpt: string
  url: string
}
interface IndexCategory {
  slug: string
  label: string
  count: number
}
interface SiteIndex {
  calculators: IndexCalculator[]
  posts: IndexPost[]
  categories: IndexCategory[]
}

type Result =
  | { kind: 'calc'; name: string; sub: string; url: string }
  | { kind: 'post'; name: string; sub: string; url: string }
  | { kind: 'category'; name: string; sub: string; url: string }

const MAX_RESULTS = 8

export default function HeroSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [index, setIndex] = useState<SiteIndex | null>(null)
  const [loadError, setLoadError] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Lazy-load the site index once on first focus.
  const loadIndex = useCallback(async () => {
    if (index || loadError) return
    try {
      const res = await fetch('/site-index.json', { cache: 'force-cache' })
      if (!res.ok) throw new Error(`status ${res.status}`)
      const data = (await res.json()) as SiteIndex
      setIndex(data)
    } catch {
      setLoadError(true)
    }
  }, [index, loadError])

  // Close dropdown on outside click.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q || !index) return []
    const out: Result[] = []

    // Categories (cheap, shown first when short match)
    for (const c of index.categories) {
      if (c.label.toLowerCase().includes(q) || c.slug.includes(q)) {
        out.push({
          kind: 'category',
          name: c.label,
          sub: `${c.count} calculators`,
          url: `/calculators?category=${c.slug}`,
        })
      }
      if (out.length >= MAX_RESULTS) return out
    }

    // Calculators — score by name match > keyword match > description match
    const calcs = index.calculators
    const scored: { c: IndexCalculator; s: number }[] = []
    for (const c of index.calculators) {
      const name = c.name.toLowerCase()
      const cat = c.categoryLabel.toLowerCase()
      const kws = c.keywords || []
      const desc = c.description.toLowerCase()
      let s = 0
      if (name === q) s = 100
      else if (name.startsWith(q)) s = 80
      else if (name.includes(q)) s = 60
      else if (cat.includes(q)) s = 40
      else if (kws.some((k) => k.toLowerCase().includes(q))) s = 30
      else if (desc.includes(q)) s = 10
      if (s > 0) scored.push({ c, s })
    }
    scored.sort((a, b) => b.s - a.s)
    for (const { c } of scored) {
      out.push({
        kind: 'calc',
        name: c.name,
        sub: c.categoryLabel,
        url: `/calculators/${c.slug}`,
      })
      if (out.length >= MAX_RESULTS) return out
    }

    // Blog posts
    for (const p of index.posts) {
      const title = p.title.toLowerCase()
      const excerpt = p.excerpt.toLowerCase()
      if (title.includes(q) || excerpt.includes(q)) {
        out.push({ kind: 'post', name: p.title || 'Untitled post', sub: 'Blog', url: `/blog/${p.slug}` })
      }
      if (out.length >= MAX_RESULTS) return out
    }

    return out
  }, [query, index])

  // Reset active index whenever results change.
  useEffect(() => {
    setActiveIdx(results.length > 0 ? 0 : -1)
  }, [results])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
      setOpen(true)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && results[activeIdx]) {
        const r = results[activeIdx]
        window.open(r.url, '_blank', 'noopener,noreferrer')
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const topCategories = useMemo(
    () => (index?.categories ?? []).slice(0, 6),
    [index]
  )

  return (
    <div ref={wrapRef} className="relative w-full max-w-2xl mx-auto mt-10">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            loadIndex()
          }}
          onFocus={() => {
            setOpen(true)
            loadIndex()
          }}
          onKeyDown={onKeyDown}
          placeholder="Search 500+ calculators and articles…"
          aria-label="Search calculators and blog articles"
          aria-expanded={open}
          aria-controls="hero-search-results"
          aria-autocomplete="list"
          role="combobox"
          className="w-full pl-12 pr-12 py-4 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-800 placeholder-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && query.trim() && (
        <div
          id="hero-search-results"
          role="listbox"
          className="absolute z-30 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[60vh] overflow-y-auto"
        >
          {loadError && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Search index unavailable. Try the{' '}
              <Link href="/calculators" className="text-primary-600 underline">calculator library</Link>.
            </div>
          )}
          {!loadError && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No results for “{query}”. Try a different keyword.
            </div>
          )}
          {results.map((r, i) => (
            <a
              key={`${r.kind}-${r.url}-${i}`}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              role="option"
              aria-selected={i === activeIdx}
              onMouseEnter={() => setActiveIdx(i)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                i === activeIdx ? 'bg-primary-50' : 'hover:bg-gray-50'
              }`}
            >
              <ResultIcon kind={r.kind} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark-900 truncate">{r.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{r.sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
            </a>
          ))}
        </div>
      )}

      {/* Empty-state quick category chips */}
      {!query && topCategories.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {topCategories.map((c) => (
            <a
              key={c.slug}
              href={`/calculators?category=${c.slug}`}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white/70 backdrop-blur border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
            >
              {c.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function ResultIcon({ kind }: { kind: Result['kind'] }) {
  const cls = 'w-7 h-7 rounded-lg flex items-center justify-center shrink-0'
  if (kind === 'calc') return <span className={`${cls} bg-primary-100 text-primary-700`}><CalcIcon className="w-4 h-4" /></span>
  if (kind === 'post') return <span className={`${cls} bg-blue-100 text-blue-700`}><FileText className="w-4 h-4" /></span>
  return <span className={`${cls} bg-amber-100 text-amber-700`}><Hash className="w-4 h-4" /></span>
}