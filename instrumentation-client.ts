/**
 * Sentry browser initialisation.
 *
 * REPLACES sentry.client.config.ts. @sentry/nextjs v9 deprecated that filename
 * in favour of instrumentation-client.ts, which Next.js loads as part of its
 * own instrumentation hook. The old file was still being bundled but is no
 * longer the supported entry point, and it hardcoded the DSN while
 * NEXT_PUBLIC_SENTRY_DSN sat unused in .env.local.
 *
 * This is the only Sentry init that matters for this project: `output: 'export'`
 * means there is no Node or Edge runtime, so sentry.server.config.ts and
 * sentry.edge.config.ts never execute. Server-side errors happen in the
 * Cloudflare Pages Functions instead, which are outside the Next.js SDK.
 */

import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,

    // 10% of transactions. The previous value of 1 (100%) would exhaust the
    // free tier's quota quickly on a site with this much traffic, and once the
    // quota is gone Sentry drops errors too, not just traces.
    tracesSampleRate: 0.1,

    // Errors are always sent; only performance traces are sampled.
    sampleRate: 1.0,

    debug: false,

    environment: process.env.NODE_ENV,

    // Noise that is not actionable: browser extensions, blocked third-party
    // scripts, and the ResizeObserver warning every Chrome page emits.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      /^Failed to fetch$/,
      /chrome-extension:\/\//,
      /moz-extension:\/\//,
    ],

    beforeSend(event) {
      // Never ship a session token or API key to Sentry, even inside a URL.
      if (event.request?.url) {
        try {
          const url = new URL(event.request.url)
          for (const key of ['token', 'key', 'session', '__clerk_db_jwt']) {
            if (url.searchParams.has(key)) url.searchParams.set(key, '[redacted]')
          }
          event.request.url = url.toString()
        } catch {
          // Leave a malformed URL alone rather than dropping the event.
        }
      }
      return event
    },
  })
}

// Required by Next.js so navigations are tied to their transactions.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
