/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages.
  // All SEO pages are prerendered at build time (SSG) via `export const dynamic = 'force-static'`
  // or generateStaticParams — Google gets fully-rendered HTML with zero JS execution.
  // Interactive tools (builder, embed, custom calculator) are exported as static client
  // shells that hydrate in the browser; the contact form uses a hidden-iframe fallback
  // to FormSubmit.co so no server runtime is required.
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local static assets only; sharp isn't available on Cloudflare Pages.
    unoptimized: true,
  },
}

module.exports = nextConfig
