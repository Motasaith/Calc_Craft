// ─── Admin API Helpers ───
// Utility functions for communicating with Cloudflare Functions admin endpoints.

const API_BASE = '/api/admin'

interface AdminApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  token?: string | null
}

/**
 * Make an authenticated request to an admin API endpoint.
 * The Clerk session token is sent as a Bearer token and verified
 * server-side in the Cloudflare Function.
 */
export async function adminFetch<T = any>(
  endpoint: string,
  options: AdminApiOptions = {}
): Promise<{ ok: boolean; data?: T; error?: string }> {
  const { method = 'GET', body, token } = options

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        ok: false,
        error: data?.error || `Request failed with status ${res.status}`,
      }
    }

    return { ok: true, data }
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error' }
  }
}

// ─── Blog API ───

export interface BlogPost {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  status: 'publish' | 'draft' | 'pending'
  date: string
  modified: string
  featuredImage?: string
  categories?: number[]
  tags?: number[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export async function fetchBlogPosts(token: string | null): Promise<BlogPost[]> {
  const res = await adminFetch<BlogPost[]>('/blog', { token })
  return res.data || []
}

export async function createBlogPost(
  post: Partial<BlogPost>,
  token: string | null
): Promise<{ ok: boolean; data?: BlogPost; error?: string }> {
  return adminFetch<BlogPost>('/blog', {
    method: 'POST',
    body: post,
    token,
  })
}

export async function updateBlogPost(
  id: number,
  post: Partial<BlogPost>,
  token: string | null
): Promise<{ ok: boolean; data?: BlogPost; error?: string }> {
  return adminFetch<BlogPost>(`/blog/${id}`, {
    method: 'PUT',
    body: post,
    token,
  })
}

export async function deleteBlogPost(
  id: number,
  token: string | null
): Promise<{ ok: boolean; error?: string }> {
  return adminFetch(`/blog/${id}`, { method: 'DELETE', token })
}

// ─── Deploy API ───

export async function triggerDeploy(
  token: string | null
): Promise<{ ok: boolean; error?: string }> {
  return adminFetch('/deploy', { method: 'POST', token })
}

// ─── Calculator API ───

export interface AdminCalculatorEntry {
  slug: string
  name: string
  shortName: string
  category: string
  description: string
  keywords: string[]
  mode: 'retro' | 'form'
  icon: string
  isEnabled: boolean
  createdAt?: string
}

export async function fetchAdminCalculators(
  token: string | null
): Promise<AdminCalculatorEntry[]> {
  const res = await adminFetch<AdminCalculatorEntry[]>('/calculators', { token })
  return res.data || []
}

export async function createCalculator(
  calc: Partial<AdminCalculatorEntry>,
  token: string | null
): Promise<{ ok: boolean; data?: AdminCalculatorEntry; error?: string }> {
  return adminFetch<AdminCalculatorEntry>('/calculators', {
    method: 'POST',
    body: calc,
    token,
  })
}

// ─── Audit Log ───

export interface AuditEntry {
  id: string
  action: string
  target: string
  actor: string
  timestamp: string
  details?: string
}

export async function fetchAuditLog(
  token: string | null
): Promise<AuditEntry[]> {
  const res = await adminFetch<AuditEntry[]>('/audit', { token })
  return res.data || []
}
