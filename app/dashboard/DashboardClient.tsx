'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calculator, Code2, Bookmark, Settings, LogOut,
  ExternalLink, Copy, Trash2, Plus, Search, Sparkles, Eye,
  CheckCircle2, AlertCircle, Clock, TrendingUp, Users
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/providers/AuthContext'
import { useUserData } from '@/components/providers/UserDataContext'
import { calculators, CATEGORY_LABELS, type CalculatorCategory } from '@/lib/calculators'
import { serializeConfig } from '@/lib/url-serializer'

// ─── Types ───
interface SavedCalculator {
  id: string
  name: string
  description: string
  config: any
  createdAt: string
  isPublic: boolean
}

type Tab = 'overview' | 'custom' | 'embeds' | 'saved' | 'settings'

export default function DashboardClient() {
  const { user, logout, isLoading } = useAuth()
  const { 
    customCalculators: customCalcs, 
    savedCalculators: savedCalcs, 
    removeCustomCalculator, 
    removeSavedCalculator,
    isSyncing
  } = useUserData()
  
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [embedSearch, setEmbedSearch] = useState('')
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [customSearch, setCustomSearch] = useState('')

  // ─── Handlers ───
  const handleDeleteCustom = (id: string) => {
    removeCustomCalculator(id)
  }

  const handleCopyEmbed = (slug: string) => {
    const embedUrl = `https://homeofcalculators.com/embed/${slug}`
    const iframeCode = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0" loading="lazy" sandbox="allow-scripts allow-same-origin" style="border-radius:12px;overflow:hidden;"></iframe>`
    navigator.clipboard.writeText(iframeCode)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const handleCopyShareLink = (config: any) => {
    const serialized = serializeConfig(config)
    const shareUrl = `${window.location.origin}/calculators/custom#${serialized}`
    navigator.clipboard.writeText(shareUrl)
  }

  const handleRemoveSaved = (slug: string) => {
    removeSavedCalculator(slug)
  }

  // ─── Filtered data ───
  const filteredEmbedCalcs = useMemo(() => {
    if (!embedSearch.trim()) return calculators
    const q = embedSearch.toLowerCase()
    return calculators.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keywords.some(k => k.includes(q))
    )
  }, [embedSearch])

  const filteredCustomCalcs = useMemo(() => {
    if (!customSearch.trim()) return customCalcs
    const q = customSearch.toLowerCase()
    return customCalcs.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    )
  }, [customCalcs, customSearch])

  const savedCalcObjects = useMemo(() => {
    return savedCalcs.map(slug => calculators.find(c => c.slug === slug)).filter(Boolean)
  }, [savedCalcs])

  // ─── Loading / Not logged in ───
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-neutral-300 border-t-neutral-800 rounded-full" />
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-dark-900 mb-2">Sign in to access your dashboard</h1>
            <p className="text-dark-500 mb-6">
              Manage your custom calculators, embed widgets, and saved tools — all in one place.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" /> Go to Homepage to Sign In
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    )
  }

  // ─── Dashboard tabs config ───
  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'custom', label: 'My Calculators', icon: Calculator, count: customCalcs.length },
    { id: 'embeds', label: 'Embed Widgets', icon: Code2, count: calculators.length },
    { id: 'saved', label: 'Saved Tools', icon: Bookmark, count: savedCalcs.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* ─── Header ─── */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-dark-900 mb-1">
              Welcome back, {user.name || user.username} 👋
            </h1>
            <p className="text-dark-500 text-sm">
              Manage your calculators, embeds, and saved tools.
            </p>
          </div>

          {/* ─── Tab Navigation ─── */}
          <div className="flex gap-1 mb-8 p-1 bg-white border border-neutral-200 rounded-2xl overflow-x-auto shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-dark-900 text-white shadow-md'
                    : 'text-dark-500 hover:bg-neutral-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ─── Tab Content ─── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ═══ OVERVIEW ═══ */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Custom Calculators', value: customCalcs.length, icon: Calculator, color: 'from-blue-500 to-cyan-500' },
                      { label: 'Saved Tools', value: savedCalcs.length, icon: Bookmark, color: 'from-amber-500 to-orange-500' },
                      { label: 'Available to Embed', value: calculators.length, icon: Code2, color: 'from-emerald-500 to-green-500' },
                      { label: 'Categories', value: Object.keys(CATEGORY_LABELS).length, icon: TrendingUp, color: 'from-violet-500 to-purple-500' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-extrabold text-dark-900">{stat.value}</div>
                        <div className="text-xs text-dark-500 font-medium">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/builder" className="group p-6 bg-white border border-neutral-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <Plus className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-dark-900">Build a Calculator</h3>
                      </div>
                      <p className="text-sm text-dark-500">Create a custom calculator with our visual builder. No code needed.</p>
                    </Link>

                    <button onClick={() => setActiveTab('embeds')} className="group p-6 bg-white border border-neutral-200 rounded-2xl hover:border-emerald-300 hover:shadow-md transition-all text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <Code2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-dark-900">Embed a Calculator</h3>
                      </div>
                      <p className="text-sm text-dark-500">Browse {calculators.length} calculators and get embed codes for your website.</p>
                    </button>

                    <Link href="/calculators" className="group p-6 bg-white border border-neutral-200 rounded-2xl hover:border-amber-300 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                          <Search className="w-5 h-5 text-amber-600" />
                        </div>
                        <h3 className="font-bold text-dark-900">Browse All Calculators</h3>
                      </div>
                      <p className="text-sm text-dark-500">Explore our full library of {calculators.length} free calculators.</p>
                    </Link>
                  </div>

                  {/* Recent custom calculators */}
                  {customCalcs.length > 0 && (
                    <div className="p-6 bg-white border border-neutral-200 rounded-2xl">
                      <h3 className="font-bold text-dark-900 mb-4">Recent Custom Calculators</h3>
                      <div className="space-y-2">
                        {customCalcs.slice(0, 3).map((calc) => (
                          <div key={calc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                            <div>
                              <div className="font-bold text-sm text-dark-900">{calc.name}</div>
                              <div className="text-xs text-dark-500">{calc.description || 'No description'}</div>
                            </div>
                            <Link href={`/calculators/custom#${serializeConfig(calc as any)}`} className="text-indigo-600 hover:text-indigo-700">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ CUSTOM CALCULATORS ═══ */}
              {activeTab === 'custom' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={customSearch}
                        onChange={(e) => setCustomSearch(e.target.value)}
                        placeholder="Search your calculators..."
                        className="w-full h-10 pl-10 pr-4 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
                      />
                    </div>
                    <Link href="/builder" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap">
                      <Plus className="w-4 h-4" /> New Calculator
                    </Link>
                  </div>

                  {filteredCustomCalcs.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                        <Calculator className="w-8 h-8 text-neutral-400" />
                      </div>
                      <h3 className="font-bold text-dark-900 mb-1">No custom calculators yet</h3>
                      <p className="text-sm text-dark-500 mb-4">Build your first calculator with our visual builder.</p>
                      <Link href="/builder" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm">
                        <Plus className="w-4 h-4" /> Start Building
                      </Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCustomCalcs.map((calc) => (
                        <div key={calc.id} className="p-5 bg-white border border-neutral-200 rounded-2xl hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-dark-900 text-sm">{calc.name}</h3>
                              <p className="text-xs text-dark-500 mt-0.5 line-clamp-2">{calc.description || 'No description'}</p>
                            </div>
                            <button onClick={() => handleDeleteCustom(calc.id)} className="text-neutral-400 hover:text-red-500 transition-colors ml-2">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
                            <Clock className="w-3 h-3" />
                            {calc.createdAt ? new Date(calc.createdAt).toLocaleDateString() : 'Recently'}
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/calculators/custom#${serializeConfig(calc as any)}`}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 text-dark-700 text-xs font-bold hover:bg-neutral-200 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" /> Open
                            </Link>
                            <button
                              onClick={() => handleCopyShareLink(calc)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 text-dark-700 text-xs font-bold hover:bg-neutral-200 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" /> Share
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ═══ EMBED WIDGETS ═══ */}
              {activeTab === 'embeds' && (
                <div className="space-y-4">
                  {/* Info banner */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-bold text-sm text-dark-900">Embed any calculator on your website</h3>
                        <p className="text-xs text-dark-600 mt-1">
                          Browse all {calculators.length} calculators, click "Get Embed Code" to copy the iframe snippet,
                          and paste it into your website's HTML. Free, no attribution required.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={embedSearch}
                      onChange={(e) => setEmbedSearch(e.target.value)}
                      placeholder="Search calculators to embed..."
                      className="w-full h-10 pl-10 pr-4 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* Calculator grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredEmbedCalcs.slice(0, 60).map((calc) => (
                      <div key={calc.slug} className="p-4 bg-white border border-neutral-200 rounded-xl hover:border-emerald-300 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-dark-900 truncate">{calc.name}</h3>
                            <span className="text-[10px] text-neutral-400 font-mono uppercase">{CATEGORY_LABELS[calc.category]}</span>
                          </div>
                        </div>
                        <p className="text-xs text-dark-500 mb-3 line-clamp-2">{calc.description}</p>
                        <div className="flex gap-2">
                          <Link
                            href={`/calculators/${calc.slug}`}
                            className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-100 text-dark-700 text-xs font-bold hover:bg-neutral-200 transition-colors"
                          >
                            <Eye className="w-3 h-3" /> Preview
                          </Link>
                          <button
                            onClick={() => handleCopyEmbed(calc.slug)}
                            className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              copiedSlug === calc.slug
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            {copiedSlug === calc.slug ? (
                              <><CheckCircle2 className="w-3 h-3" /> Copied!</>
                            ) : (
                              <><Code2 className="w-3 h-3" /> Embed</>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredEmbedCalcs.length > 60 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-dark-500">
                        Showing 60 of {filteredEmbedCalcs.length} calculators. Use search to narrow down.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ SAVED TOOLS ═══ */}
              {activeTab === 'saved' && (
                <div className="space-y-4">
                  {savedCalcObjects.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neutral-100 flex items-center justify-center">
                        <Bookmark className="w-8 h-8 text-neutral-400" />
                      </div>
                      <h3 className="font-bold text-dark-900 mb-1">No saved calculators yet</h3>
                      <p className="text-sm text-dark-500 mb-4">Bookmark calculators to quickly access them here.</p>
                      <Link href="/calculators" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm">
                        <Search className="w-4 h-4" /> Browse Calculators
                      </Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedCalcObjects.map((calc) => calc && (
                        <div key={calc.slug} className="p-5 bg-white border border-neutral-200 rounded-2xl">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-sm text-dark-900">{calc.name}</h3>
                              <span className="text-[10px] text-neutral-400 font-mono uppercase">{CATEGORY_LABELS[calc.category]}</span>
                            </div>
                            <button onClick={() => handleRemoveSaved(calc.slug)} className="text-neutral-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-dark-500 mb-3 line-clamp-2">{calc.description}</p>
                          <Link
                            href={`/calculators/${calc.slug}`}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 text-dark-700 text-xs font-bold hover:bg-neutral-200 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open Calculator
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ═══ SETTINGS ═══ */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-6">
                  {/* Profile */}
                  <div className="p-6 bg-white border border-neutral-200 rounded-2xl">
                    <h3 className="font-bold text-dark-900 mb-4">Profile Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                          {(user.name || user.username).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-dark-900">{user.name || user.username}</div>
                          <div className="text-xs text-dark-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-neutral-50 rounded-xl">
                          <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Username</div>
                          <div className="text-sm font-bold text-dark-900">{user.username}</div>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl">
                          <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">User ID</div>
                          <div className="text-sm font-bold text-dark-900 font-mono">{user.id || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data management */}
                  <div className="p-6 bg-white border border-neutral-200 rounded-2xl">
                    <h3 className="font-bold text-dark-900 mb-4">Data & Privacy</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                        <div>
                          <div className="font-bold text-sm text-dark-900">Custom Calculators</div>
                          <div className="text-xs text-dark-500">
                            {isSyncing ? 'Syncing...' : 'Synced to your account'}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-dark-700">{customCalcs.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                        <div>
                          <div className="font-bold text-sm text-dark-900">Saved Tools</div>
                          <div className="text-xs text-dark-500">
                            {isSyncing ? 'Syncing...' : 'Synced to your account'}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-dark-700">{savedCalcs.length}</span>
                      </div>
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-dark-600">
                            Your data is securely synced to your WordPress account. You can safely access your tools from any device.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sign out */}
                  <div className="p-6 bg-white border border-neutral-200 rounded-2xl">
                    <h3 className="font-bold text-dark-900 mb-4">Account Actions</h3>
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  )
}