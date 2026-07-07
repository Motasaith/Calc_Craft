// Central brand configuration — single source of truth
// Change values here and they propagate across the entire site

export const BRAND = {
  /** Full site name used in headings, nav, footer */
  name: 'Home of Calculators',

  /** Short monogram for tight spaces (badges, tiny labels) */
  shortName: 'HoC',

  /** Visual lockup used in retro calculator shells */
  shellName: 'HOME OF CALCULATORS',

  /** Tagline shown under logo in nav */
  tagline: 'Precision Tools for Every Number',

  /** Sub-tagline for retro shells */
  shellTagline: 'PRECISION TOOLS',

  /** Domain / URL */
  url: 'https://homeofcalculators.com',

  /** Twitter / social handle */
  handle: '@homeofcalculators',

  /** Creator / author name */
  author: 'Home of Calculators Team',

  /** Default description for SEO */
  description:
    'Home of Calculators is a complete calculator platform: 500+ free online calculators (math, finance, health, conversion, statistics), a no-code visual builder to design your own, embeddable widgets for any website, and full white-labeling. Free forever, private by design. All math runs in your browser.',

  /** Short description for cards / previews */
  shortDescription:
    '500+ free online calculators for math, finance, health, and everyday needs. No signup required. Fast, accurate, and mobile-friendly.',

  /** Copyright line */
  copyright: (year: number) =>
    `© ${year} Home of Calculators. All rights reserved.`,
} as const

/** Quick accessor for shell labels (retro calculators) */
export function shellLabel(variant: 'basic' | 'scientific' | 'fitness' | 'planner' | 'rng') {
  const map: Record<string, string> = {
    basic: 'BASIC',
    scientific: 'SCIENTIFIC',
    fitness: 'FITNESS',
    planner: 'PLANNER',
    rng: 'RANDOM',
  }
  return `${BRAND.shortName} ${map[variant] ?? 'TOOL'}`
}
