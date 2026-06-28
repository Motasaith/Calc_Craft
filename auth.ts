import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'

/**
 * NextAuth v5 configuration.
 *
 * - Google OAuth only (no passwords)
 * - DrizzleAdapter persists sessions/accounts to Neon
 * - Admin access is gated by an email whitelist (ADMIN_EMAILS env var)
 *   checked here in the signIn callback and again in middleware — no admin
 *   UI, no registration flow.
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'database' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    /**
     * Mark the user as admin if their email is in the ADMIN_EMAILS whitelist.
     * Stamp `provider` and `lastSignIn` on every login.
     */
    async signIn({ user, account }) {
      if (!user?.email) return false

      const adminEmails = (process.env.ADMIN_EMAILS ?? '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)

      const isAdmin = adminEmails.includes(user.email.toLowerCase())

      await db
        .update(users)
        .set({
          isAdmin,
          provider: account?.provider ?? null,
          lastSignIn: new Date(),
        })
        .where(eq(users.email, user.email))

      return true
    },
    /**
     * Attach `isAdmin` to the session so middleware and server components
     * can check it without an extra DB hit.
     */
    async session({ session, user }) {
      if (session.user) {
        // @ts-expect-error — augmenting the session user with a custom field
        session.user.isAdmin = user.isAdmin
      }
      return session
    },
    /**
     * Middleware authorization gate.
     * - /admin/login is always accessible (otherwise we'd loop forever).
     * - All other /admin routes require an authenticated admin user.
     * - Everything else is public.
     */
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname

      // Only protect /admin routes.
      if (!pathname.startsWith('/admin')) return true

      // The login page itself is always accessible.
      if (pathname === '/admin/login') return true

      // All other /admin routes require auth + admin flag.
      return !!auth?.user && (auth.user as { isAdmin?: boolean }).isAdmin === true
    },
  },
})