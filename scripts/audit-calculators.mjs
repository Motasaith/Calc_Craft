// Measures the real state of every registered calculator and regenerates
// docs/calculator-upgrade-audit.md from what the code actually contains.
//
// ─────────────────────────────────────────────────────────────────────────────
//  WHY THIS EXISTS
// ─────────────────────────────────────────────────────────────────────────────
//  The previous hand-maintained manifest assigned COMPLETED by file size. That
//  is not a proxy for the upgrade checklist, and it was badly wrong. Example:
//
//    | Astronomy | redshift | COMPLETED | PASSED | Upgraded component. Size: 1.4 KB |
//
//  RedshiftCalculator.tsx is one input, one output, no visualisation, no unit
//  switching, no content, no FAQs — and a min-h-[440px] empty box where the
//  result column should be. It cannot pass the checklist, yet it was reported
//  as done. Roughly 280 calculators carried that claim.
//
//  Marking work complete that is not complete is worse than leaving it pending:
//  it removes it from the queue. So status here is derived from signals that can
//  actually be measured in the source, and the script is re-runnable — progress
//  is observed, never asserted.
//
// ─────────────────────────────────────────────────────────────────────────────
//  WHAT IT CAN AND CANNOT SEE
// ─────────────────────────────────────────────────────────────────────────────
//  Measurable here: presence of a visualisation, accessible SVG roles, unit
//  switching, dedicated SEO content, FAQs, and component substance.
//
//  NOT measurable here: whether a formula is correct, whether Calculator.net has
//  an equivalent, or whether content is original. Those need a human or a
//  research pass. So the best status this script can award is READY-FOR-REVIEW,
//  never COMPLETED. COMPLETED stays a human decision recorded in the Notes
//  column — which is the point: the script cannot lie the queue empty.
//
//   node scripts/audit-calculators.mjs

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT = resolve(ROOT, 'docs/calculator-upgrade-audit.md')

// ── Load the registry ───────────────────────────────────────────────────────
const registrySrc = readFileSync(resolve(ROOT, 'lib/calculators.ts'), 'utf8')

const entries = []
const entryRe = /\{\s*slug:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?\}/g
let m
while ((m = entryRe.exec(registrySrc)) !== null) {
  entries.push({ slug: m[1], category: m[2] })
}

// ── Map slug → component file ───────────────────────────────────────────────
const componentsSrc = readFileSync(resolve(ROOT, 'lib/calculator-components.tsx'), 'utf8')
const componentFor = {}
const importRe = /import\(['"]([^'"]+)['"]\)/g
const mapRe = /['"]([a-z0-9-]+)['"]\s*:\s*[^,\n]*?import\(['"]([^'"]+)['"]\)/g
while ((m = mapRe.exec(componentsSrc)) !== null) {
  componentFor[m[1]] = m[2].replace(/^@\//, '')
}

// ── SEO content coverage ────────────────────────────────────────────────────
const seoSrc = readFileSync(resolve(ROOT, 'components/CalculatorSEOContent.tsx'), 'utf8')
const seoSlugs = new Set(
  [...seoSrc.matchAll(/slug\s*===\s*'([a-z0-9-]+)'/g)].map((x) => x[1])
)

// ── Inspect one component ───────────────────────────────────────────────────
function inspect(slug, category) {
  const rel = componentFor[slug]
  if (!rel) return { missing: true }

  const abs = resolve(ROOT, rel.endsWith('.tsx') ? rel : `${rel}.tsx`)
  if (!existsSync(abs)) return { missing: true, rel }

  const src = readFileSync(abs, 'utf8')
  const bytes = Buffer.byteLength(src)

  // A visualisation must be driven by computed values, not a static decoration,
  // so require an SVG that interpolates something.
  const hasSvg = /<svg[\s>]/.test(src)
  const dataDriven = hasSvg && /\{[^}]*(results?|value|calc|score|pct|percent|ratio)[^}]*\}/i.test(src)
  const a11ySvg = hasSvg && /role=["']img["']/.test(src) && /aria-label=/.test(src)

  // Unit switching: two or more selectable systems, not just a static suffix.
  //
  // The first version of this only looked for a metric/US toggle and reported
  // false negatives at scale. OneRepMax, BAC, Pace, Temperature and Time all
  // ship real unit switching under their own names — weightUnit, distanceUnit,
  // fromUnit, convertUnit — and were all being counted as missing it. Any
  // `const [<x>Unit, set<X>Unit]` pair is unit switching regardless of naming.
  const hasUnits =
    /(unitSystem|useState<['"]metric|metric['"]\s*\|\s*['"](us|imperial)|setUnit)/.test(src) ||
    /const\s*\[\s*\w*[Uu]nits?\s*,\s*set\w+\s*\]/.test(src)

  // Units only mean something for physical quantities. GCD/LCM takes integers;
  // a date-difference calculator takes dates. Demanding a unit toggle there
  // would mean adding a control that does nothing, and marking it a permanent
  // gap would park those calculators in the queue forever with no fix available.
  //
  // So applicability is derived from evidence in the source and reported as its
  // own value in the table — visible and arguable, never a silent pass. This is
  // a heuristic and it will be wrong sometimes; that is why it is printed rather
  // than folded into the status.
  //
  // Erring toward "applicable" is the safe direction: a false positive leaves a
  // calculator in the queue for a human to dismiss, a false negative quietly
  // excuses it forever. A first pass omitted angle and electrical dimensions and
  // wrongly excused the trigonometry set (degrees vs radians is a unit switch),
  // battery capacity (mAh vs Wh) and tire sizing (metric vs imperial).
  // A converter's units are its inputs, so applicability is not in question
  // regardless of what vocabulary the source happens to use — that rule catches
  // light-year and parsec, which convert distances without ever writing the word.
  //
  // The vocabulary test has to run against prose, not raw source. `arr.length`
  // and `height={40}` appear in almost every React component, and matching them
  // wrongly marked GCD/LCM, date-difference and the menstrual-cycle calculators
  // as owing a unit toggle they have no use for.
  const prose = src
    .replace(/\.length\b/g, '')
    .replace(/\b\w*[Hh]eight\s*[=:]/g, '')
    .replace(/\b\w*[Ww]idth\s*[=:]/g, '')

  const unitsApplicable =
    category === 'conversion' ||
    /convert|converter/i.test(slug) ||
    /\b(weight|height|length|distance|mass|volume|temperature|speed|velocity|pressure|energy|area|force|power|density|angle|torque|frequency|flow|kilograms?|pounds?|metres?|meters?|miles?|litres?|liters?|gallons?|ounces?|grams?|degrees?|radians?|celsius|fahrenheit|kelvin|volts?|amps?|amperes?|ohms?|watts?|joules?|calories?|hertz|pascals?|newtons?)\b/i.test(
      prose
    )

  const hasFaq = /faq/i.test(src)
  const hasTable = /<table[\s>]/.test(src)

  return {
    missing: false,
    rel,
    bytes,
    hasSvg,
    dataDriven,
    a11ySvg,
    hasUnits,
    unitsApplicable,
    hasFaq,
    hasTable,
    hasSeo: seoSlugs.has(slug),
  }
}

// ── Status derivation ───────────────────────────────────────────────────────
// Deliberately conservative. Anything short of the full signal set stays in the
// queue; the script never awards COMPLETED.
function statusFor(i) {
  if (i.missing) return { status: 'BLOCKED', why: 'component not found' }

  const gaps = []
  if (!i.dataDriven) gaps.push('visualisation')
  if (!i.a11ySvg) gaps.push('svg a11y')
  if (!i.hasUnits && i.unitsApplicable) gaps.push('units')
  if (!i.hasSeo) gaps.push('content')
  if (i.bytes < 4000) gaps.push('depth')

  if (gaps.length === 0) return { status: 'READY-FOR-REVIEW', why: 'all measurable signals present; needs Calculator.net verification' }
  if (gaps.length <= 2) return { status: 'IN PROGRESS', why: `missing ${gaps.join(', ')}` }
  return { status: 'NOT REVIEWED', why: `missing ${gaps.join(', ')}` }
}

// ── Build ───────────────────────────────────────────────────────────────────
const rows = entries.map((e) => {
  const i = inspect(e.slug, e.category)
  const { status, why } = statusFor(i)
  return { ...e, ...i, status, why }
})

const tally = {}
for (const r of rows) tally[r.status] = (tally[r.status] || 0) + 1

const signal = (on) => (on ? 'yes' : '—')

const lines = [
  '# Calculator Upgrade Audit',
  '',
  '> Generated by `node scripts/audit-calculators.mjs`. Do not hand-edit the table —',
  '> rerun the script instead. Statuses come from signals measured in the source.',
  '',
  '## Why this replaced the previous manifest',
  '',
  'The previous manifest assigned `COMPLETED` by file size. That is not the checklist,',
  'and it was wrong at scale: `RedshiftCalculator.tsx` was recorded as',
  '`COMPLETED | PASSED | Upgraded component` while being a single input, a single',
  'output, no visualisation, no unit switching and no content. Around 280 entries',
  'carried that claim. Work marked done leaves the queue, so an inflated status is',
  'worse than an honest backlog.',
  '',
  '## What the script can and cannot judge',
  '',
  'Measurable: data-driven visualisation, SVG `role`/`aria-label`, unit switching,',
  'dedicated SEO content, FAQs, tables, component depth.',
  '',
  'Not measurable: formula correctness, whether Calculator.net has an equivalent,',
  'and content originality. Because of that the best status awarded automatically is',
  '`READY-FOR-REVIEW`. `COMPLETED` and `SKIPPED — no equivalent` remain human',
  'decisions and must be recorded deliberately, so the tooling cannot empty the queue',
  'on its own.',
  '',
  '## Current state',
  '',
  `- **Registered calculators:** ${rows.length}`,
  ...Object.entries(tally)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `- **${k}:** ${v}`),
  `- **Dedicated SEO content:** ${rows.filter((r) => r.hasSeo).length} of ${rows.length}`,
  `- **Data-driven visualisation:** ${rows.filter((r) => r.dataDriven).length} of ${rows.length}`,
  `- **Unit switching:** ${rows.filter((r) => r.hasUnits).length} present, ` +
    `${rows.filter((r) => !r.hasUnits && r.unitsApplicable).length} missing, ` +
    `${rows.filter((r) => !r.missing && !r.hasUnits && !r.unitsApplicable).length} not applicable`,
  '',
  'The `n/a` unit value marks calculators that take no physical quantity — integers,',
  'dates, counts or ratios — where a metric/imperial toggle would be a control that',
  'does nothing. It is derived from a heuristic and is printed per row precisely so it',
  'can be challenged; it is never a silent pass.',
  '',
  '## Audit table',
  '',
  '| Category | Slug | Component | Status | Viz | SVG a11y | Units | Content | Bytes | Gap |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map(
    (r) =>
      `| ${r.category} | ${r.slug} | ${r.rel ? `\`${r.rel}\`` : '**missing**'} | ${r.status} | ` +
      `${signal(r.dataDriven)} | ${signal(r.a11ySvg)} | ${r.missing ? '—' : r.hasUnits ? 'yes' : r.unitsApplicable ? '—' : 'n/a'} | ${signal(r.hasSeo)} | ` +
      `${r.bytes ?? 0} | ${r.why} |`
  ),
  '',
]

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, lines.join('\n'), 'utf8')

console.log(`Registered calculators: ${rows.length}`)
for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(18)} ${v}`)
}
console.log(`\n  dedicated SEO content : ${rows.filter((r) => r.hasSeo).length}`)
console.log(`  data-driven viz       : ${rows.filter((r) => r.dataDriven).length}`)
console.log(
  `  unit switching        : ${rows.filter((r) => r.hasUnits).length} present, ` +
    `${rows.filter((r) => !r.hasUnits && r.unitsApplicable).length} missing, ` +
    `${rows.filter((r) => !r.missing && !r.hasUnits && !r.unitsApplicable).length} n/a`
)
console.log(`\nWrote ${OUT}`)
