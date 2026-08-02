// ─── Clerk Configuration & Admin Utilities ───
// Clerk handles authentication; admin access is gated by email whitelist.

// Publishable key — safe to expose client-side (it's literally "publishable")
// Set this in .env.local: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
export const CLERK_PUBLISHABLE_KEY =
  typeof window !== 'undefined'
    ? (window as any).__ENV__?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
      ''
    : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''

// Admin email whitelist — checked client-side for UI gating,
// and server-side in Cloudflare Functions for mutation security.
// Comma-separated in env: NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com
const ADMIN_EMAILS_RAW =
  process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'saithmota@gmail.com'

export const ADMIN_EMAILS: string[] = ADMIN_EMAILS_RAW
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

/**
 * Check if a given email is an admin.
 * Used client-side to conditionally render admin UI,
 * and in Cloudflare Functions to authorize write operations.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase().trim())
}

/**
 * Clerk appearance configuration for the admin panel.
 * Dark theme to visually distinguish admin from public site.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: '#6366f1',
    colorBackground: '#0f0f14',
    colorText: '#e5e5e5',
    colorInputBackground: '#1a1a24',
    colorInputText: '#e5e5e5',
    borderRadius: '0.75rem',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  elements: {
    card: 'shadow-xl border border-white/10',
    headerTitle: 'text-white font-extrabold',
    headerSubtitle: 'text-neutral-400',
    formButtonPrimary:
      'bg-indigo-600 hover:bg-indigo-700 text-white font-bold',
    footerActionLink: 'text-indigo-400 hover:text-indigo-300',
  },
}
