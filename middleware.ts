export { auth as middleware } from '@/auth'

/**
 * Middleware protects /admin routes.
 *
 * The `auth` export from NextAuth v5 is a drop-in middleware that populates
 * `req.auth` and runs the `authorized` callback defined in auth.ts. We
 * configure the matcher so only /admin (and the NextAuth API) go through
 * it — public SSG pages are untouched and stay fully static.
 */
export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
}