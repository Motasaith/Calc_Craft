/**
 * Validation + normalisation for AI-generated calculator configs.
 *
 * The /api/build-calculator Pages Function asks the LLM to return a
 * CustomCalculatorConfig as JSON. Models are good but not perfect: they invent
 * variable names that collide with math functions, reference inputs that don't
 * exist, return numbers as strings, drop required fields, and occasionally
 * hallucinate a whole extra field. This module is the gate between the raw
 * model output and CustomCalculatorRenderer — nothing reaches the renderer
 * without passing through `normalizeAiConfig`.
 *
 * It never throws. Anything unsalvageable is dropped and reported in
 * `warnings`, so the UI can tell the user what the AI got wrong instead of
 * rendering a broken widget.
 */

import {
  CustomCalculatorConfig,
  CustomComponentConfig,
  CustomFormulaConfig,
  CustomThemeType,
} from '@/components/calculators/shared/CustomCalculatorRenderer'
import { checkFormula } from '@/lib/formula-parser'

// ─── Limits ────────────────────────────────────────────────────────────────
// Kept deliberately tight: an embeddable widget with 30 inputs is a form, not
// a calculator, and the whole config has to survive base64 encoding into an
// embed URL.
export const AI_LIMITS = {
  maxComponents: 24,
  maxFormulas: 8,
  maxOptions: 12,
  maxNameLen: 80,
  maxDescriptionLen: 300,
  maxLabelLen: 120,
  maxHelpTextLen: 200,
  maxAffixLen: 8,
  maxUnitLen: 12,
} as const

const VALID_THEMES: CustomThemeType[] = ['retro', 'dark', 'modern', 'pastel', 'cyberpunk', 'custom']

const VALID_TYPES: CustomComponentConfig['type'][] = [
  'number',
  'slider',
  'select',
  'checkbox',
  'radio',
  'header',
  'text',
  'row',
  'column',
]

/** Types that produce a value usable inside a formula. */
const VALUE_TYPES: CustomComponentConfig['type'][] = ['number', 'slider', 'select', 'checkbox', 'radio']

/**
 * Identifiers the formula parser already owns. A variable named `round` would
 * shadow the function and silently break every formula that uses it.
 */
const RESERVED_NAMES = new Set([
  'pi', 'PI', 'e', 'E',
  'pow', 'sqrt', 'abs', 'round', 'ceil', 'floor',
  'sin', 'cos', 'tan', 'log', 'log10', 'ln',
])

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

// ─── Primitive coercion ────────────────────────────────────────────────────

function str(v: unknown, max: number, fallback = ''): string {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return fallback
  const s = String(v).trim()
  return s ? s.slice(0, max) : fallback
}

function num(v: unknown): number | undefined {
  if (v === null || v === undefined || v === '') return undefined
  const n = typeof v === 'number' ? v : parseFloat(String(v))
  return Number.isFinite(n) ? n : undefined
}

function bool(v: unknown): boolean {
  if (typeof v === 'boolean') return v
  if (typeof v === 'string') return v.toLowerCase() === 'true'
  return false
}

function hex(v: unknown, fallback: string): string {
  const s = typeof v === 'string' ? v.trim() : ''
  return HEX_COLOR.test(s) ? s : fallback
}

/**
 * Turns any label into a legal formula identifier: lowercase, alphanumeric +
 * underscore, never leading with a digit.
 */
export function toVarName(raw: string): string {
  let s = String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  if (!s) s = 'var'
  if (/^[0-9]/.test(s)) s = '_' + s
  return s.slice(0, 24)
}

function uniqueVarName(base: string, taken: Set<string>): string {
  let name = base
  if (RESERVED_NAMES.has(name)) name = `${name}_val`
  let i = 1
  while (taken.has(name)) name = `${base}_${i++}`
  taken.add(name)
  return name
}

// ─── Component normalisation ───────────────────────────────────────────────

function normalizeOptions(raw: unknown): { value: string; label: string }[] {
  if (!Array.isArray(raw)) return []
  return raw
    .slice(0, AI_LIMITS.maxOptions)
    .map((o) => {
      // Models sometimes emit a bare array of strings instead of {value,label}.
      if (typeof o === 'string' || typeof o === 'number') {
        return { value: String(o), label: String(o) }
      }
      if (!o || typeof o !== 'object') return null
      const rec = o as Record<string, unknown>
      const value = str(rec.value, 40)
      const label = str(rec.label, 60) || value
      if (!value && !label) return null
      return { value: value || label, label }
    })
    .filter((o): o is { value: string; label: string } => !!o)
}

function normalizeComponent(
  raw: unknown,
  index: number,
  takenNames: Set<string>,
  takenIds: Set<string>,
  warnings: string[]
): CustomComponentConfig | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>

  const rawType = str(r.type, 20).toLowerCase() as CustomComponentConfig['type']
  const type = VALID_TYPES.includes(rawType) ? rawType : 'number'
  if (rawType && !VALID_TYPES.includes(rawType)) {
    warnings.push(`Unsupported field type "${rawType}" — used a number input instead.`)
  }

  const label = str(r.label, AI_LIMITS.maxLabelLen) || str(r.name, AI_LIMITS.maxLabelLen) || `Field ${index + 1}`

  let id = str(r.id, 40)
  if (!id || takenIds.has(id)) id = `c${index}-${Math.random().toString(36).slice(2, 7)}`
  takenIds.add(id)

  // Layout + copy elements carry no value, so they need no variable name.
  const needsVar = VALUE_TYPES.includes(type)
  const name = needsVar
    ? uniqueVarName(toVarName(str(r.name, 40) || label), takenNames)
    : id

  const c: CustomComponentConfig = { id, name, type, label }

  const placeholder = str(r.placeholder, 60)
  if (placeholder) c.placeholder = placeholder

  const helpText = str(r.helpText, AI_LIMITS.maxHelpTextLen)
  if (helpText) c.helpText = helpText

  const unit = str(r.unit, AI_LIMITS.maxUnitLen)
  if (unit) c.unit = unit

  if (type === 'select' || type === 'radio') {
    const options = normalizeOptions(r.options)
    if (options.length === 0) {
      warnings.push(`"${label}" was a dropdown with no options — converted to a number input.`)
      c.type = 'number'
    } else {
      c.options = options
    }
  }

  if (c.type === 'number' || c.type === 'slider') {
    const min = num(r.min)
    const max = num(r.max)
    const step = num(r.step)
    if (min !== undefined) c.min = min
    if (max !== undefined) c.max = max
    if (step !== undefined && step > 0) c.step = step

    // A slider with no range is unusable — the renderer needs both ends.
    if (c.type === 'slider') {
      if (c.min === undefined) c.min = 0
      if (c.max === undefined) c.max = Math.max(100, (c.min ?? 0) + 100)
      if (c.max <= c.min) c.max = c.min + 100
      if (c.step === undefined) c.step = 1
    } else if (c.min !== undefined && c.max !== undefined && c.max < c.min) {
      // Swapped bounds on a plain number field: drop them rather than guess.
      delete c.min
      delete c.max
    }
  }

  // defaultValue: checkbox is boolean, everything else is a string.
  if (r.defaultValue !== undefined && r.defaultValue !== null) {
    if (c.type === 'checkbox') {
      c.defaultValue = bool(r.defaultValue)
    } else {
      const dv = str(r.defaultValue, 60)
      if (dv) c.defaultValue = dv
    }
  }
  // A dropdown must always start on a real option. Missing or off-list values
  // leave it unselected, which the formula parser reads as 0 — the calculator
  // then loads showing a wrong answer instead of no answer.
  if ((c.type === 'select' || c.type === 'radio') && c.options && c.options.length > 0) {
    if (c.defaultValue === undefined || !c.options.some((o) => o.value === String(c.defaultValue))) {
      c.defaultValue = c.options[0].value
    }
  }
  if (c.type === 'slider' && c.defaultValue === undefined) {
    c.defaultValue = String(c.min ?? 0)
  }

  if (bool(r.readOnly)) c.readOnly = true

  return c
}

// ─── Formula normalisation ─────────────────────────────────────────────────

function normalizeFormula(
  raw: unknown,
  index: number,
  availableVars: string[],
  takenIds: Set<string>,
  warnings: string[]
): CustomFormulaConfig | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>

  // Strip an `=` the model may have prefixed, spreadsheet-style.
  const formula = str(r.formula ?? r.expression, 500).replace(/^\s*=\s*/, '')
  if (!formula) return null

  const label = str(r.label, AI_LIMITS.maxLabelLen) || `Result ${index + 1}`

  const check = checkFormula(formula, availableVars)
  if (!check.isValid) {
    warnings.push(`Dropped the "${label}" result — the AI wrote an invalid formula (${check.error}).`)
    return null
  }

  // The parser resolves unknown identifiers to 0, so a typo'd variable produces
  // a silently wrong number rather than an error. Catch it here instead.
  const referenced = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || []
  const unknown = referenced.filter(
    (t) => !availableVars.includes(t) && !RESERVED_NAMES.has(t) && !RESERVED_NAMES.has(t.toLowerCase())
  )
  if (unknown.length > 0) {
    warnings.push(
      `Dropped the "${label}" result — it referenced ${unknown.map((u) => `"${u}"`).join(', ')}, which isn't an input on this calculator.`
    )
    return null
  }

  let id = str(r.id, 40)
  if (!id || takenIds.has(id)) id = `f${index}-${Math.random().toString(36).slice(2, 7)}`
  takenIds.add(id)

  const dp = num(r.decimalPlaces)

  const f: CustomFormulaConfig = {
    id,
    label,
    formula,
    decimalPlaces: dp === undefined ? 2 : Math.max(0, Math.min(10, Math.round(dp))),
  }

  const prefix = str(r.prefix, AI_LIMITS.maxAffixLen)
  if (prefix) f.prefix = prefix
  const suffix = str(r.suffix, AI_LIMITS.maxAffixLen)
  if (suffix) f.suffix = suffix

  return f
}

// ─── Entry point ───────────────────────────────────────────────────────────

export interface NormalizeResult {
  config: CustomCalculatorConfig | null
  warnings: string[]
}

/**
 * Converts arbitrary parsed JSON from the model into a config the renderer can
 * safely draw. Returns `config: null` only when the input has no usable
 * structure at all.
 */
export function normalizeAiConfig(raw: unknown, opts: { existingId?: string } = {}): NormalizeResult {
  const warnings: string[] = []

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { config: null, warnings: ['The AI did not return a calculator. Try rephrasing your description.'] }
  }
  const r = raw as Record<string, unknown>

  const rawComponents = Array.isArray(r.components) ? r.components : []
  const rawFormulas = Array.isArray(r.formulas) ? r.formulas : []

  if (rawComponents.length === 0 && rawFormulas.length === 0) {
    return { config: null, warnings: ['The AI returned an empty calculator. Try describing the inputs and the result you want.'] }
  }

  if (rawComponents.length > AI_LIMITS.maxComponents) {
    warnings.push(`The AI produced ${rawComponents.length} fields — kept the first ${AI_LIMITS.maxComponents}.`)
  }
  if (rawFormulas.length > AI_LIMITS.maxFormulas) {
    warnings.push(`The AI produced ${rawFormulas.length} results — kept the first ${AI_LIMITS.maxFormulas}.`)
  }

  const takenNames = new Set<string>()
  const takenComponentIds = new Set<string>()
  const components = rawComponents
    .slice(0, AI_LIMITS.maxComponents)
    .map((c, i) => normalizeComponent(c, i, takenNames, takenComponentIds, warnings))
    .filter((c): c is CustomComponentConfig => c !== null)

  // Nested layouts are a visual-builder feature; keep any parentId that points
  // at a real row/column and discard the rest so nothing renders orphaned.
  const layoutIds = new Set(components.filter((c) => c.type === 'row' || c.type === 'column').map((c) => c.id))
  rawComponents.slice(0, AI_LIMITS.maxComponents).forEach((rc, i) => {
    const parentId = rc && typeof rc === 'object' ? str((rc as Record<string, unknown>).parentId, 40) : ''
    if (parentId && layoutIds.has(parentId) && components[i] && components[i].id !== parentId) {
      components[i].parentId = parentId
    }
  })

  const availableVars = components.filter((c) => VALUE_TYPES.includes(c.type)).map((c) => c.name)

  const takenFormulaIds = new Set<string>()
  const formulas = rawFormulas
    .slice(0, AI_LIMITS.maxFormulas)
    .map((f, i) => normalizeFormula(f, i, availableVars, takenFormulaIds, warnings))
    .filter((f): f is CustomFormulaConfig => f !== null)

  if (components.length === 0) {
    return { config: null, warnings: [...warnings, 'The AI produced no usable input fields.'] }
  }
  if (formulas.length === 0) {
    return {
      config: null,
      warnings: [...warnings, 'The AI produced no working result formula. Try describing the calculation in plainer terms.'],
    }
  }

  const rawTheme = str(r.theme, 20).toLowerCase() as CustomThemeType
  const theme: CustomThemeType = VALID_THEMES.includes(rawTheme) ? rawTheme : 'modern'

  const config: CustomCalculatorConfig = {
    id: opts.existingId || str(r.id, 60) || `ai-${Date.now()}`,
    name: str(r.name, AI_LIMITS.maxNameLen, 'AI Calculator'),
    description: str(r.description, AI_LIMITS.maxDescriptionLen),
    theme,
    layout: str(r.layout, 20) === 'grid' ? 'grid' : 'stacked',
    components,
    formulas,
    requireSubmit: bool(r.requireSubmit),
    enableCSVExport: bool(r.enableCSVExport),
    enablePDFExport: bool(r.enablePDFExport),
  }

  const brandName = str(r.brandName, 40)
  if (brandName) config.brandName = brandName

  // Only accept a data: or https: logo — the renderer drops it into an <img src>.
  const logo = str(r.logo, 500_000)
  if (logo && (logo.startsWith('data:image/') || logo.startsWith('https://'))) {
    config.logo = logo
  }

  if (theme === 'custom' || r.customColors) {
    const cc = (r.customColors && typeof r.customColors === 'object' ? r.customColors : {}) as Record<string, unknown>
    config.customColors = {
      primary: hex(cc.primary, '#4f46e5'),
      secondary: hex(cc.secondary, '#4338ca'),
      background: hex(cc.background, '#ffffff'),
      text: hex(cc.text, '#1a1a1f'),
      lcdBg: hex(cc.lcdBg, '#eef2ff'),
      lcdText: hex(cc.lcdText, '#312e81'),
    }
  }

  return { config, warnings }
}

/**
 * Human-readable one-liner for the "what the AI built" summary strip.
 */
export function describeConfig(config: CustomCalculatorConfig): string {
  const inputs = config.components.filter((c) => VALUE_TYPES.includes(c.type)).length
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
  return `${plural(inputs, 'input')} · ${plural(config.formulas.length, 'result')} · ${config.theme} theme`
}
