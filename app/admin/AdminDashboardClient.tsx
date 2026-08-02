'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, FileText, Calculator, Settings, Shield,
  AlertTriangle, Activity, BarChart3, Search, Plus, Edit3, Trash2,
  Eye, EyeOff, Check, X, ChevronRight, ChevronDown, ExternalLink,
  Rocket, RefreshCw, LogOut, Bell, Moon, Sun, Menu, XCircle,
  BookOpen, Code2, Zap, Globe, Lock, Clock, TrendingUp, Archive,
  Copy, CheckCircle2, AlertCircle, Info, Download, Upload, Filter,
  Sparkles, Tag, Image as ImageIcon, Save, Send, ArrowLeft
} from 'lucide-react'
import { isAdmin, ADMIN_EMAILS } from '@/lib/clerk'
import { calculators, CATEGORY_LABELS, type CalculatorCategory } from '@/lib/calculators'
import { useAuth } from '@/components/providers/AuthContext'

// ─── Types ───────────────────────────────────────────────────────────────────

type AdminTab =
  | 'overview'
  | 'users'
  | 'blog'
  | 'blog-editor'
  | 'calculators'
  | 'calc-creator'
  | 'errors'
  | 'analytics'
  | 'settings'
  | 'audit'

interface SidebarItem {
  id: AdminTab
  label: string
  icon: any
  badge?: number
  section?: string
}

interface BlogPostLocal {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  author: string
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string
  }
  featuredImage: string
}

interface NewCalculator {
  name: string
  slug: string
  shortName: string
  category: CalculatorCategory
  description: string
  keywords: string
  icon: string
  mode: 'form' | 'retro'
  inputs: CalcInput[]
  formula: string
  resultLabel: string
  resultUnit: string
  seoTitle: string
  seoDescription: string
}

interface CalcInput {
  id: string
  name: string
  label: string
  type: 'number' | 'select' | 'radio'
  placeholder: string
  unit: string
  min: string
  max: string
  defaultValue: string
  options: string // comma-separated for selects
  required: boolean
}

interface AuditEntry {
  id: string
  action: string
  target: string
  actor: string
  timestamp: string
  type: 'info' | 'warning' | 'success' | 'error'
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STORAGE_KEY_BLOG = 'admin_blog_posts'
const STORAGE_KEY_CALCS = 'admin_new_calcs'
const STORAGE_KEY_AUDIT = 'admin_audit_log'
const STORAGE_KEY_SETTINGS = 'admin_site_settings'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function addAuditEntry(
  action: string,
  target: string,
  actor: string,
  type: AuditEntry['type'] = 'info'
) {
  const entries: AuditEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]')
  entries.unshift({
    id: generateId(),
    action,
    target,
    actor,
    timestamp: new Date().toISOString(),
    type,
  })
  // Keep last 200 entries
  localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(entries.slice(0, 200)))
}

// ─── Empty state defaults ────────────────────────────────────────────────────

const emptyBlogPost: BlogPostLocal = {
  id: '',
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  status: 'draft',
  createdAt: '',
  updatedAt: '',
  author: '',
  seo: { metaTitle: '', metaDescription: '', keywords: '' },
  featuredImage: '',
}

const emptyCalcInput: CalcInput = {
  id: '',
  name: '',
  label: '',
  type: 'number',
  placeholder: '',
  unit: '',
  min: '',
  max: '',
  defaultValue: '',
  options: '',
  required: true,
}

const emptyCalculator: NewCalculator = {
  name: '',
  slug: '',
  shortName: '',
  category: 'math',
  description: '',
  keywords: '',
  icon: 'Calculator',
  mode: 'form',
  inputs: [],
  formula: '',
  resultLabel: 'Result',
  resultUnit: '',
  seoTitle: '',
  seoDescription: '',
}

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

const ICON_OPTIONS = [
  'Calculator', 'Activity', 'Heart', 'DollarSign', 'Clock', 'Ruler', 'Thermometer',
  'Zap', 'Scale', 'Percent', 'TrendingUp', 'BarChart3', 'Globe', 'Sun', 'Moon',
  'Droplets', 'Flame', 'Wind', 'Mountain', 'Car', 'Home', 'Building', 'Hammer',
  'Wrench', 'Cpu', 'Smartphone', 'Camera', 'Music', 'BookOpen', 'GraduationCap',
  'Beaker', 'Atom', 'Leaf', 'Sprout', 'Utensils', 'Dumbbell', 'Baby', 'Brain',
]

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export default function AdminDashboardClient() {
  const { user, isLoading } = useAuth()

  // ─── State ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  // Blog state
  const [blogPosts, setBlogPosts] = useState<BlogPostLocal[]>([])
  const [editingPost, setEditingPost] = useState<BlogPostLocal | null>(null)
  const [blogSearch, setBlogSearch] = useState('')

  // Calculator state
  const [calcSearch, setCalcSearch] = useState('')
  const [calcCategoryFilter, setCalcCategoryFilter] = useState<string>('all')
  const [newCalc, setNewCalc] = useState<NewCalculator>({ ...emptyCalculator })
  const [calcStep, setCalcStep] = useState(0)
  const [adminCalcs, setAdminCalcs] = useState<NewCalculator[]>([])

  // Audit state
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([])

  // Settings state
  const [settings, setSettings] = useState({
    siteName: 'Home of Calculators',
    siteDescription: '500+ Free Online Calculators',
    siteUrl: 'https://homeofcalculators.com',
    socialTwitter: '',
    socialGithub: '',
    seoDefaultTitle: '',
    seoDefaultDescription: '',
    enableChat: true,
    enableAnalytics: true,
    maintenanceMode: false,
    sentryDsn: '',
  })

  // Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  // Deploy
  const [isDeploying, setIsDeploying] = useState(false)

  // ─── Effects ───────────────────────────────────────────────────────────────

  // Load persisted data
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem(STORAGE_KEY_BLOG)
      if (savedPosts) setBlogPosts(JSON.parse(savedPosts))

      const savedCalcs = localStorage.getItem(STORAGE_KEY_CALCS)
      if (savedCalcs) setAdminCalcs(JSON.parse(savedCalcs))

      const savedAudit = localStorage.getItem(STORAGE_KEY_AUDIT)
      if (savedAudit) setAuditLog(JSON.parse(savedAudit))

      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS)
      if (savedSettings) setSettings({ ...settings, ...JSON.parse(savedSettings) })
    } catch (e) {
      console.error('Failed to load admin data:', e)
    }
  }, [])

  // Persist blog posts
  useEffect(() => {
    if (blogPosts.length > 0) {
      localStorage.setItem(STORAGE_KEY_BLOG, JSON.stringify(blogPosts))
    }
  }, [blogPosts])

  // Persist admin calcs
  useEffect(() => {
    if (adminCalcs.length > 0) {
      localStorage.setItem(STORAGE_KEY_CALCS, JSON.stringify(adminCalcs))
    }
  }, [adminCalcs])

  // ─── Notification helper ───────────────────────────────────────────────────

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }, [])

  // ─── Admin check ───────────────────────────────────────────────────────────

  const userEmail = user?.email || ''
  const userIsAdmin = isAdmin(userEmail)

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400 text-sm">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // ─── Not authenticated ────────────────────────────────────────────────────

  if (!user || !userIsAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a10] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="p-8 bg-[#12121a] border border-red-500/20 rounded-3xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Access Denied</h1>
            <p className="text-neutral-400 text-sm mb-6">
              {!user
                ? 'You need to sign in with an admin account to access this panel.'
                : `The account "${userEmail}" is not authorized for admin access.`}
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Homepage
              </Link>
              {!user && (
                <p className="text-xs text-neutral-500">
                  Sign in from the homepage, then return here.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Sidebar config ────────────────────────────────────────────────────────

  const sidebarItems: SidebarItem[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, section: 'Main' },
    { id: 'users', label: 'Users', icon: Users, section: 'Main' },
    { id: 'blog', label: 'Blog Posts', icon: FileText, badge: blogPosts.length, section: 'Content' },
    { id: 'calculators', label: 'Calculators', icon: Calculator, badge: calculators.length + adminCalcs.length, section: 'Content' },
    { id: 'errors', label: 'Error Logs', icon: AlertTriangle, section: 'Monitoring' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'Monitoring' },
    { id: 'audit', label: 'Audit Log', icon: Activity, badge: auditLog.length, section: 'Monitoring' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'System' },
  ]

  const sections = [...new Set(sidebarItems.map((i) => i.section))]

  // ─── Computed data ─────────────────────────────────────────────────────────

  const filteredBlogPosts = useMemo(() => {
    if (!blogSearch.trim()) return blogPosts
    const q = blogSearch.toLowerCase()
    return blogPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    )
  }, [blogPosts, blogSearch])

  const filteredCalculators = useMemo(() => {
    let result = [...calculators]
    if (calcCategoryFilter !== 'all') {
      result = result.filter((c) => c.category === calcCategoryFilter)
    }
    if (calcSearch.trim()) {
      const q = calcSearch.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(q))
      )
    }
    return result
  }, [calcSearch, calcCategoryFilter])

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {}
    calculators.forEach((c) => {
      stats[c.category] = (stats[c.category] || 0) + 1
    })
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({
        category,
        label: CATEGORY_LABELS[category as CalculatorCategory] || category,
        count,
      }))
  }, [])

  // ─── Blog handlers ─────────────────────────────────────────────────────────

  const handleCreatePost = () => {
    const newPost: BlogPostLocal = {
      ...emptyBlogPost,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: user?.name || user?.username || 'Admin',
    }
    setEditingPost(newPost)
    setActiveTab('blog-editor')
  }

  const handleSavePost = (post: BlogPostLocal) => {
    const updated = { ...post, updatedAt: new Date().toISOString() }
    if (!updated.slug) {
      updated.slug = slugify(updated.title)
    }
    const existingIdx = blogPosts.findIndex((p) => p.id === updated.id)
    if (existingIdx >= 0) {
      const newPosts = [...blogPosts]
      newPosts[existingIdx] = updated
      setBlogPosts(newPosts)
      addAuditEntry('Updated blog post', updated.title, user?.name || 'Admin', 'info')
      showNotification('Blog post updated successfully!')
    } else {
      setBlogPosts([updated, ...blogPosts])
      addAuditEntry('Created blog post', updated.title, user?.name || 'Admin', 'success')
      showNotification('Blog post created successfully!')
    }
    setEditingPost(null)
    setActiveTab('blog')
    // Refresh audit
    setAuditLog(JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]'))
  }

  const handleDeletePost = (id: string) => {
    const post = blogPosts.find((p) => p.id === id)
    if (post && confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      setBlogPosts(blogPosts.filter((p) => p.id !== id))
      addAuditEntry('Deleted blog post', post.title, user?.name || 'Admin', 'warning')
      showNotification('Blog post deleted', 'error')
      setAuditLog(JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]'))
    }
  }

  const handlePublishPost = (id: string) => {
    const idx = blogPosts.findIndex((p) => p.id === id)
    if (idx >= 0) {
      const newPosts = [...blogPosts]
      const newStatus = newPosts[idx].status === 'published' ? 'draft' : 'published'
      newPosts[idx] = { ...newPosts[idx], status: newStatus, updatedAt: new Date().toISOString() }
      setBlogPosts(newPosts)
      addAuditEntry(
        newStatus === 'published' ? 'Published blog post' : 'Unpublished blog post',
        newPosts[idx].title,
        user?.name || 'Admin',
        'success'
      )
      showNotification(newStatus === 'published' ? 'Post published!' : 'Post moved to draft')
      setAuditLog(JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]'))
    }
  }

  // ─── Calculator creator handlers ───────────────────────────────────────────

  const calcSteps = ['Basic Info', 'Input Fields', 'Formula & Output', 'SEO & Preview']

  const handleCalcNameChange = (name: string) => {
    setNewCalc({
      ...newCalc,
      name,
      slug: slugify(name),
      shortName: name.replace(/\s*calculator\s*/i, '').trim(),
      seoTitle: `${name} - Free Online Calculator | Home of Calculators`,
      seoDescription: `Use the ${name} to get instant, accurate results. Free, no signup required.`,
    })
  }

  const handleAddInput = () => {
    setNewCalc({
      ...newCalc,
      inputs: [
        ...newCalc.inputs,
        { ...emptyCalcInput, id: generateId(), name: `input_${newCalc.inputs.length + 1}` },
      ],
    })
  }

  const handleRemoveInput = (id: string) => {
    setNewCalc({ ...newCalc, inputs: newCalc.inputs.filter((i) => i.id !== id) })
  }

  const handleUpdateInput = (id: string, field: keyof CalcInput, value: any) => {
    setNewCalc({
      ...newCalc,
      inputs: newCalc.inputs.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    })
  }

  const handleSaveCalculator = () => {
    if (!newCalc.name || !newCalc.slug || newCalc.inputs.length === 0) {
      showNotification('Please fill in all required fields', 'error')
      return
    }
    const updated = [...adminCalcs, { ...newCalc }]
    setAdminCalcs(updated)
    localStorage.setItem(STORAGE_KEY_CALCS, JSON.stringify(updated))
    addAuditEntry('Created calculator', newCalc.name, user?.name || 'Admin', 'success')
    showNotification(`Calculator "${newCalc.name}" created! Trigger a deploy to make it live.`)
    setNewCalc({ ...emptyCalculator })
    setCalcStep(0)
    setActiveTab('calculators')
    setAuditLog(JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]'))
  }

  // ─── Deploy handler ────────────────────────────────────────────────────────

  const handleDeploy = async () => {
    setIsDeploying(true)
    addAuditEntry('Triggered deployment', 'Site rebuild', user?.name || 'Admin', 'info')
    setAuditLog(JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]'))

    // In production, this would call the Vercel deploy hook
    // For now, simulate with a timeout
    setTimeout(() => {
      setIsDeploying(false)
      showNotification('Deploy triggered! Site will rebuild in ~60 seconds.', 'success')
    }, 2000)
  }

  // ─── Settings handler ──────────────────────────────────────────────────────

  const handleSaveSettings = () => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
    addAuditEntry('Updated site settings', 'Settings', user?.name || 'Admin', 'info')
    showNotification('Settings saved!')
    setAuditLog(JSON.parse(localStorage.getItem(STORAGE_KEY_AUDIT) || '[]'))
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#0a0a10] text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* ─── NOTIFICATION TOAST ─── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-4 left-1/2 z-[100] max-w-md w-full px-4"
          >
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl ${
                notification.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : notification.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}
            >
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5 shrink-0" />}
              {notification.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
              <span className="text-sm font-medium">{notification.message}</span>
              <button onClick={() => setNotification(null)} className="ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-[72px]'
        } ${darkMode ? 'bg-[#0f0f17] border-r border-white/5' : 'bg-white border-r border-gray-200'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
              <div className="text-sm font-extrabold truncate">Admin Panel</div>
              <div className={`text-[10px] font-mono ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                homeofcalculators
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {sections.map((section) => (
            <div key={section}>
              {sidebarOpen && (
                <div className={`px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest ${
                  darkMode ? 'text-neutral-600' : 'text-gray-400'
                }`}>
                  {section}
                </div>
              )}
              <div className="space-y-0.5">
                {sidebarItems
                  .filter((i) => i.section === section)
                  .map((item) => {
                    const isActive = activeTab === item.id ||
                      (item.id === 'blog' && activeTab === 'blog-editor') ||
                      (item.id === 'calculators' && activeTab === 'calc-creator')
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                          isActive
                            ? darkMode
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : darkMode
                            ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? '' : 'opacity-60 group-hover:opacity-100'}`} />
                        {sidebarOpen && (
                          <>
                            <span className="truncate">{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                                isActive
                                  ? 'bg-indigo-500/20 text-indigo-300'
                                  : darkMode
                                  ? 'bg-white/5 text-neutral-500'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    )
                  })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className={`px-3 py-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-white/5 text-neutral-500' : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <Menu className="w-4 h-4" />
            </button>
            {sidebarOpen && (
              <>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-white/5 text-neutral-500' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <Link
                  href="/"
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-white/5 text-neutral-500' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                  title="Back to site"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-[72px]'}`}>

        {/* ─── Header ─── */}
        <header className={`sticky top-0 z-30 h-16 flex items-center justify-between px-6 backdrop-blur-xl border-b ${
          darkMode ? 'bg-[#0a0a10]/80 border-white/5' : 'bg-white/80 border-gray-200'
        }`}>
          <div>
            <h1 className="text-lg font-extrabold capitalize">
              {activeTab === 'blog-editor'
                ? editingPost?.id
                  ? 'Edit Post'
                  : 'New Post'
                : activeTab === 'calc-creator'
                ? 'Create Calculator'
                : sidebarItems.find((i) => i.id === activeTab)?.label || activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Deploy button */}
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isDeploying
                  ? 'bg-orange-500/20 text-orange-300 cursor-wait'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              {isDeploying ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4" />
              )}
              {isDeploying ? 'Deploying...' : 'Deploy'}
            </button>

            {/* Admin avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold">
                {(user?.name || user?.username || 'A').charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="hidden sm:block">
                  <div className="text-xs font-bold">{user?.name || user?.username}</div>
                  <div className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                    Admin
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── Content area ─── */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* OVERVIEW TAB                                                */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Welcome banner */}
                  <div className={`relative overflow-hidden p-6 rounded-2xl ${
                    darkMode
                      ? 'bg-gradient-to-r from-indigo-600/20 via-violet-600/10 to-transparent border border-indigo-500/20'
                      : 'bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200'
                  }`}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                    <h2 className="text-xl font-extrabold mb-1">Welcome back, {user?.name || user?.username} 👋</h2>
                    <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                      Here&apos;s what&apos;s happening on your site today.
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Calculators', value: calculators.length + adminCalcs.length, icon: Calculator, color: 'from-blue-500 to-cyan-500', trend: `+${adminCalcs.length} custom` },
                      { label: 'Blog Posts', value: blogPosts.length, icon: FileText, color: 'from-emerald-500 to-green-500', trend: `${blogPosts.filter((p) => p.status === 'published').length} published` },
                      { label: 'Categories', value: Object.keys(CATEGORY_LABELS).length, icon: Tag, color: 'from-amber-500 to-orange-500', trend: '29 active' },
                      { label: 'Admin Actions', value: auditLog.length, icon: Activity, color: 'from-violet-500 to-purple-500', trend: auditLog.length > 0 ? timeAgo(auditLog[0]?.timestamp) : 'No activity' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-5 rounded-2xl border ${
                          darkMode
                            ? 'bg-[#12121a] border-white/5 hover:border-white/10'
                            : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                        } transition-colors`}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-extrabold">{stat.value}</div>
                        <div className={`text-xs font-medium ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                          {stat.label}
                        </div>
                        <div className={`text-[10px] mt-1 font-mono ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                          {stat.trend}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick actions + recent activity */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Quick actions */}
                    <div className={`p-6 rounded-2xl border ${
                      darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                    }`}>
                      <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" /> Quick Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleCreatePost}
                          className={`p-4 rounded-xl border text-left transition-all group ${
                            darkMode
                              ? 'border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5'
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                          }`}
                        >
                          <FileText className="w-5 h-5 text-indigo-400 mb-2" />
                          <div className="text-xs font-bold">New Blog Post</div>
                          <div className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                            Write & publish
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveTab('calc-creator'); setNewCalc({ ...emptyCalculator }); setCalcStep(0) }}
                          className={`p-4 rounded-xl border text-left transition-all group ${
                            darkMode
                              ? 'border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5'
                              : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                          }`}
                        >
                          <Calculator className="w-5 h-5 text-emerald-400 mb-2" />
                          <div className="text-xs font-bold">New Calculator</div>
                          <div className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                            Build from scratch
                          </div>
                        </button>
                        <button
                          onClick={handleDeploy}
                          disabled={isDeploying}
                          className={`p-4 rounded-xl border text-left transition-all group ${
                            darkMode
                              ? 'border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5'
                              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                          }`}
                        >
                          <Rocket className="w-5 h-5 text-orange-400 mb-2" />
                          <div className="text-xs font-bold">Deploy Site</div>
                          <div className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                            Trigger rebuild
                          </div>
                        </button>
                        <Link
                          href="/"
                          target="_blank"
                          className={`p-4 rounded-xl border text-left transition-all group ${
                            darkMode
                              ? 'border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5'
                              : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                          }`}
                        >
                          <Globe className="w-5 h-5 text-cyan-400 mb-2" />
                          <div className="text-xs font-bold">View Site</div>
                          <div className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                            Open in new tab
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* Recent audit entries */}
                    <div className={`p-6 rounded-2xl border ${
                      darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                    }`}>
                      <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-violet-400" /> Recent Activity
                      </h3>
                      {auditLog.length === 0 ? (
                        <div className={`text-center py-8 ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                          <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">No activity yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[240px] overflow-y-auto">
                          {auditLog.slice(0, 8).map((entry) => (
                            <div
                              key={entry.id}
                              className={`flex items-start gap-3 p-2.5 rounded-lg ${
                                darkMode ? 'bg-white/[0.02]' : 'bg-gray-50'
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                entry.type === 'success' ? 'bg-emerald-400' :
                                entry.type === 'warning' ? 'bg-amber-400' :
                                entry.type === 'error' ? 'bg-red-400' :
                                'bg-blue-400'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{entry.action}</div>
                                <div className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                                  {entry.target} · {timeAgo(entry.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category distribution */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" /> Calculator Distribution by Category
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {categoryStats.map((stat) => (
                        <div
                          key={stat.category}
                          className={`p-3 rounded-xl border ${
                            darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50'
                          }`}
                        >
                          <div className="text-lg font-extrabold">{stat.count}</div>
                          <div className={`text-[10px] font-medium truncate ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* USERS TAB (Clerk)                                          */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border ${
                    darkMode
                      ? 'bg-gradient-to-r from-indigo-600/10 to-transparent border-indigo-500/20'
                      : 'bg-gradient-to-r from-indigo-50 to-white border-indigo-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold mb-1">User Management via Clerk</h2>
                        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                          Manage all your users through the Clerk Dashboard. View registrations, active sessions, 
                          authentication methods, and user profiles.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick user stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Users', value: '—', icon: Users, note: 'View in Clerk Dashboard', color: 'text-indigo-400' },
                      { label: 'Active Today', value: '—', icon: Activity, note: 'Real-time data', color: 'text-emerald-400' },
                      { label: 'New This Week', value: '—', icon: TrendingUp, note: 'Sign-ups', color: 'text-amber-400' },
                      { label: 'Admin Users', value: ADMIN_EMAILS.length, icon: Shield, note: 'Whitelisted', color: 'text-violet-400' },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`p-5 rounded-2xl border ${
                          darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                        }`}
                      >
                        <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                        <div className="text-2xl font-extrabold">{stat.value}</div>
                        <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>{stat.label}</div>
                        <div className={`text-[10px] mt-1 font-mono ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                          {stat.note}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Admin emails */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-violet-400" /> Whitelisted Admin Emails
                    </h3>
                    <div className="space-y-2">
                      {ADMIN_EMAILS.map((email) => (
                        <div
                          key={email}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            darkMode ? 'bg-white/[0.03] border border-white/5' : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-mono">{email}</span>
                          {email === userEmail && (
                            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                              You
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className={`text-[10px] mt-3 ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                      Admin emails are configured via the NEXT_PUBLIC_ADMIN_EMAILS environment variable.
                    </p>
                  </div>

                  {/* Clerk Dashboard links */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <a
                      href="https://dashboard.clerk.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        darkMode
                          ? 'bg-[#12121a] border-white/5 hover:border-indigo-500/30'
                          : 'bg-white border-gray-200 hover:border-indigo-300 shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Clerk Dashboard</div>
                        <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                          Full user management, sessions, webhooks
                        </div>
                      </div>
                    </a>
                    <a
                      href="https://dashboard.clerk.com/last-active?path=user-management"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        darkMode
                          ? 'bg-[#12121a] border-white/5 hover:border-emerald-500/30'
                          : 'bg-white border-gray-200 hover:border-emerald-300 shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">User Management</div>
                        <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                          View, edit, ban, or delete users
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* BLOG MANAGEMENT TAB                                        */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'blog' && (
                <div className="space-y-4">
                  {/* Actions bar */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className={`relative flex-1 max-w-sm`}>
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        value={blogSearch}
                        onChange={(e) => setBlogSearch(e.target.value)}
                        placeholder="Search posts..."
                        className={`w-full h-10 pl-10 pr-4 rounded-xl text-sm border focus:outline-none transition-colors ${
                          darkMode
                            ? 'bg-[#12121a] border-white/10 text-white placeholder:text-neutral-600 focus:border-indigo-500/50'
                            : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400'
                        }`}
                      />
                    </div>
                    <button
                      onClick={handleCreatePost}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> New Post
                    </button>
                  </div>

                  {/* Post list */}
                  {filteredBlogPosts.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl border ${
                      darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200'
                    }`}>
                      <FileText className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-neutral-700' : 'text-gray-300'}`} />
                      <h3 className="font-bold mb-1">No blog posts yet</h3>
                      <p className={`text-sm mb-4 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                        Create your first post to get started.
                      </p>
                      <button
                        onClick={handleCreatePost}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
                      >
                        <Plus className="w-4 h-4" /> Create First Post
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredBlogPosts.map((post) => (
                        <div
                          key={post.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                            darkMode
                              ? 'bg-[#12121a] border-white/5 hover:border-white/10'
                              : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold truncate">{post.title || 'Untitled'}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                post.status === 'published'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {post.status}
                              </span>
                            </div>
                            <div className={`flex items-center gap-3 text-[10px] font-mono ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {timeAgo(post.updatedAt || post.createdAt)}
                              </span>
                              <span>/{post.slug || '—'}</span>
                              <span>{post.author}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => { setEditingPost(post); setActiveTab('blog-editor') }}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-gray-100 text-gray-400'
                              }`}
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePublishPost(post.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-white/5 text-neutral-400' : 'hover:bg-gray-100 text-gray-400'
                              }`}
                              title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                            >
                              {post.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode ? 'hover:bg-red-500/10 text-neutral-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                              }`}
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
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* BLOG EDITOR TAB                                            */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'blog-editor' && (
                <BlogEditorPanel
                  post={editingPost || { ...emptyBlogPost, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), author: user?.name || 'Admin' }}
                  darkMode={darkMode}
                  onSave={handleSavePost}
                  onCancel={() => { setEditingPost(null); setActiveTab('blog') }}
                />
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* CALCULATORS TAB                                            */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'calculators' && (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`relative flex-1 max-w-sm`}>
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`} />
                        <input
                          type="text"
                          value={calcSearch}
                          onChange={(e) => setCalcSearch(e.target.value)}
                          placeholder="Search calculators..."
                          className={`w-full h-10 pl-10 pr-4 rounded-xl text-sm border focus:outline-none ${
                            darkMode
                              ? 'bg-[#12121a] border-white/10 text-white placeholder:text-neutral-600 focus:border-indigo-500/50'
                              : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400'
                          }`}
                        />
                      </div>
                      <select
                        value={calcCategoryFilter}
                        onChange={(e) => setCalcCategoryFilter(e.target.value)}
                        className={`h-10 px-3 rounded-xl text-sm border focus:outline-none ${
                          darkMode
                            ? 'bg-[#12121a] border-white/10 text-white focus:border-indigo-500/50'
                            : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-400'
                        }`}
                      >
                        <option value="all">All Categories</option>
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => { setActiveTab('calc-creator'); setNewCalc({ ...emptyCalculator }); setCalcStep(0) }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> New Calculator
                    </button>
                  </div>

                  {/* Stats */}
                  <div className={`flex items-center gap-4 p-4 rounded-xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200'
                  }`}>
                    <div className="text-sm">
                      <span className="font-bold">{filteredCalculators.length}</span>
                      <span className={`${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}> of {calculators.length} calculators</span>
                    </div>
                    {adminCalcs.length > 0 && (
                      <div className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        + <span className="font-bold">{adminCalcs.length}</span> custom
                      </div>
                    )}
                  </div>

                  {/* Admin-created calculators */}
                  {adminCalcs.length > 0 && (
                    <div className={`p-4 rounded-2xl border ${
                      darkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <h3 className="text-sm font-extrabold mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> Admin-Created Calculators
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {adminCalcs.map((calc, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border ${
                              darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold truncate">{calc.name}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                darkMode ? 'bg-white/5 text-neutral-500' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {calc.category}
                              </span>
                            </div>
                            <div className={`text-[10px] truncate ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                              /{calc.slug} · {calc.inputs.length} inputs
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Existing calculator list */}
                  <div className={`rounded-2xl border overflow-hidden ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <div className={`overflow-x-auto`}>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={`text-left text-[10px] uppercase tracking-wider ${
                            darkMode ? 'text-neutral-500 border-b border-white/5' : 'text-gray-400 border-b border-gray-200'
                          }`}>
                            <th className="px-4 py-3 font-bold">Name</th>
                            <th className="px-4 py-3 font-bold">Slug</th>
                            <th className="px-4 py-3 font-bold">Category</th>
                            <th className="px-4 py-3 font-bold">Mode</th>
                            <th className="px-4 py-3 font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCalculators.slice(0, 50).map((calc) => (
                            <tr
                              key={calc.slug}
                              className={`border-b transition-colors ${
                                darkMode
                                  ? 'border-white/[0.03] hover:bg-white/[0.02]'
                                  : 'border-gray-100 hover:bg-gray-50'
                              }`}
                            >
                              <td className="px-4 py-3 font-bold truncate max-w-[200px]">{calc.name}</td>
                              <td className={`px-4 py-3 font-mono text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                                {calc.slug}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  darkMode ? 'bg-white/5 text-neutral-400' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {CATEGORY_LABELS[calc.category]}
                                </span>
                              </td>
                              <td className={`px-4 py-3 text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                                {calc.mode}
                              </td>
                              <td className="px-4 py-3">
                                <Link
                                  href={`/calculators/${calc.slug}`}
                                  target="_blank"
                                  className={`inline-flex items-center gap-1 text-xs font-bold ${
                                    darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                                  }`}
                                >
                                  <ExternalLink className="w-3 h-3" /> View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredCalculators.length > 50 && (
                      <div className={`px-4 py-3 text-center text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                        Showing 50 of {filteredCalculators.length}. Use search to narrow down.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* CALCULATOR CREATOR TAB                                     */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'calc-creator' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Step indicator */}
                  <div className="flex items-center gap-2">
                    {calcSteps.map((step, i) => (
                      <React.Fragment key={i}>
                        <button
                          onClick={() => setCalcStep(i)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                            i === calcStep
                              ? 'bg-indigo-600 text-white'
                              : i < calcStep
                              ? darkMode
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : darkMode
                              ? 'bg-white/5 text-neutral-500'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {i < calcStep ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                          <span className="hidden sm:inline">{step}</span>
                        </button>
                        {i < calcSteps.length - 1 && (
                          <ChevronRight className={`w-4 h-4 shrink-0 ${darkMode ? 'text-neutral-700' : 'text-gray-300'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Step content */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    {/* Step 0: Basic Info */}
                    {calcStep === 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-extrabold mb-4">Basic Information</h3>
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Calculator Name *
                          </label>
                          <input
                            type="text"
                            value={newCalc.name}
                            onChange={(e) => handleCalcNameChange(e.target.value)}
                            placeholder="e.g. BMI Calculator"
                            className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                              darkMode
                                ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                            }`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                              URL Slug
                            </label>
                            <input
                              type="text"
                              value={newCalc.slug}
                              onChange={(e) => setNewCalc({ ...newCalc, slug: e.target.value })}
                              className={`w-full h-11 px-4 rounded-xl text-sm border font-mono focus:outline-none ${
                                darkMode
                                  ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                              Category *
                            </label>
                            <select
                              value={newCalc.category}
                              onChange={(e) => setNewCalc({ ...newCalc, category: e.target.value as CalculatorCategory })}
                              className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                                darkMode
                                  ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                              }`}
                            >
                              {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Description *
                          </label>
                          <textarea
                            value={newCalc.description}
                            onChange={(e) => setNewCalc({ ...newCalc, description: e.target.value })}
                            rows={3}
                            placeholder="Brief description of what this calculator does..."
                            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none resize-none ${
                              darkMode
                                ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                            }`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                              Icon
                            </label>
                            <select
                              value={newCalc.icon}
                              onChange={(e) => setNewCalc({ ...newCalc, icon: e.target.value })}
                              className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                                darkMode
                                  ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                              }`}
                            >
                              {ICON_OPTIONS.map((icon) => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                              Keywords
                            </label>
                            <input
                              type="text"
                              value={newCalc.keywords}
                              onChange={(e) => setNewCalc({ ...newCalc, keywords: e.target.value })}
                              placeholder="bmi, body mass, weight (comma-separated)"
                              className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                                darkMode
                                  ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Input Fields */}
                    {calcStep === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-extrabold">Input Fields</h3>
                          <button
                            onClick={handleAddInput}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Field
                          </button>
                        </div>

                        {newCalc.inputs.length === 0 ? (
                          <div className={`text-center py-10 rounded-xl border-2 border-dashed ${
                            darkMode ? 'border-white/10 text-neutral-500' : 'border-gray-200 text-gray-400'
                          }`}>
                            <Calculator className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm font-medium">No input fields yet</p>
                            <p className="text-xs mt-1">Add fields that users will fill in (e.g. weight, height)</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {newCalc.inputs.map((input, idx) => (
                              <div
                                key={input.id}
                                className={`p-4 rounded-xl border ${
                                  darkMode ? 'bg-[#0a0a10] border-white/5' : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className={`text-[10px] font-mono ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                                    Field #{idx + 1}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveInput(input.id)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    value={input.label}
                                    onChange={(e) => handleUpdateInput(input.id, 'label', e.target.value)}
                                    placeholder="Label (e.g. Weight)"
                                    className={`h-9 px-3 rounded-lg text-xs border focus:outline-none ${
                                      darkMode ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                  />
                                  <input
                                    type="text"
                                    value={input.name}
                                    onChange={(e) => handleUpdateInput(input.id, 'name', e.target.value)}
                                    placeholder="Variable name (e.g. weight)"
                                    className={`h-9 px-3 rounded-lg text-xs border font-mono focus:outline-none ${
                                      darkMode ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                  />
                                  <select
                                    value={input.type}
                                    onChange={(e) => handleUpdateInput(input.id, 'type', e.target.value)}
                                    className={`h-9 px-3 rounded-lg text-xs border focus:outline-none ${
                                      darkMode ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                  >
                                    <option value="number">Number</option>
                                    <option value="select">Select Dropdown</option>
                                    <option value="radio">Radio Buttons</option>
                                  </select>
                                  <input
                                    type="text"
                                    value={input.unit}
                                    onChange={(e) => handleUpdateInput(input.id, 'unit', e.target.value)}
                                    placeholder="Unit (e.g. kg, cm)"
                                    className={`h-9 px-3 rounded-lg text-xs border focus:outline-none ${
                                      darkMode ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                  />
                                  <input
                                    type="text"
                                    value={input.placeholder}
                                    onChange={(e) => handleUpdateInput(input.id, 'placeholder', e.target.value)}
                                    placeholder="Placeholder text"
                                    className={`h-9 px-3 rounded-lg text-xs border focus:outline-none ${
                                      darkMode ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                  />
                                  <input
                                    type="text"
                                    value={input.defaultValue}
                                    onChange={(e) => handleUpdateInput(input.id, 'defaultValue', e.target.value)}
                                    placeholder="Default value"
                                    className={`h-9 px-3 rounded-lg text-xs border focus:outline-none ${
                                      darkMode ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                  />
                                </div>
                                {input.type !== 'number' && (
                                  <input
                                    type="text"
                                    value={input.options}
                                    onChange={(e) => handleUpdateInput(input.id, 'options', e.target.value)}
                                    placeholder="Options (comma-separated: Male, Female)"
                                    className={`w-full h-9 px-3 mt-3 rounded-lg text-xs border focus:outline-none ${
                                      darkMode ? 'bg-[#12121a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 2: Formula & Output */}
                    {calcStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-extrabold mb-4">Formula & Output</h3>
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Math Formula *
                          </label>
                          <textarea
                            value={newCalc.formula}
                            onChange={(e) => setNewCalc({ ...newCalc, formula: e.target.value })}
                            rows={4}
                            placeholder="e.g. weight / (height * height)&#10;Use variable names from your input fields.&#10;Supports: +, -, *, /, ^, sqrt(), round(), abs()"
                            className={`w-full px-4 py-3 rounded-xl text-sm border font-mono focus:outline-none resize-none ${
                              darkMode
                                ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                            }`}
                          />
                          <p className={`text-[10px] mt-1.5 ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                            Available variables: {newCalc.inputs.map((i) => i.name).filter(Boolean).join(', ') || '(define inputs first)'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                              Result Label
                            </label>
                            <input
                              type="text"
                              value={newCalc.resultLabel}
                              onChange={(e) => setNewCalc({ ...newCalc, resultLabel: e.target.value })}
                              placeholder="e.g. Your BMI"
                              className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                                darkMode
                                  ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                              Result Unit
                            </label>
                            <input
                              type="text"
                              value={newCalc.resultUnit}
                              onChange={(e) => setNewCalc({ ...newCalc, resultUnit: e.target.value })}
                              placeholder="e.g. kg/m²"
                              className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                                darkMode
                                  ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Formula Example */}
                        <div className={`p-4 rounded-xl ${
                          darkMode ? 'bg-indigo-500/5 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'
                        }`}>
                          <h4 className={`text-xs font-bold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                            📐 BMI Calculator Example
                          </h4>
                          <div className={`text-xs font-mono space-y-1 ${darkMode ? 'text-indigo-400/80' : 'text-indigo-600'}`}>
                            <p>Inputs: weight (kg), height (m)</p>
                            <p>Formula: <code className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-white/5' : 'bg-white'}`}>weight / (height * height)</code></p>
                            <p>Result: &quot;Your BMI&quot; · Unit: &quot;kg/m²&quot;</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: SEO & Preview */}
                    {calcStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-extrabold mb-4">SEO & Preview</h3>
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                            SEO Title
                          </label>
                          <input
                            type="text"
                            value={newCalc.seoTitle}
                            onChange={(e) => setNewCalc({ ...newCalc, seoTitle: e.target.value })}
                            className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                              darkMode
                                ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                            SEO Description
                          </label>
                          <textarea
                            value={newCalc.seoDescription}
                            onChange={(e) => setNewCalc({ ...newCalc, seoDescription: e.target.value })}
                            rows={3}
                            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none resize-none ${
                              darkMode
                                ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                            }`}
                          />
                        </div>

                        {/* Preview */}
                        <div className={`p-5 rounded-xl border ${
                          darkMode ? 'border-white/10 bg-[#0a0a10]' : 'border-gray-200 bg-gray-50'
                        }`}>
                          <h4 className="text-xs font-bold mb-3 uppercase tracking-wider opacity-50">Calculator Preview</h4>
                          <div className={`p-5 rounded-xl ${
                            darkMode ? 'bg-[#12121a] border border-white/5' : 'bg-white border border-gray-200 shadow-sm'
                          }`}>
                            <h3 className="text-lg font-extrabold mb-1">{newCalc.name || 'Calculator Name'}</h3>
                            <p className={`text-xs mb-4 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                              {newCalc.description || 'Calculator description will appear here.'}
                            </p>
                            {newCalc.inputs.map((input) => (
                              <div key={input.id} className="mb-3">
                                <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                                  {input.label || 'Field Label'} {input.unit && <span className="font-normal opacity-50">({input.unit})</span>}
                                </label>
                                <input
                                  type="text"
                                  placeholder={input.placeholder || 'Enter value...'}
                                  disabled
                                  className={`w-full h-10 px-3 rounded-lg text-sm border ${
                                    darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                                  }`}
                                />
                              </div>
                            ))}
                            <div className={`mt-4 p-4 rounded-xl text-center ${
                              darkMode ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'
                            }`}>
                              <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                                {newCalc.resultLabel || 'Result'}
                              </div>
                              <div className="text-2xl font-extrabold mt-1">
                                0.00 <span className="text-sm opacity-50">{newCalc.resultUnit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => calcStep > 0 ? setCalcStep(calcStep - 1) : setActiveTab('calculators')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                        darkMode
                          ? 'bg-white/5 text-neutral-400 hover:bg-white/10'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {calcStep > 0 ? 'Previous' : 'Cancel'}
                    </button>

                    {calcStep < calcSteps.length - 1 ? (
                      <button
                        onClick={() => setCalcStep(calcStep + 1)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveCalculator}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4" /> Create Calculator
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* ERROR MONITORING TAB (Sentry)                              */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'errors' && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border ${
                    darkMode
                      ? 'bg-gradient-to-r from-red-600/10 to-transparent border-red-500/20'
                      : 'bg-gradient-to-r from-red-50 to-white border-red-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold mb-1">Error Monitoring via Sentry</h2>
                        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                          Monitor runtime errors, unhandled exceptions, and performance issues across your site.
                          Sentry captures errors automatically once configured.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sentry DSN setup */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-neutral-400" /> Sentry Configuration
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                          Sentry DSN
                        </label>
                        <input
                          type="text"
                          value={settings.sentryDsn}
                          onChange={(e) => setSettings({ ...settings, sentryDsn: e.target.value })}
                          placeholder="https://examplePublicKey@o0.ingest.sentry.io/0"
                          className={`w-full h-11 px-4 rounded-xl text-sm border font-mono focus:outline-none ${
                            darkMode
                              ? 'bg-[#0a0a10] border-white/10 text-white focus:border-indigo-500/50'
                              : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-400'
                          }`}
                        />
                        <p className={`text-[10px] mt-1 ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                          Find this in Sentry → Project Settings → Client Keys (DSN)
                        </p>
                      </div>
                      <button
                        onClick={handleSaveSettings}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                      >
                        <Save className="w-3.5 h-3.5" /> Save DSN
                      </button>
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <a
                      href="https://sentry.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        darkMode
                          ? 'bg-[#12121a] border-white/5 hover:border-red-500/30'
                          : 'bg-white border-gray-200 hover:border-red-300 shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Sentry Dashboard</div>
                        <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                          View errors, performance, and releases
                        </div>
                      </div>
                    </a>
                    <a
                      href="https://sentry.io/organizations/new/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        darkMode
                          ? 'bg-[#12121a] border-white/5 hover:border-amber-500/30'
                          : 'bg-white border-gray-200 hover:border-amber-300 shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Create Sentry Account</div>
                        <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                          Free tier: 5K errors/month
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* How to set up guide */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4">🔧 Quick Setup Guide</h3>
                    <div className={`space-y-3 text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                      <div className="flex gap-3">
                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          darkMode ? 'bg-white/5 text-neutral-500' : 'bg-gray-100 text-gray-500'
                        }`}>1</span>
                        <p>Create a free Sentry account and project (choose &quot;React&quot; as platform)</p>
                      </div>
                      <div className="flex gap-3">
                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          darkMode ? 'bg-white/5 text-neutral-500' : 'bg-gray-100 text-gray-500'
                        }`}>2</span>
                        <p>Copy the DSN from Project Settings → Client Keys</p>
                      </div>
                      <div className="flex gap-3">
                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          darkMode ? 'bg-white/5 text-neutral-500' : 'bg-gray-100 text-gray-500'
                        }`}>3</span>
                        <p>Paste the DSN above and save. Sentry will start capturing errors automatically.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          darkMode ? 'bg-white/5 text-neutral-500' : 'bg-gray-100 text-gray-500'
                        }`}>4</span>
                        <p>Add <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>NEXT_PUBLIC_SENTRY_DSN</code> to your Cloudflare Pages environment variables for production.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* ANALYTICS TAB                                              */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border ${
                    darkMode
                      ? 'bg-gradient-to-r from-blue-600/10 to-transparent border-blue-500/20'
                      : 'bg-gradient-to-r from-blue-50 to-white border-blue-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold mb-1">Analytics & Insights</h2>
                        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                          Track page views, popular calculators, and user engagement across your site.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <a
                      href="https://dash.cloudflare.com/?to=/:account/web-analytics"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        darkMode
                          ? 'bg-[#12121a] border-white/5 hover:border-orange-500/30'
                          : 'bg-white border-gray-200 hover:border-orange-300 shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Cloudflare Analytics</div>
                        <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                          Page views, unique visitors, bandwidth
                        </div>
                      </div>
                    </a>
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        darkMode
                          ? 'bg-[#12121a] border-white/5 hover:border-blue-500/30'
                          : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Google Search Console</div>
                        <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                          Search performance, indexing, clicks
                        </div>
                      </div>
                    </a>
                    <a
                      href="https://analytics.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                        darkMode
                          ? 'bg-[#12121a] border-white/5 hover:border-green-500/30'
                          : 'bg-white border-gray-200 hover:border-green-300 shadow-sm'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">Google Analytics</div>
                        <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                          User behavior, sessions, conversions
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Site overview stats */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4">📊 Site Content Summary</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Pages', value: calculators.length + 10, note: 'Calculators + static pages' },
                        { label: 'Blog Articles', value: blogPosts.length, note: `${blogPosts.filter(p => p.status === 'published').length} published` },
                        { label: 'Categories', value: Object.keys(CATEGORY_LABELS).length, note: 'Calculator categories' },
                        { label: 'Custom Calcs', value: adminCalcs.length, note: 'Admin-created' },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl ${darkMode ? 'bg-white/[0.02] border border-white/5' : 'bg-gray-50 border border-gray-100'}`}
                        >
                          <div className="text-2xl font-extrabold">{stat.value}</div>
                          <div className={`text-xs font-medium ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>{stat.label}</div>
                          <div className={`text-[10px] mt-0.5 ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>{stat.note}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* AUDIT LOG TAB                                              */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold">Audit Log</h2>
                    <span className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                      {auditLog.length} entries
                    </span>
                  </div>

                  {auditLog.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl border ${
                      darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200'
                    }`}>
                      <Activity className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-neutral-700' : 'text-gray-300'}`} />
                      <h3 className="font-bold mb-1">No activity yet</h3>
                      <p className={`text-sm ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                        Admin actions will be logged here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className={`rounded-2xl border overflow-hidden ${
                      darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                    }`}>
                      <div className="divide-y divide-white/[0.03]">
                        {auditLog.map((entry) => (
                          <div
                            key={entry.id}
                            className={`flex items-center gap-4 px-5 py-3.5 ${
                              darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full shrink-0 ${
                              entry.type === 'success' ? 'bg-emerald-400' :
                              entry.type === 'warning' ? 'bg-amber-400' :
                              entry.type === 'error' ? 'bg-red-400' :
                              'bg-blue-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{entry.action}</div>
                              <div className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                                {entry.target}
                              </div>
                            </div>
                            <div className={`text-right shrink-0`}>
                              <div className={`text-xs font-medium ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>
                                {entry.actor}
                              </div>
                              <div className={`text-[10px] font-mono ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                                {timeAgo(entry.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* SETTINGS TAB                                               */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-6">
                  {/* Site settings */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" /> Site Configuration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>Site Name</label>
                        <input
                          type="text"
                          value={settings.siteName}
                          onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                          className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                            darkMode ? 'bg-[#0a0a10] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>Site Description</label>
                        <input
                          type="text"
                          value={settings.siteDescription}
                          onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                          className={`w-full h-11 px-4 rounded-xl text-sm border focus:outline-none ${
                            darkMode ? 'bg-[#0a0a10] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-gray-600'}`}>Site URL</label>
                        <input
                          type="text"
                          value={settings.siteUrl}
                          onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                          className={`w-full h-11 px-4 rounded-xl text-sm border font-mono focus:outline-none ${
                            darkMode ? 'bg-[#0a0a10] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature toggles */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> Feature Toggles
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'enableChat' as const, label: 'AI Chat Widget', desc: 'Show the floating chat assistant' },
                        { key: 'enableAnalytics' as const, label: 'Analytics Tracking', desc: 'Enable page view tracking' },
                        { key: 'maintenanceMode' as const, label: 'Maintenance Mode', desc: 'Show maintenance page to visitors' },
                      ].map((toggle) => (
                        <div
                          key={toggle.key}
                          className={`flex items-center justify-between p-3 rounded-xl ${
                            darkMode ? 'bg-white/[0.02] border border-white/5' : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div>
                            <div className="text-sm font-bold">{toggle.label}</div>
                            <div className={`text-[10px] ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>{toggle.desc}</div>
                          </div>
                          <button
                            onClick={() => setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })}
                            className={`relative w-11 h-6 rounded-full transition-colors ${
                              settings[toggle.key]
                                ? 'bg-emerald-500'
                                : darkMode ? 'bg-white/10' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                              settings[toggle.key] ? 'translate-x-[22px]' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deployment */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-orange-400" /> Deployment
                    </h3>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                      Trigger a site rebuild to publish new blog posts, calculators, and setting changes.
                    </p>
                    <button
                      onClick={handleDeploy}
                      disabled={isDeploying}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                        isDeploying
                          ? 'bg-orange-500/20 text-orange-300 cursor-wait'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                      }`}
                    >
                      {isDeploying ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Deploying...</>
                      ) : (
                        <><Rocket className="w-4 h-4" /> Trigger Deploy</>
                      )}
                    </button>
                  </div>

                  {/* Data export */}
                  <div className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h3 className="text-sm font-extrabold mb-4 flex items-center gap-2">
                      <Archive className="w-4 h-4 text-cyan-400" /> Backup & Export
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const data = {
                            blogPosts,
                            adminCalcs,
                            settings,
                            auditLog,
                            exportedAt: new Date().toISOString(),
                          }
                          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `admin-backup-${new Date().toISOString().slice(0, 10)}.json`
                          a.click()
                          URL.revokeObjectURL(url)
                          showNotification('Backup downloaded!')
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ${
                          darkMode
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
                            : 'bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100'
                        }`}
                      >
                        <Download className="w-4 h-4" /> Export All Data
                      </button>
                    </div>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSaveSettings}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700"
                  >
                    <Save className="w-4 h-4" /> Save All Settings
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// BLOG EDITOR SUBCOMPONENT
// ═════════════════════════════════════════════════════════════════════════════

function BlogEditorPanel({
  post,
  darkMode,
  onSave,
  onCancel,
}: {
  post: BlogPostLocal
  darkMode: boolean
  onSave: (post: BlogPostLocal) => void
  onCancel: () => void
}) {
  const [editPost, setEditPost] = useState<BlogPostLocal>({ ...post })
  const [showSeoPanel, setShowSeoPanel] = useState(false)

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onCancel}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
            darkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Posts
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSeoPanel(!showSeoPanel)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold ${
              showSeoPanel
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : darkMode ? 'text-neutral-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Search className="w-4 h-4" /> SEO
          </button>
          <button
            onClick={() => {
              const updated = { ...editPost, status: 'draft' as const }
              onSave(updated)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
              darkMode
                ? 'bg-white/5 text-neutral-300 hover:bg-white/10'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={() => {
              const updated = { ...editPost, status: 'published' as const }
              onSave(updated)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
          >
            <Send className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      <div className={`grid ${showSeoPanel ? 'lg:grid-cols-[1fr_320px]' : ''} gap-4`}>
        {/* Main editor */}
        <div className={`space-y-4`}>
          {/* Title */}
          <input
            type="text"
            value={editPost.title}
            onChange={(e) => {
              const title = e.target.value
              setEditPost({
                ...editPost,
                title,
                slug: editPost.slug || slugify(title),
                seo: {
                  ...editPost.seo,
                  metaTitle: editPost.seo.metaTitle || `${title} | Home of Calculators Blog`,
                },
              })
            }}
            placeholder="Post title..."
            className={`w-full h-14 px-5 rounded-xl text-xl font-extrabold border focus:outline-none ${
              darkMode
                ? 'bg-[#12121a] border-white/5 text-white placeholder:text-neutral-700 focus:border-indigo-500/30'
                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-indigo-400'
            }`}
          />

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className={`text-xs ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
              /blog/
            </span>
            <input
              type="text"
              value={editPost.slug}
              onChange={(e) => setEditPost({ ...editPost, slug: e.target.value })}
              placeholder="post-slug"
              className={`flex-1 h-8 px-2 rounded-lg text-xs font-mono border focus:outline-none ${
                darkMode
                  ? 'bg-transparent border-white/5 text-neutral-400 focus:border-indigo-500/30'
                  : 'bg-transparent border-gray-200 text-gray-500 focus:border-indigo-400'
              }`}
            />
          </div>

          {/* Excerpt */}
          <textarea
            value={editPost.excerpt}
            onChange={(e) => setEditPost({ ...editPost, excerpt: e.target.value })}
            rows={2}
            placeholder="Post excerpt / summary (shown in blog list and meta description)..."
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none resize-none ${
              darkMode
                ? 'bg-[#12121a] border-white/5 text-white placeholder:text-neutral-700 focus:border-indigo-500/30'
                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-indigo-400'
            }`}
          />

          {/* Content editor */}
          <div className={`rounded-2xl border overflow-hidden ${
            darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            {/* Toolbar */}
            <div className={`flex items-center gap-1 px-3 py-2 border-b ${
              darkMode ? 'border-white/5' : 'border-gray-200'
            }`}>
              {[
                { icon: 'B', title: 'Bold', cmd: '**' },
                { icon: 'I', title: 'Italic', cmd: '_' },
                { icon: 'H', title: 'Heading', cmd: '## ' },
                { icon: '—', title: 'Divider', cmd: '\n---\n' },
                { icon: '🔗', title: 'Link', cmd: '[](url)' },
                { icon: '📷', title: 'Image', cmd: '![alt](url)' },
                { icon: '📝', title: 'Code Block', cmd: '```\n\n```' },
                { icon: '•', title: 'List', cmd: '- ' },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const textarea = document.getElementById('blog-content-editor') as HTMLTextAreaElement
                    if (textarea) {
                      const start = textarea.selectionStart
                      const end = textarea.selectionEnd
                      const selected = editPost.content.substring(start, end)
                      let newContent: string
                      if (btn.cmd === '**' || btn.cmd === '_') {
                        newContent = editPost.content.substring(0, start) + btn.cmd + selected + btn.cmd + editPost.content.substring(end)
                      } else {
                        newContent = editPost.content.substring(0, start) + btn.cmd + editPost.content.substring(end)
                      }
                      setEditPost({ ...editPost, content: newContent })
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    darkMode
                      ? 'hover:bg-white/5 text-neutral-400'
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  title={btn.title}
                >
                  {btn.icon}
                </button>
              ))}
            </div>

            {/* Content area */}
            <textarea
              id="blog-content-editor"
              value={editPost.content}
              onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
              rows={20}
              placeholder="Write your blog post content here...&#10;&#10;Supports Markdown formatting:&#10;# Heading 1&#10;## Heading 2&#10;**bold** _italic_&#10;- bullet list&#10;1. numbered list&#10;[link text](url)&#10;![image alt](url)"
              className={`w-full px-5 py-4 text-sm font-mono leading-relaxed border-0 focus:outline-none resize-y min-h-[400px] ${
                darkMode
                  ? 'bg-transparent text-neutral-300 placeholder:text-neutral-700'
                  : 'bg-transparent text-gray-800 placeholder:text-gray-300'
              }`}
            />

            {/* Status bar */}
            <div className={`flex items-center justify-between px-4 py-2 border-t ${
              darkMode ? 'border-white/5' : 'border-gray-200'
            }`}>
              <span className={`text-[10px] font-mono ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                {editPost.content.length} chars · {editPost.content.split(/\s+/).filter(Boolean).length} words
              </span>
              <span className={`text-[10px] font-mono ${darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                Markdown supported
              </span>
            </div>
          </div>
        </div>

        {/* SEO panel */}
        {showSeoPanel && (
          <div className={`space-y-4`}>
            <div className={`p-4 rounded-2xl border sticky top-20 ${
              darkMode ? 'bg-[#12121a] border-white/5' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <h4 className="text-xs font-extrabold mb-3 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-indigo-400" /> SEO Settings
              </h4>
              <div className="space-y-3">
                <div>
                  <label className={`block text-[10px] font-bold mb-1 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={editPost.seo.metaTitle}
                    onChange={(e) => setEditPost({ ...editPost, seo: { ...editPost.seo, metaTitle: e.target.value } })}
                    className={`w-full h-9 px-3 rounded-lg text-xs border focus:outline-none ${
                      darkMode ? 'bg-[#0a0a10] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                  <span className={`text-[9px] ${(editPost.seo.metaTitle?.length || 0) > 60 ? 'text-red-400' : darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                    {editPost.seo.metaTitle?.length || 0}/60
                  </span>
                </div>
                <div>
                  <label className={`block text-[10px] font-bold mb-1 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                    Meta Description
                  </label>
                  <textarea
                    value={editPost.seo.metaDescription}
                    onChange={(e) => setEditPost({ ...editPost, seo: { ...editPost.seo, metaDescription: e.target.value } })}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none resize-none ${
                      darkMode ? 'bg-[#0a0a10] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                  <span className={`text-[9px] ${(editPost.seo.metaDescription?.length || 0) > 160 ? 'text-red-400' : darkMode ? 'text-neutral-600' : 'text-gray-400'}`}>
                    {editPost.seo.metaDescription?.length || 0}/160
                  </span>
                </div>
                <div>
                  <label className={`block text-[10px] font-bold mb-1 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={editPost.seo.keywords}
                    onChange={(e) => setEditPost({ ...editPost, seo: { ...editPost.seo, keywords: e.target.value } })}
                    placeholder="keyword1, keyword2"
                    className={`w-full h-9 px-3 rounded-lg text-xs border focus:outline-none ${
                      darkMode ? 'bg-[#0a0a10] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Google Preview */}
              <div className="mt-4">
                <h5 className={`text-[10px] font-bold mb-2 ${darkMode ? 'text-neutral-500' : 'text-gray-400'}`}>
                  Google Preview
                </h5>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/[0.03]' : 'bg-gray-50'}`}>
                  <div className="text-sm font-medium text-blue-500 truncate">
                    {editPost.seo.metaTitle || editPost.title || 'Post Title'}
                  </div>
                  <div className="text-xs text-emerald-600 truncate mt-0.5">
                    homeofcalculators.com/blog/{editPost.slug || 'post-slug'}
                  </div>
                  <div className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                    {editPost.seo.metaDescription || editPost.excerpt || 'Post description will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
