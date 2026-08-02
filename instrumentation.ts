/**
 * Next.js server instrumentation hook.
 *
 * This project is a static export (`output: 'export'`), so there is no Node or
 * Edge server at runtime and this never runs in production. It exists because
 * @sentry/nextjs warns on every build when the file is absent, and because
 * `next dev` DOES have a server — errors thrown during local development are
 * worth capturing.
 *
 * Real server-side errors in production happen in the Cloudflare Pages
 * Functions under functions/, which are outside the Next.js SDK entirely and
 * report through their own console logging.
 */

export async function register() {
  // Only the Node.js runtime is ever exercised here, and only in `next dev`.
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      debug: false,
    })
  }
}

export async function onRequestError(...args: Parameters<typeof import('@sentry/nextjs').captureRequestError>) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return
  const Sentry = await import('@sentry/nextjs')
  Sentry.captureRequestError(...args)
}
