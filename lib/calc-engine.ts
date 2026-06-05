/**
 * Calc_Craft Calculation Engine
 * -----------------------------
 * A state-of-the-art math engine built on top of mathjs, configured for:
 *  - High precision (BigNumber) by default — no float-rounding surprises
 *  - Standard math.js syntax (sqrt(8), 2pi, sin(pi/2), etc.)
 *  - Domain-error handling (e.g. sqrt of negative, ln of zero)
 *  - Lazy-loaded: only imported on calculator pages, never the landing page
 *  - Type-safe wrapper with friendly error messages
 *
 * The engine has TWO modes:
 *   - `evaluate()` for general math (returns number, with BigNumber-precision)
 *   - `evaluateBig()` for financial calcs (returns BigNumber for cents-perfect)
 *
 * NOTE: mathjs is ESM-only. We use dynamic `import()` so this file can be
 *       loaded by both the server (SSR) and the client (browser) without
 *       breaking Next.js's module resolution.
 */

import type { MathJsInstance } from 'mathjs'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export type AngleMode = 'DEG' | 'RAD'

export interface EvalOptions {
  /** Use BigNumber arithmetic (slower, but no float drift). Default: true. */
  precision?: boolean
  /** Decimal places for rounding the result. Default: 14. */
  precisionDigits?: number
  /** Angle unit for trig functions. Default: 'RAD'. */
  angleMode?: AngleMode
}

export interface EvalResult {
  ok: true
  value: number
  formatted: string
}
export interface EvalError {
  ok: false
  error: string
}
export type CalcResult = EvalResult | EvalError

const DEFAULT_PRECISION_DIGITS = 14
const SCINOTATION_THRESHOLD_HIGH = 1e15
const SCINOTATION_THRESHOLD_LOW = 1e-9

// ------------------------------------------------------------------
// Lazy mathjs loader — only loaded when needed
// ------------------------------------------------------------------
let _math: MathJsInstance | null = null
let _mathBig: MathJsInstance | null = null
let _loadingPromise: Promise<void> | null = null

async function loadMath(): Promise<void> {
  if (_math) return
  if (_loadingPromise) return _loadingPromise
  _loadingPromise = (async () => {
    // Dynamic import — keeps mathjs out of the landing page bundle
    const mod = await import('mathjs')
    const { create, all } = mod as unknown as {
      create: (factories: unknown) => MathJsInstance
      all: unknown
    }
    // Standard-precision instance (BigNumber-backed, 64 digits)
    const std = create(all)
    std.config({ number: 'BigNumber', precision: 64 })
    _math = std
    // High-precision instance for financial calculations (128 digits)
    const big = create(all)
    big.config({ number: 'BigNumber', precision: 128 })
    _mathBig = big
  })()
  return _loadingPromise
}

function toRadians(v: number, angleMode: AngleMode): number {
  return angleMode === 'DEG' ? (v * Math.PI) / 180 : v
}
function fromRadians(v: number, angleMode: AngleMode): number {
  return angleMode === 'DEG' ? (v * 180) / Math.PI : v
}

// ------------------------------------------------------------------
// Friendly error messages for common mathjs errors
// ------------------------------------------------------------------
function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('Undefined symbol')) return 'Unknown variable or function'
  if (msg.includes('Unexpected end of expression')) return 'Incomplete expression'
  if (msg.includes('Undefined function')) return 'Unknown function'
  if (msg.includes('Division by zero')) return 'Cannot divide by zero'
  if (msg.includes('Cannot convert')) return 'Invalid input type'
  if (msg.includes('NaN')) return 'Math error (NaN)'
  if (msg.includes('Infinity')) return 'Result is infinite'
  if (msg.includes('factorial')) return 'Factorial: value must be a non-negative integer'
  if (msg.includes('sqrt')) return 'Square root of negative number'
  if (msg.includes('log')) return 'Log of non-positive number'
  if (msg.length > 120) return 'Invalid expression'
  return msg
}

// ------------------------------------------------------------------
// Main evaluate function
// ------------------------------------------------------------------

/**
 * Evaluate a math expression. Returns either a result or a friendly error.
 *
 * Examples:
 *   await evaluate("sqrt(8) + 2^10")
 *   await evaluate("2pi", { angleMode: 'DEG' })
 *   await evaluate("sin(pi/2) + cos(0)", { angleMode: 'RAD' })
 */
export async function evaluate(
  expression: string,
  options: EvalOptions = {}
): Promise<CalcResult> {
  if (!expression || !expression.trim()) {
    return { ok: false, error: 'Empty expression' }
  }
  try {
    await loadMath()
    const math = _math!
    const angleMode = options.angleMode ?? 'RAD'
    const digits = options.precisionDigits ?? DEFAULT_PRECISION_DIGITS

    // Build a scope with trig wrappers that respect DEG/RAD mode
    // and aliases for common math conventions.
    // Convention: `log` = natural log (mathjs), `ln` = natural log, `log10` = base-10
    const scope = {
      log: (x: number) => Math.log(x),
      ln: (x: number) => Math.log(x),
      log10: (x: number) => Math.log10(x),
      sin: (x: number) => Math.sin(toRadians(x, angleMode)),
      cos: (x: number) => Math.cos(toRadians(x, angleMode)),
      tan: (x: number) => Math.tan(toRadians(x, angleMode)),
      asin: (x: number) => fromRadians(Math.asin(x), angleMode),
      acos: (x: number) => fromRadians(Math.acos(x), angleMode),
      atan: (x: number) => fromRadians(Math.atan(x), angleMode),
    }

    const raw = math.evaluate(expression, scope)
    const value = typeof raw === 'object' && raw && 'toNumber' in raw
      ? (raw as { toNumber: () => number }).toNumber()
      : Number(raw)

    if (!isFinite(value) || isNaN(value)) {
      return { ok: false, error: 'Math error' }
    }
    return {
      ok: true,
      value,
      formatted: formatNumber(value, digits),
    }
  } catch (err) {
    return { ok: false, error: friendlyError(err) }
  }
}

/**
 * Evaluate with BigNumber precision. Use for financial calcs.
 * Returns a string (BigNumber has no native JS number).
 */
export async function evaluateBig(
  expression: string,
  options: EvalOptions = {}
): Promise<CalcResult> {
  if (!expression || !expression.trim()) {
    return { ok: false, error: 'Empty expression' }
  }
  try {
    await loadMath()
    const math = _mathBig!
    const angleMode = options.angleMode ?? 'RAD'
    const digits = options.precisionDigits ?? DEFAULT_PRECISION_DIGITS

    const scope = {
      log: (x: number) => Math.log(x),
      ln: (x: number) => Math.log(x),
      log10: (x: number) => Math.log10(x),
      sin: (x: number) => Math.sin(toRadians(x, angleMode)),
      cos: (x: number) => Math.cos(toRadians(x, angleMode)),
      tan: (x: number) => Math.tan(toRadians(x, angleMode)),
      asin: (x: number) => fromRadians(Math.asin(x), angleMode),
      acos: (x: number) => fromRadians(Math.acos(x), angleMode),
      atan: (x: number) => fromRadians(Math.atan(x), angleMode),
    }

    const raw: unknown = math.evaluate(expression, scope)
    let str: string
    let value: number
    if (typeof raw === 'object' && raw && 'toNumber' in raw) {
      const num = (raw as { toNumber: () => number }).toNumber()
      str = num.toString()
      value = num
    } else {
      str = String(raw)
      value = Number(raw)
    }
    if (!isFinite(value) || isNaN(value)) {
      return { ok: false, error: 'Math error' }
    }
    return {
      ok: true,
      value,
      formatted: formatNumber(value, digits),
    }
  } catch (err) {
    return { ok: false, error: friendlyError(err) }
  }
}

// ------------------------------------------------------------------
// Number formatting
// ------------------------------------------------------------------
export function formatNumber(v: number, digits = DEFAULT_PRECISION_DIGITS): string {
  if (!isFinite(v) || isNaN(v)) return 'Error'
  if (Math.abs(v) < 1e-15) return '0'
  // Scientific notation for very large or very small numbers
  if (Math.abs(v) >= SCINOTATION_THRESHOLD_HIGH || Math.abs(v) < SCINOTATION_THRESHOLD_LOW) {
    return v.toExponential(Math.max(2, digits - 6))
  }
  // Strip trailing zeros after rounding
  const rounded = parseFloat(v.toPrecision(Math.min(digits, 15)))
  let s = rounded.toString()
  // If the number is huge, switch to exponential
  if (s.length > digits + 4) s = rounded.toExponential(4)
  return s
}

/**
 * Format a value as currency. Adds thousand separators and 2 decimal places.
 */
export function formatCurrency(v: number, currency = '$'): string {
  if (!isFinite(v) || isNaN(v)) return 'Error'
  const sign = v < 0 ? '-' : ''
  const abs = Math.abs(v)
  const fixed = abs.toFixed(2)
  const [intPart, decPart] = fixed.split('.')
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${sign}${currency}${withCommas}.${decPart}`
}

/**
 * Format as percentage with N decimal places.
 */
export function formatPercent(v: number, digits = 2): string {
  if (!isFinite(v) || isNaN(v)) return 'Error'
  return `${(v * 100).toFixed(digits)}%`
}

// ------------------------------------------------------------------
// Financial helpers (used by loan, mortgage, SIP, etc.)
// ------------------------------------------------------------------

/**
 * Standard loan EMI formula (synchronous, BigNumber via mathjs).
 *   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 *   P = principal, r = monthly rate (annual/12/100), n = months
 */
export async function calculateEMI(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): Promise<{ emi: number; totalPayment: number; totalInterest: number }> {
  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalPayment: 0, totalInterest: 0 }
  }
  if (annualRatePct === 0) {
    return {
      emi: principal / tenureMonths,
      totalPayment: principal,
      totalInterest: 0,
    }
  }
  const r = annualRatePct / 12 / 100
  const expr = `((${principal}) * (${r}) * (1 + ${r})^(${tenureMonths})) / ((1 + ${r})^(${tenureMonths}) - 1)`
  const emiRes = await evaluateBig(expr)
  if (!emiRes.ok) return { emi: 0, totalPayment: 0, totalInterest: 0 }
  const emi = emiRes.value
  const totalPayment = emi * tenureMonths
  return {
    emi,
    totalPayment,
    totalInterest: totalPayment - principal,
  }
}

/**
 * Compound interest / future value.
 *   A = P * (1 + r/n)^(n*t)
 *   P = principal, r = annual rate (decimal), n = compounds per year, t = years
 */
export async function calculateCompoundInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear = 12
): Promise<{ amount: number; interest: number }> {
  if (principal <= 0 || years <= 0) return { amount: 0, interest: 0 }
  const r = annualRatePct / 100
  const expr = `(${principal}) * (1 + ${r}/${compoundsPerYear})^(${compoundsPerYear}*${years})`
  const res = await evaluateBig(expr)
  if (!res.ok) return { amount: 0, interest: 0 }
  return { amount: res.value, interest: res.value - principal }
}

/**
 * SIP (Systematic Investment Plan) future value.
 *   FV = P * [((1 + i)^n - 1) / i] * (1 + i)
 *   P = monthly investment, i = monthly rate (annual/12/100), n = months
 */
export async function calculateSIP(
  monthlyInvestment: number,
  annualRatePct: number,
  months: number
): Promise<{ futureValue: number; invested: number; returns: number }> {
  if (monthlyInvestment <= 0 || months <= 0) {
    return { futureValue: 0, invested: 0, returns: 0 }
  }
  const invested = monthlyInvestment * months
  if (annualRatePct === 0) {
    return { futureValue: invested, invested, returns: 0 }
  }
  const i = annualRatePct / 12 / 100
  const expr = `(${monthlyInvestment}) * (((1 + ${i})^(${months}) - 1) / (${i})) * (1 + ${i})`
  const res = await evaluateBig(expr)
  if (!res.ok) return { futureValue: 0, invested, returns: 0 }
  return { futureValue: res.value, invested, returns: res.value - invested }
}

/**
 * Simple interest: A = P * (1 + r*t)
 */
export async function calculateSimpleInterest(
  principal: number,
  annualRatePct: number,
  years: number
): Promise<{ amount: number; interest: number }> {
  if (principal <= 0 || years <= 0) return { amount: 0, interest: 0 }
  const r = annualRatePct / 100
  const expr = `(${principal}) * (1 + ${r} * ${years})`
  const res = await evaluateBig(expr)
  if (!res.ok) return { amount: 0, interest: 0 }
  return { amount: res.value, interest: res.value - principal }
}

/**
 * Inflation-adjusted future value.
 *   FV = PV * (1 + inflation)^years
 */
export async function calculateInflation(
  presentValue: number,
  annualInflationPct: number,
  years: number
): Promise<{ futureValue: number; purchasingPowerLoss: number }> {
  if (presentValue <= 0 || years <= 0) {
    return { futureValue: 0, purchasingPowerLoss: 0 }
  }
  const r = annualInflationPct / 100
  const expr = `(${presentValue}) * (1 + ${r})^(${years})`
  const res = await evaluateBig(expr)
  if (!res.ok) return { futureValue: 0, purchasingPowerLoss: 0 }
  return { futureValue: res.value, purchasingPowerLoss: res.value - presentValue }
}

/**
 * ROI (Return on Investment) percentage.
 *   ROI% = (gain - cost) / cost * 100
 */
export function calculateROI(initialValue: number, finalValue: number): number {
  if (initialValue === 0) return 0
  return ((finalValue - initialValue) / Math.abs(initialValue)) * 100
}

/**
 * Discount: final price after a percentage off.
 *   final = price * (1 - discount/100)
 */
export function calculateDiscount(price: number, discountPct: number): {
  finalPrice: number
  saved: number
} {
  if (price <= 0) return { finalPrice: 0, saved: 0 }
  const saved = price * (discountPct / 100)
  return { finalPrice: price - saved, saved }
}

/**
 * Profit margin: (revenue - cost) / revenue * 100
 */
export function calculateProfitMargin(revenue: number, cost: number): number {
  if (revenue === 0) return 0
  return ((revenue - cost) / revenue) * 100
}

/**
 * Break-even: number of units to cover fixed costs.
 *   units = fixedCosts / (pricePerUnit - variableCostPerUnit)
 */
export function calculateBreakEven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number
): number {
  const margin = pricePerUnit - variableCostPerUnit
  if (margin <= 0) return Infinity
  return fixedCosts / margin
}

/**
 * Tip calculation (split between N people).
 */
export function calculateTip(
  billAmount: number,
  tipPct: number,
  people = 1
): { tip: number; total: number; perPerson: number } {
  if (billAmount <= 0 || people <= 0) return { tip: 0, total: 0, perPerson: 0 }
  const tip = (billAmount * tipPct) / 100
  const total = billAmount + tip
  return { tip, total, perPerson: total / people }
}

/**
 * Salary: annual → monthly / weekly / hourly breakdown.
 */
export function calculateSalary(annual: number, hoursPerWeek = 40, weeksPerYear = 52) {
  if (annual <= 0) return { monthly: 0, weekly: 0, hourly: 0, daily: 0 }
  return {
    monthly: annual / 12,
    weekly: annual / weeksPerYear,
    daily: annual / (weeksPerYear * 5),
    hourly: annual / (weeksPerYear * hoursPerWeek),
  }
}

/**
 * Savings goal: months to reach a target with monthly deposits + interest.
 *   months = -log(1 - target*rate/deposit) / log(1 + rate)
 */
export async function calculateSavingsGoal(
  target: number,
  monthlyDeposit: number,
  annualRatePct: number
): Promise<number> {
  if (target <= 0 || monthlyDeposit <= 0) return 0
  if (annualRatePct === 0) return target / monthlyDeposit
  const r = annualRatePct / 12 / 100
  const expr = `-log(1 - (${target} * ${r}) / ${monthlyDeposit}) / log(1 + ${r})`
  const res = await evaluate(expr)
  if (!res.ok) return Infinity
  return Math.ceil(res.value)
}

// ------------------------------------------------------------------
// Health & fitness formulas
// ------------------------------------------------------------------

/**
 * BMI: weight (kg) / height (m)²
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) return 0
  const m = heightCm / 100
  return weightKg / (m * m)
}

/**
 * BMR — Mifflin-St Jeor equation (most accurate modern formula).
 *   Male:   10*weight + 6.25*height - 5*age + 5
 *   Female: 10*weight + 6.25*height - 5*age - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: 'male' | 'female'
): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

/**
 * TDEE (Total Daily Energy Expenditure) using BMR × activity factor.
 */
export function calculateTDEE(
  bmr: number,
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
): number {
  const factors: Record<typeof activity, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  }
  return bmr * factors[activity]
}

/**
 * Body fat % (US Navy method) using waist, neck, hip (for women), height.
 */
export function calculateBodyFatNavy(
  sex: 'male' | 'female',
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm?: number
): number {
  if (sex === 'male') {
    if (waistCm - neckCm <= 0) return 0
    return 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450
  } else {
    if (!hipCm || waistCm + hipCm - neckCm <= 0) return 0
    return 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450
  }
}

/**
 * Ideal body weight — supports 4 clinical formulas:
 *   - Devine (1974):     most widely used
 *   - Robinson (1983):   modified Devine
 *   - Miller (1983):     modified Devine
 *   - Hamwi (1964):      older alternative
 *   Male:   50 + 2.3 * (inches over 5 ft)    (Devine)
 *   Female: 45.5 + 2.3 * (inches over 5 ft)  (Devine)
 */
export type IdealWeightFormula = 'devine' | 'robinson' | 'miller' | 'hamwi'

export interface IdealWeightResult {
  devine: number
  robinson: number
  miller: number
  hamwi: number
  /** BMI-based healthy weight range (18.5 - 25) */
  bmiRange: { min: number; max: number }
}

export function calculateIdealWeight(
  sex: 'male' | 'female',
  heightCm: number,
  formula: IdealWeightFormula = 'devine'
): number {
  if (heightCm <= 0) return 0
  const inches = heightCm / 2.54
  const over5ft = Math.max(0, inches - 60)
  switch (formula) {
    case 'devine':
      return sex === 'male' ? 50 + 2.3 * over5ft : 45.5 + 2.3 * over5ft
    case 'robinson':
      return sex === 'male' ? 52 + 1.9 * over5ft : 49 + 1.7 * over5ft
    case 'miller':
      return sex === 'male' ? 56.2 + 1.41 * over5ft : 53.1 + 1.36 * over5ft
    case 'hamwi':
      return sex === 'male' ? 48 + 2.7 * over5ft : 45.5 + 2.2 * over5ft
  }
}

/**
 * Calculate all ideal-weight formulas at once plus a BMI-based healthy range.
 * Returns the full result set so the UI can show all options.
 */
export function calculateIdealWeightAll(
  sex: 'male' | 'female',
  heightCm: number
): IdealWeightResult {
  if (heightCm <= 0) {
    return { devine: 0, robinson: 0, miller: 0, hamwi: 0, bmiRange: { min: 0, max: 0 } }
  }
  const m = heightCm / 100
  return {
    devine: calculateIdealWeight(sex, heightCm, 'devine'),
    robinson: calculateIdealWeight(sex, heightCm, 'robinson'),
    miller: calculateIdealWeight(sex, heightCm, 'miller'),
    hamwi: calculateIdealWeight(sex, heightCm, 'hamwi'),
    bmiRange: { min: 18.5 * m * m, max: 25 * m * m },
  }
}

/**
 * Target heart rate (Karvonen formula).
 *   HR_max = 220 - age
 *   target = (HR_max - resting) * intensity + resting
 */
export function calculateHeartRate(
  age: number,
  restingHR: number,
  intensityPct: number
): { max: number; target: number } {
  if (age <= 0) return { max: 0, target: 0 }
  const max = 220 - age
  const target = (max - restingHR) * (intensityPct / 100) + restingHR
  return { max, target }
}

/**
 * Daily water intake (ml) — common guideline.
 *   weight(kg) * 35 ml
 *   + 500 ml per 30 min of exercise
 */
export function calculateWaterIntake(weightKg: number, exerciseMinutesPerDay = 0): number {
  if (weightKg <= 0) return 0
  const base = weightKg * 35
  const exercise = (exerciseMinutesPerDay / 30) * 500
  return Math.round(base + exercise)
}

/**
 * Macronutrient split (in grams) from total calories.
 * Default split: 40% carbs, 30% protein, 30% fat.
 *   carbs: 4 cal/g, protein: 4 cal/g, fat: 9 cal/g
 */
export function calculateMacros(
  totalCalories: number,
  split: { carbs?: number; protein?: number; fat?: number } = {}
): { carbs: number; protein: number; fat: number } {
  if (totalCalories <= 0) return { carbs: 0, protein: 0, fat: 0 }
  const carbsPct = split.carbs ?? 0.4
  const proteinPct = split.protein ?? 0.3
  const fatPct = split.fat ?? 0.3
  return {
    carbs: Math.round((totalCalories * carbsPct) / 4),
    protein: Math.round((totalCalories * proteinPct) / 4),
    fat: Math.round((totalCalories * fatPct) / 9),
  }
}

/**
 * Pregnancy: estimated due date from last menstrual period.
 *   LMP + 280 days (40 weeks)
 */
export function calculateDueDate(lastMenstrualPeriod: Date): {
  dueDate: Date
  weeksPregnant: number
  trimester: 1 | 2 | 3
} {
  const due = new Date(lastMenstrualPeriod)
  due.setDate(due.getDate() + 280)
  const today = new Date()
  const daysSince = Math.floor((today.getTime() - lastMenstrualPeriod.getTime()) / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(daysSince / 7)
  const trimester: 1 | 2 | 3 = weeks < 13 ? 1 : weeks < 27 ? 2 : 3
  return { dueDate: due, weeksPregnant: weeks, trimester }
}

// ------------------------------------------------------------------
// Date & time formulas
// ------------------------------------------------------------------

/**
 * Age in years (with decimals) from birthdate.
 */
export function calculateAge(birthDate: Date, asOf: Date = new Date()): {
  years: number
  months: number
  days: number
  totalDays: number
} {
  let years = asOf.getFullYear() - birthDate.getFullYear()
  let months = asOf.getMonth() - birthDate.getMonth()
  let days = asOf.getDate() - birthDate.getDate()
  if (days < 0) {
    months--
    const lastMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0)
    days += lastMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }
  const totalDays = Math.floor((asOf.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  return { years, months, days, totalDays }
}

/**
 * Difference between two dates in various units.
 */
export function calculateDateDifference(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime()
  const totalSeconds = Math.floor(ms / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  return { totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, totalSeconds }
}

/**
 * Add/subtract time from a date.
 */
export function addTime(
  date: Date,
  amount: number,
  unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
): Date {
  const d = new Date(date)
  switch (unit) {
    case 'years': d.setFullYear(d.getFullYear() + amount); break
    case 'months': d.setMonth(d.getMonth() + amount); break
    case 'weeks': d.setDate(d.getDate() + amount * 7); break
    case 'days': d.setDate(d.getDate() + amount); break
    case 'hours': d.setHours(d.getHours() + amount); break
    case 'minutes': d.setMinutes(d.getMinutes() + amount); break
    case 'seconds': d.setSeconds(d.getSeconds() + amount); break
  }
  return d
}

/**
 * Time helpers: convert between H:M:S and total seconds.
 */
export function hmsToSeconds(hours: number, minutes: number, seconds: number): number {
  const h = Number(hours) || 0
  const m = Number(minutes) || 0
  const s = Number(seconds) || 0
  return h * 3600 + m * 60 + s
}

export function secondsToHMS(totalSeconds: number): { hours: number; minutes: number; seconds: number; negative: boolean } {
  let neg = false
  let t = Math.floor(Number(totalSeconds) || 0)
  if (t < 0) { neg = true; t = Math.abs(t) }
  const hours = Math.floor(t / 3600)
  const minutes = Math.floor((t % 3600) / 60)
  const seconds = t % 60
  return { hours, minutes, seconds, negative: neg }
}

// ------------------------------------------------------------------
// Unit conversions — all conversions route through SI base units
// ------------------------------------------------------------------
// Length (meters)
const LENGTH_TO_M = {
  m: 1, meter: 1, meters: 1,
  km: 1000, kilometer: 1000, kilometers: 1000,
  cm: 0.01, centimeter: 0.01, centimeters: 0.01,
  mm: 0.001, millimeter: 0.001, millimeters: 0.001,
  mi: 1609.344, mile: 1609.344, miles: 1609.344,
  yd: 0.9144, yard: 0.9144, yards: 0.9144,
  ft: 0.3048, foot: 0.3048, feet: 0.3048,
  in: 0.0254, inch: 0.0254, inches: 0.0254,
  nm: 1852, nmi: 1852, 'nautical mile': 1852, 'nautical miles': 1852,
} as const
// Weight (grams)
const WEIGHT_TO_G = {
  g: 1, gram: 1, grams: 1,
  kg: 1000, kilogram: 1000, kilograms: 1000,
  mg: 0.001, milligram: 0.001, milligrams: 0.001,
  lb: 453.592, lbs: 453.592, pound: 453.592, pounds: 453.592,
  oz: 28.3495, ounce: 28.3495, ounces: 28.3495,
  ton: 1000000, 'metric ton': 1000000, 'metric tons': 1000000,
  'us ton': 907185, 'us tons': 907185, 'short ton': 907185, 'short tons': 907185,
  st: 6350.288, stone: 6350.288, stones: 6350.288,
} as const
// Temperature handled separately (not linear)
// Speed (m/s)
const SPEED_TO_MS = {
  'm/s': 1, mps: 1,
  'km/h': 0.277778, kph: 0.277778, kmh: 0.277778,
  'mph': 0.44704,
  'knot': 0.514444, knots: 0.514444, kt: 0.514444,
  'ft/s': 0.3048, fps: 0.3048,
  'mach': 343, 'speed of sound': 343,
} as const
// Time (seconds)
const TIME_TO_S = {
  s: 1, sec: 1, second: 1, seconds: 1,
  min: 60, minute: 60, minutes: 60,
  h: 3600, hr: 3600, hour: 3600, hours: 3600,
  d: 86400, day: 86400, days: 86400,
  wk: 604800, week: 604800, weeks: 604800,
  mo: 2592000, month: 2592000, months: 2592000, // 30-day month
  yr: 31536000, year: 31536000, years: 31536000, // 365-day year
} as const
// Area (square meters)
const AREA_TO_M2 = {
  'm²': 1, 'm2': 1, 'sq m': 1, 'square meter': 1, 'square meters': 1,
  'km²': 1000000, 'km2': 1000000, 'sq km': 1000000,
  'cm²': 0.0001, 'cm2': 0.0001, 'sq cm': 0.0001,
  'ha': 10000, hectare: 10000, hectares: 10000,
  'ac': 4046.86, acre: 4046.86, acres: 4046.86,
  'ft²': 0.092903, 'ft2': 0.092903, 'sq ft': 0.092903, 'square foot': 0.092903, 'square feet': 0.092903,
  'in²': 0.00064516, 'in2': 0.00064516, 'sq in': 0.00064516, 'square inch': 0.00064516, 'square inches': 0.00064516,
  'yd²': 0.836127, 'yd2': 0.836127, 'sq yd': 0.836127,
  'mi²': 2589988, 'mi2': 2589988, 'sq mi': 2589988,
} as const
// Volume (liters)
const VOLUME_TO_L = {
  l: 1, liter: 1, liters: 1, litre: 1, litres: 1,
  ml: 0.001, milliliter: 0.001, milliliters: 0.001, millilitre: 0.001,
  kl: 1000, kiloliter: 1000,
  'm³': 1000, 'm3': 1000, 'cubic meter': 1000, 'cubic meters': 1000,
  'cm³': 0.001, 'cm3': 0.001, cc: 0.001, 'cubic cm': 0.001,
  'gal': 3.78541, gallon: 3.78541, gallons: 3.78541, 'us gal': 3.78541, 'us gallon': 3.78541,
  'qt': 0.946353, quart: 0.946353, quarts: 0.946353,
  'pt': 0.473176, pint: 0.473176, pints: 0.473176,
  'cup': 0.236588, cups: 0.236588,
  'fl oz': 0.0295735, 'fluid ounce': 0.0295735, 'fluid ounces': 0.0295735,
  'tbsp': 0.0147868, tablespoon: 0.0147868, tablespoons: 0.0147868,
  'tsp': 0.00492892, teaspoon: 0.00492892, teaspoons: 0.00492892,
} as const
// Data storage (bytes)
const DATA_TO_B = {
  b: 1, bit: 1, bits: 1,
  B: 1, byte: 1, bytes: 1,
  KB: 1024, kilobyte: 1024, kilobytes: 1024,
  MB: 1048576, megabyte: 1048576, megabytes: 1048576,
  GB: 1073741824, gigabyte: 1073741824, gigabytes: 1073741824,
  TB: 1099511627776, terabyte: 1099511627776, terabytes: 1099511627776,
  PB: 1125899906842624, petabyte: 1125899906842624, petabytes: 1125899906842624,
  // Decimal (SI) variants
  'KB (SI)': 1000,
  'MB (SI)': 1000000,
  'GB (SI)': 1000000000,
  'TB (SI)': 1000000000000,
} as const
// Energy (joules)
const ENERGY_TO_J = {
  j: 1, joule: 1, joules: 1,
  kj: 1000, kilojoule: 1000, kilojoules: 1000,
  cal: 4.184, calorie: 4.184, calories: 4.184,
  kcal: 4184, kilocalorie: 4184, kilocalories: 4184,
  wh: 3600, 'watt-hour': 3600, 'watt hours': 3600,
  kwh: 3600000, 'kilowatt-hour': 3600000,
  ev: 1.602176634e-19, 'electron volt': 1.602176634e-19,
  btu: 1055.06, 'british thermal unit': 1055.06,
  ftlb: 1.355818, 'foot-pound': 1.355818,
} as const
// Pressure (pascals)
const PRESSURE_TO_PA = {
  pa: 1, pascal: 1, pascals: 1,
  kpa: 1000, kilopascal: 1000, kilopascals: 1000,
  mpa: 1000000, megapascal: 1000000,
  bar: 100000,
  mbar: 100, millibar: 100, millibars: 100,
  atm: 101325, atmosphere: 101325, atmospheres: 101325,
  psi: 6894.76,
  torr: 133.322, mmhg: 133.322,
} as const

const UNIT_TABLES: Record<string, Record<string, number>> = {
  length: LENGTH_TO_M as unknown as Record<string, number>,
  weight: WEIGHT_TO_G as unknown as Record<string, number>,
  mass: WEIGHT_TO_G as unknown as Record<string, number>,
  speed: SPEED_TO_MS as unknown as Record<string, number>,
  time: TIME_TO_S as unknown as Record<string, number>,
  area: AREA_TO_M2 as unknown as Record<string, number>,
  volume: VOLUME_TO_L as unknown as Record<string, number>,
  data: DATA_TO_B as unknown as Record<string, number>,
  storage: DATA_TO_B as unknown as Record<string, number>,
  energy: ENERGY_TO_J as unknown as Record<string, number>,
  pressure: PRESSURE_TO_PA as unknown as Record<string, number>,
}

const CATEGORY_BASE_UNIT: Record<string, string> = {
  length: 'm', weight: 'g', mass: 'g', speed: 'm/s', time: 's',
  area: 'm²', volume: 'L', data: 'B', storage: 'B', energy: 'J', pressure: 'Pa',
}

/**
 * Convert between two units within the same category.
 * Temperature needs special handling (not supported here, see convertTemperature).
 */
export function convertUnits(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: keyof typeof UNIT_TABLES
): number {
  const table = UNIT_TABLES[category]
  if (!table) throw new Error(`Unknown category: ${category}`)
  const fromKey = findKey(table, fromUnit)
  const toKey = findKey(table, toUnit)
  if (!fromKey) throw new Error(`Unknown unit: ${fromUnit}`)
  if (!toKey) throw new Error(`Unknown unit: ${toUnit}`)
  // value in base -> value in target
  const inBase = value * table[fromKey]
  return inBase / table[toKey]
}

function findKey(table: Record<string, number>, query: string): string | null {
  const q = query.toLowerCase().trim()
  for (const k of Object.keys(table)) {
    if (k.toLowerCase() === q) return k
  }
  return null
}

/**
 * Temperature conversion (special case — not linear scaling).
 */
export function convertTemperature(value: number, from: 'C' | 'F' | 'K', to: 'C' | 'F' | 'K'): number {
  // First convert to Celsius
  let celsius: number
  switch (from) {
    case 'C': celsius = value; break
    case 'F': celsius = (value - 32) * 5 / 9; break
    case 'K': celsius = value - 273.15; break
  }
  // Then convert from Celsius to target
  switch (to) {
    case 'C': return celsius
    case 'F': return celsius * 9 / 5 + 32
    case 'K': return celsius + 273.15
  }
}

/**
 * Cooking measurements — volume-based, with common ingredient densities.
 */
export function convertCooking(value: number, from: string, to: string, ingredient = 'water'): number {
  // Default to water density (1 g/ml). For other ingredients, multiply by density.
  const densities: Record<string, number> = {
    water: 1, milk: 1.03, 'olive oil': 0.92, 'vegetable oil': 0.92,
    flour: 0.59, sugar: 0.85, 'brown sugar': 0.93, 'powdered sugar': 0.56,
    butter: 0.911, salt: 1.2, honey: 1.42, 'maple syrup': 1.32,
  }
  const density = densities[ingredient.toLowerCase()] ?? 1
  // Convert volume units first
  const fromMl = toMl(value, from)
  const ml = fromMl
  const grams = ml * density
  return fromGrams(grams, to)
}

function toMl(value: number, unit: string): number {
  const u = unit.toLowerCase()
  const factors: Record<string, number> = {
    'ml': 1, milliliter: 1, milliliters: 1,
    'l': 1000, liter: 1000, liters: 1000,
    'tsp': 4.92892, teaspoon: 4.92892, teaspoons: 4.92892,
    'tbsp': 14.7868, tablespoon: 14.7868, tablespoons: 14.7868,
    'cup': 236.588, cups: 236.588,
    'floz': 29.5735, 'fl oz': 29.5735, 'fluid ounce': 29.5735, 'fluid ounces': 29.5735,
    'pint': 473.176, pints: 473.176,
    'quart': 946.353, quarts: 946.353,
    'gallon': 3785.41, gallons: 3785.41,
    'pinch': 0.31, 'dash': 0.62, 'smidgen': 0.155,
  }
  for (const k of Object.keys(factors)) {
    if (k === u || k + 's' === u) return value * factors[k]
  }
  // grams
  if (u === 'g' || u === 'gram' || u === 'grams') return value
  return value
}

function fromGrams(grams: number, unit: string): number {
  const u = unit.toLowerCase()
  const factors: Record<string, number> = {
    'g': 1, gram: 1, grams: 1,
    'kg': 0.001, kilogram: 0.001, kilograms: 0.001,
    'oz': 0.035274, ounce: 0.035274, ounces: 0.035274,
    'lb': 0.002205, lbs: 0.002205, pound: 0.002205, pounds: 0.002205,
  }
  for (const k of Object.keys(factors)) {
    if (k === u || k + 's' === u) return grams * factors[k]
  }
  return grams
}

/**
 * Currency conversion — pure function. Caller supplies the rate.
 * (Live rates would require a fetch, which we don't do here for offline-first UX.)
 */
export function convertCurrency(amount: number, rate: number): number {
  return amount * rate
}

// ------------------------------------------------------------------
// Statistics helpers
// ------------------------------------------------------------------

export function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

export function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function mode(values: number[]): number[] {
  if (values.length === 0) return []
  const counts = new Map<number, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  const maxCount = Math.max(...counts.values())
  return Array.from(counts.entries())
    .filter(([, c]) => c === maxCount)
    .map(([v]) => v)
    .sort((a, b) => a - b)
}

export function stddev(values: number[], population = false): number {
  if (values.length === 0) return 0
  const m = mean(values)
  const sqDiff = values.reduce((acc, v) => acc + (v - m) ** 2, 0)
  return Math.sqrt(sqDiff / (population ? values.length : values.length - 1))
}

export function variance(values: number[], population = false): number {
  if (values.length === 0) return 0
  const m = mean(values)
  const sqDiff = values.reduce((acc, v) => acc + (v - m) ** 2, 0)
  return sqDiff / (population ? values.length : values.length - 1)
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

export function range_(values: number[]): number {
  if (values.length === 0) return 0
  return Math.max(...values) - Math.min(...values)
}

// ------------------------------------------------------------------
// Preload (call this in the calculator page layout to warm the cache)
// ------------------------------------------------------------------
export async function preloadEngine(): Promise<void> {
  await loadMath()
}

// Re-export common useful function
export { addTime as addDate }
