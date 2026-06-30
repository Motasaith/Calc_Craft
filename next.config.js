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

module.exports = nextConfig
