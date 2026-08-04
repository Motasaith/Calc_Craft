// Generates the social share cards referenced by app/layout.tsx.
//
// These are committed as PNGs rather than produced at build time: `output:
// 'export'` rules out next/og (it needs a runtime), and Cloudflare Pages builds
// have no fonts guaranteed beyond the base image. Generating them here, once,
// keeps the build deterministic.
//
// They existed only as URLs before — og-image.png and twitter-image.png were
// referenced on every page and both 404'd, which is what an SEO crawler reports
// as "Open Graph tags incomplete".
//
//   node scripts/generate-og-images.mjs

import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const W = 1200
const H = 630

// Palette lifted from the calculator shells so the card matches the product.
const INK = '#1a2019'
const OLIVE = '#4c5c4a'
const PALE = '#cbd8ca'
const CREAM = '#eae7df'
const CLAY = '#b5655c'

// A calculator keypad, drawn rather than hand-listed so the grid stays even.
const keys = []
const KEY_X = 792
const KEY_Y = 300
const KEY_W = 68
const KEY_H = 52
const GAP = 12
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 4; col++) {
    const isAccent = col === 3
    keys.push(
      `<rect x="${KEY_X + col * (KEY_W + GAP)}" y="${KEY_Y + row * (KEY_H + GAP)}" ` +
        `width="${KEY_W}" height="${KEY_H}" rx="10" ` +
        `fill="${isAccent ? CLAY : CREAM}" opacity="${isAccent ? 0.95 : 0.9}"/>`
    )
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${INK}"/>
      <stop offset="100%" stop-color="#243026"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${PALE}" stroke-width="1" opacity="0.06"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect x="0" y="0" width="${W}" height="10" fill="${CLAY}"/>

  <!-- Wordmark -->
  <text x="80" y="182" font-family="Arial, Helvetica, sans-serif" font-size="30"
        font-weight="700" fill="${PALE}" letter-spacing="7">HOME OF</text>
  <!-- 78px keeps the 11-character wordmark clear of the calculator at x=768.
       At 96px the trailing S ran underneath it. -->
  <text x="80" y="286" font-family="Arial, Helvetica, sans-serif" font-size="78"
        font-weight="700" fill="#ffffff" letter-spacing="-1">CALCULATORS</text>

  <rect x="80" y="330" width="96" height="6" rx="3" fill="${CLAY}"/>

  <text x="80" y="404" font-family="Arial, Helvetica, sans-serif" font-size="34"
        font-weight="400" fill="${CREAM}" opacity="0.92">500+ free calculators for math,</text>
  <text x="80" y="450" font-family="Arial, Helvetica, sans-serif" font-size="34"
        font-weight="400" fill="${CREAM}" opacity="0.92">finance, health and conversion.</text>

  <text x="80" y="536" font-family="Arial, Helvetica, sans-serif" font-size="25"
        font-weight="700" fill="${PALE}" opacity="0.75" letter-spacing="1">No signup · Private by design</text>

  <text x="80" y="586" font-family="Arial, Helvetica, sans-serif" font-size="25"
        font-weight="700" fill="${CLAY}" letter-spacing="1">homeofcalculators.com</text>

  <!-- Calculator motif -->
  <rect x="768" y="118" width="356" height="422" rx="28" fill="${OLIVE}" opacity="0.55"/>
  <rect x="792" y="152" width="308" height="116" rx="12" fill="#0f1611" opacity="0.85"/>
  <text x="1076" y="232" text-anchor="end" font-family="Arial, Helvetica, sans-serif"
        font-size="56" font-weight="700" fill="${PALE}">1,234.56</text>
  ${keys.join('\n  ')}
</svg>`

for (const name of ['og-image.png', 'twitter-image.png']) {
  const out = resolve(ROOT, 'public', name)
  await sharp(Buffer.from(svg)).png().toFile(out)
  console.log(`wrote public/${name}  (${W}x${H})`)
}
