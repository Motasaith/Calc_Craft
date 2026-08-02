'use client'

/**
 * Root error boundary.
 *
 * Catches React rendering errors that escape every page-level boundary. Without
 * this file those errors never reach Sentry — the build warns about exactly
 * that. It replaces the whole document, so it ships its own <html>/<body> and
 * cannot rely on anything from app/layout.tsx (including Tailwind's font
 * variables), hence the inline styles.
 */

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f5ef',
          color: '#1a2019',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          padding: '1.5rem',
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 1rem',
              borderRadius: 16,
              background: '#fee2e2',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
            aria-hidden="true"
          >
            ⚠️
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 .5rem' }}>
            Something went wrong
          </h1>

          <p style={{ fontSize: '.875rem', lineHeight: 1.6, color: '#5b6159', margin: '0 0 1.5rem' }}>
            An unexpected error broke this page. It has been reported to us automatically — trying again
            usually works.
          </p>

          <div style={{ display: 'flex', gap: '.65rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '.7rem 1.25rem',
                borderRadius: 12,
                border: '1px solid #0b3d2c',
                background: '#0f172a',
                color: '#fff',
                fontWeight: 700,
                fontSize: '.85rem',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: '.7rem 1.25rem',
                borderRadius: 12,
                border: '1px solid rgba(26,32,25,.15)',
                background: '#fff',
                color: '#1a2019',
                fontWeight: 700,
                fontSize: '.85rem',
                textDecoration: 'none',
              }}
            >
              Go home
            </a>
          </div>

          {error.digest && (
            <p style={{ marginTop: '1.5rem', fontSize: '.7rem', color: '#9ca3af', fontFamily: 'monospace' }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
