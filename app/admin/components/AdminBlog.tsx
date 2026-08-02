'use client'

/**
 * Admin → Blog.
 *
 * WordPress stays the CMS for articles, so this panel does not try to be an
 * editor. It reports what is actually published (read live from the WordPress
 * REST API through /api/admin/stats) and hands off to wp-admin for the writing.
 *
 * That split is deliberate: duplicating a block editor here would mean
 * maintaining a second, worse WordPress. Counts and a fast route into the real
 * CMS is the useful part.
 */

import React, { useEffect, useState, useCallback } from 'react'
import {
  FileText, ExternalLink, Plus, RefreshCw, AlertTriangle, PenLine, FolderOpen, Image as ImageIcon,
} from 'lucide-react'
import { fetchAdminStats } from '@/lib/admin-api'
import { useAuth } from '@/components/providers/AuthContext'

/** wp-admin lives on the CMS host, which is the API host minus /wp-json. */
const WP_ADMIN = 'https://cms.homeofcalculators.com/wp-admin'

export default function AdminBlog({ darkMode }: { darkMode: boolean }) {
  const { authedFetch } = useAuth()

  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminStats(authedFetch)
      setStats(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [authedFetch])

  useEffect(() => {
    load()
  }, [load])

  const card = darkMode ? 'border-white/5 bg-[#12121a]' : 'border-gray-200 bg-white'
  const sub = darkMode ? 'text-neutral-500' : 'text-gray-500'

  const wp = stats?.wordpress
  const unreachable = !!wp?.error

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className={`rounded-xl border p-5 ${card}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" /> Blog
            </h3>
            <p className={`text-xs mt-1 ${sub}`}>
              Articles are written and published in WordPress. This panel shows what is live and takes
              you straight to the editor.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`${WP_ADMIN}/post-new.php`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> New post
            </a>
            <a
              href={`${WP_ADMIN}/edit.php`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <PenLine className="w-4 h-4" /> All posts
            </a>
            <a
              href={`${WP_ADMIN}/upload.php`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Media
            </a>
          </div>
        </div>
      </div>

      {/* Counts */}
      <div className={`rounded-xl border p-5 ${card}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Live from WordPress</h4>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        {unreachable && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-500">WordPress is not answering</p>
              <p className={`mt-1 leading-relaxed ${sub}`}>{wp.error}</p>
              <p className={`mt-1 leading-relaxed ${sub}`}>
                Until this is fixed the blog also builds empty — the static export reads posts from the
                same API.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Tile label="Published" value={wp?.posts} darkMode={darkMode} loading={loading} />
          <Tile label="Drafts" value={wp?.drafts} darkMode={darkMode} loading={loading} />
          <Tile label="Categories" value={wp?.categories} darkMode={darkMode} loading={loading} />
          <Tile label="Media items" value={wp?.calculators} darkMode={darkMode} loading={loading} hint="legacy CPT" />
        </div>
      </div>

      {/* Where things live now */}
      <div className={`rounded-xl border p-5 ${card}`}>
        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-3">
          Where content lives
        </h4>
        <div className="space-y-2 text-xs">
          <SplitRow
            icon={FileText}
            what="Blog articles"
            where="WordPress"
            note="Written in wp-admin, pulled into the static build."
            darkMode={darkMode}
          />
          <SplitRow
            icon={FolderOpen}
            what="Catalogue calculators"
            where="Code registry"
            note="lib/calculators.ts — React components, versioned with the site."
            darkMode={darkMode}
          />
          <SplitRow
            icon={ExternalLink}
            what="User-built calculators"
            where="CockroachDB"
            note="user_calculators — per account, with embed links."
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  )
}

function Tile({
  label, value, darkMode, loading, hint,
}: { label: string; value: number | null | undefined; darkMode: boolean; loading: boolean; hint?: string }) {
  return (
    <div className={`rounded-xl p-4 ${darkMode ? 'bg-black/20 border border-white/5' : 'bg-gray-50 border border-gray-200'}`}>
      <div className="text-2xl font-extrabold leading-none">
        {loading ? '…' : value === null || value === undefined ? '—' : value}
      </div>
      <div className={`text-[10px] uppercase tracking-wider mt-2 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
        {label}
      </div>
      {hint && <div className="text-[9px] opacity-40 mt-0.5">{hint}</div>}
    </div>
  )
}

function SplitRow({
  icon: Icon, what, where, note, darkMode,
}: { icon: any; what: string; where: string; note: string; darkMode: boolean }) {
  return (
    <div className={`flex items-start gap-3 py-2 border-b last:border-0 ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
      <Icon className="w-4 h-4 opacity-40 shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold">{what}</span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
            {where}
          </span>
        </div>
        <p className={`mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-gray-500'}`}>{note}</p>
      </div>
    </div>
  )
}
