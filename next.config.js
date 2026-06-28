/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployed to Vercel. Public pages stay fully SSG via
  // `export const dynamic = 'force-static'` + generateStaticParams — Google
  // still gets fully-rendered HTML with zero JS execution, identical to the
  // previous static-export setup. The difference is the platform now *can*
  // run server code, which /admin, NextAuth, and server actions need.
  //
  // We previously used `output: 'export'` for Cloudflare Pages. That mode
  // produces a folder of static files with no server runtime at all, which
  // made auth, middleware, server actions, and DB queries impossible. On
  // Vercel we don't need it — force-static handles the SSG guarantee.
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local static assets only; keep unoptimized for portability.
    unoptimized: true,
  },
}

module.exports = nextConfig
