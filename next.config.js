/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Cloudflare Pages static export requires unoptimized images for next/image
    unoptimized: true,
  },
}

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "bina-codes",
    project: "homeofcalculators",
    widenClientFileUpload: true,

    // `reactComponentAnnotation` and `disableLogger` moved under `webpack` in
    // @sentry/nextjs v10; the old top-level spellings still work but log a
    // deprecation on every build.
    webpack: {
      reactComponentAnnotation: { enabled: true },
      treeshake: { removeDebugLogging: true },
    },

    // `tunnelRoute` was set to "/monitoring". It cannot work here: a tunnel is a
    // server route that proxies events to Sentry, and `output: 'export'` emits
    // no server routes. Every event POSTed to /monitoring, got a 404, and was
    // dropped — which is why Sentry was recording nothing at all.
    //
    // Without a tunnel, events go straight to the Sentry ingest domain. That is
    // fine, with one caveat: aggressive ad blockers block *.ingest.sentry.io, so
    // a slice of client errors will not arrive. The fix, if that matters later,
    // is a Pages Function that proxies to Sentry — not this option.

    // Source maps are uploaded for readable stack traces but not served to
    // browsers.
    hideSourceMaps: true,

    // Uploading source maps needs SENTRY_AUTH_TOKEN at build time. Without it
    // the build should still succeed — just with minified stack traces — rather
    // than fail the whole deploy.
    sourcemaps: {
      disable: !process.env.SENTRY_AUTH_TOKEN,
    },
  }
);
