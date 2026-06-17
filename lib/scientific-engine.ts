/**
 * Scientific Calculator Engine (shared)
 * -------------------------------------
 * Pure, dependency-free math engine extracted from the original
 * ScientificCalculator component so that BOTH the in-app scientific
 * calculator AND the hero "Casio-style" calculator run the exact same
 * logic. One engine = identical behavior across the site, zero drift.
 *
 * Features:
 *  - Recursive-descent parser (no eval())
 *  - Implicit multiplication (2π, 2sin(x), (2)(3), 8√2)
 *  - DEG / RAD angle modes
 *  - Trig + inverse trig, logs, exp, powers, roots, factorial, abs, etc.
 *  - Friendly error messages
 *  - Display prettifier (sqrt(8) → √(8), pi → π, sq(3) → (3)², …)
 */

export type AngleMode = 'DEG' | 'RAD'

/* ----------------------- Tokenizer ----------------------- */

type Token =
  | { type: 'num'; value: number }
  | { type: 'op'; value: '+' | '-' | '*' | '/' | '^' | 'mod' }
  | { type: 'fn'; value: FnName }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'const'; value: 'pi' | 'e' }

export type FnName =
  | 'sqrt' | 'cbrt' | 'sq' | 'cu'
  | 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan'
  | 'ln' | 'log' | 'exp' | 'tenx'
  | 'abs' | 'inv' | 'fact' | 'floor' | 'ceil' | 'round' | 'neg'

const FN_NAMES: FnName[] = [
  'sqrt', 'cbrt', 'sq', 'cu',
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'ln', 'log', 'exp', 'tenx',
  'abs', 'inv', 'fact', 'floor', 'ceil', 'round', 'neg',
]

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < input.length) {
    const c = input[i]
    if (c === ' ') { i++; continue }

    if (/[0-9.]/.test(c)) {
      let num = ''
      while (i < input.length && /[0-9.]/.test(input[i])) { num += input[i]; i++ }
      const v = parseFloat(num)
      if (!isNaN(v)) tokens.push({ type: 'num', value: v })
      continue
    }

    if (/[a-zA-Z]/.test(c)) {
      let name = ''
      while (i < input.length && /[a-zA-Z]/.test(input[i])) { name += input[i]; i++ }
      const lower = name.toLowerCase()
      if (lower === 'pi') tokens.push({ type: 'const', value: 'pi' })
      else if (lower === 'e') tokens.push({ type: 'const', value: 'e' })
      else if (FN_NAMES.includes(lower as FnName)) {
        tokens.push({ type: 'fn', value: lower as FnName })
      }
      continue
    }

    if (c === '+' || c === '-') { tokens.push({ type: 'op', value: c }); i++; continue }
    if (c === '×' || c === '*') { tokens.push({ type: 'op', value: '*' }); i++; continue }
    if (c === '÷' || c === '/') { tokens.push({ type: 'op', value: '/' }); i++; continue }
    if (c === '^') { tokens.push({ type: 'op', value: '^' }); i++; continue }
    if (c === '(') { tokens.push({ type: 'lparen' }); i++; continue }
    if (c === ')') { tokens.push({ type: 'rparen' }); i++; continue }
    if (c === '!') { tokens.push({ type: 'fn', value: 'fact' }); i++; continue }

    if (c === 'm' && input.slice(i, i + 3).toLowerCase() === 'mod') {
      tokens.push({ type: 'op', value: 'mod' })
      i += 3; continue
    }

    i++
  }
  return tokens
}

/* Inject implicit multiplication between value-ending and value-starting tokens. */
function injectImplicitMultiplication(tokens: Token[]): Token[] {
  const out: Token[] = []
  const isValueEnd = (t: Token) => t.type === 'num' || t.type === 'const' || t.type === 'rparen'
  const isValueStart = (t: Token) => t.type === 'num' || t.type === 'const' || t.type === 'lparen' || t.type === 'fn'
  for (let i = 0; i < tokens.length; i++) {
    out.push(tokens[i])
    if (i === 0) continue
    const prev = out[out.length - 2]
    const cur = tokens[i]
    if (isValueEnd(prev) && isValueStart(cur)) {
      out.splice(out.length - 1, 0, { type: 'op', value: '*' })
    }
  }
  return out
}

/* ----------------------- Evaluator ----------------------- */

function applyFn(fn: FnName, val: number, angleMode: AngleMode): number {
  const toRad = (v: number) => angleMode === 'DEG' ? v * Math.PI / 180 : v
  const fromRad = (v: number) => angleMode === 'DEG' ? v * 180 / Math.PI : v

  switch (fn) {
    case 'sqrt': if (val < 0) throw new Error('sqrt of negative'); return Math.sqrt(val)
    case 'cbrt': return Math.cbrt(val)
    case 'sq': return val * val
    case 'cu': return val * val * val
    case 'sin': return Math.sin(toRad(val))
    case 'cos': return Math.cos(toRad(val))
    case 'tan': {
      const a = toRad(val)
      if (Math.abs(Math.cos(a)) < 1e-12) throw new Error('tan undefined')
      return Math.tan(a)
    }
    case 'asin':
      if (val < -1 || val > 1) throw new Error('asin domain')
      return fromRad(Math.asin(val))
    case 'acos':
      if (val < -1 || val > 1) throw new Error('acos domain')
      return fromRad(Math.acos(val))
    case 'atan': return fromRad(Math.atan(val))
    case 'ln':
      if (val <= 0) throw new Error('ln domain')
      return Math.log(val)
    case 'log':
      if (val <= 0) throw new Error('log domain')
      return Math.log10(val)
    case 'exp': return Math.exp(val)
    case 'tenx': return Math.pow(10, val)
    case 'abs': return Math.abs(val)
    case 'inv':
      if (val === 0) throw new Error('1/0 undefined')
      return 1 / val
    case 'fact': {
      if (val < 0 || val > 170 || !Number.isInteger(val)) throw new Error('factorial domain')
      let r = 1
      for (let i = 2; i <= val; i++) r *= i
      return r
    }
    case 'floor': return Math.floor(val)
    case 'ceil': return Math.ceil(val)
    case 'round': return Math.round(val)
    case 'neg': return -val
  }
}

/**
 * Evaluate a tokenized expression. Auto-balances unmatched parens first.
 * Throws on math errors (caller should catch).
 */
export function evaluate(tokens: Token[], angleMode: AngleMode): number {
  const t = injectImplicitMultiplication(tokens)
  let p = 0
  const peek = () => t[p]
  const eat = () => t[p++]

  const parsePrimary = (): number => {
    const tok = peek()
    if (!tok) throw new Error('unexpected end')
    if (tok.type === 'num') { eat(); return tok.value }
    if (tok.type === 'const') {
      eat()
      return tok.value === 'pi' ? Math.PI : Math.E
    }
    if (tok.type === 'lparen') {
      eat()
      const v = parseExpr()
      const close = eat()
      if (!close || close.type !== 'rparen') throw new Error('missing )')
      return v
    }
    if (tok.type === 'fn') {
      eat()
      const v = parseUnary()
      return applyFn(tok.value, v, angleMode)
    }
    if (tok.type === 'op' && (tok.value === '+' || tok.value === '-')) {
      eat()
      const v = parseUnary()
      return tok.value === '-' ? -v : v
    }
    throw new Error('unexpected token')
  }

  const parsePostfix = (): number => {
    let v = parsePrimary()
    while (peek()?.type === 'fn' && (peek() as Token & { value: FnName }).value === 'fact') {
      eat()
      v = applyFn('fact', v, angleMode)
    }
    return v
  }

  const parseUnary = (): number => {
    const tok = peek()
    if (tok?.type === 'op' && tok.value === '-') { eat(); return -parseUnary() }
    if (tok?.type === 'op' && tok.value === '+') { eat(); return parseUnary() }
    return parsePostfix()
  }

  const parseFactor = (): number => {
    const base = parseUnary()
    if (peek()?.type === 'op' && (peek() as Token & { value: string }).value === '^') {
      eat()
      const exp = parseFactor()
      return Math.pow(base, exp)
    }
    return base
  }

  const parseTerm = (): number => {
    let left = parseFactor()
    while (true) {
      const tok = peek()
      if (tok?.type === 'op' && (tok.value === '*' || tok.value === '/' || tok.value === 'mod')) {
        eat()
        const right = parseFactor()
        if (tok.value === '*') left = left * right
        else if (tok.value === '/') {
          if (right === 0) throw new Error('divide by 0')
          left = left / right
        } else left = left % right
      } else break
    }
    return left
  }

  const parseExpr = (): number => {
    let left = parseTerm()
    while (true) {
      const tok = peek()
      if (tok?.type === 'op' && (tok.value === '+' || tok.value === '-')) {
        eat()
        const right = parseTerm()
        if (tok.value === '+') left = left + right
        else left = left - right
      } else break
    }
    return left
  }

  return parseExpr()
}

/* ----------------------- Helpers ----------------------- */

/** Auto-close unmatched open parens so users can press = without closing them. */
export function balanceParens(expr: string): string {
  const openCount = (expr.match(/\(/g) || []).length
  const closeCount = (expr.match(/\)/g) || []).length
  let balanced = expr
  for (let i = 0; i < openCount - closeCount; i++) balanced += ')'
  return balanced
}

/** Format a number for the calculator display (handles ERROR, tiny, huge). */
export function formatNumberForDisplay(v: number): string {
  if (!isFinite(v) || isNaN(v)) return 'ERROR'
  if (Math.abs(v) < 1e-14) return '0'
  let s = v.toString()
  if (s.length > 14) {
    if (Math.abs(v) >= 1e10 || Math.abs(v) < 1e-6) s = v.toExponential(6)
    else s = parseFloat(v.toPrecision(10)).toString()
  }
  return s
}

/**
 * Try to evaluate an expression string. Returns the numeric result or null
 * on any error. Auto-balances parens. Used for live previews.
 */
export function tryEvaluate(expr: string, angleMode: AngleMode): number | null {
  if (!expr.trim()) return null
  const balanced = balanceParens(expr)
  try {
    const tokens = tokenize(balanced)
    if (tokens.length === 0) return null
    const v = evaluate(tokens, angleMode)
    if (!isFinite(v) || isNaN(v)) return null
    return v
  } catch {
    return null
  }
}

/**
 * Convert a raw expression buffer into a pretty display string.
 *   "sqrt(8)"   => "√(8)"
 *   "pi"        => "π"
 *   "2*pi"      => "2π"
 *   "sq(3)"     => "(3)²"
 *   "fact(5)"   => "(5)!"
 *   "floor(3.7)"=> "⌊3.7⌋"
 */
export function prettifyExpr(raw: string): string {
  if (!raw) return ''
  let s = raw
    .replace(/\bpi\b/g, 'π')
    .replace(/\bmod\b/g, ' mod ')
    .replace(/×/g, '×')
    .replace(/÷/g, '÷')
    .replace(/--/g, '+')

  s = s.replace(/\bsqrt\(/g, '√(')
  s = s.replace(/\bcbrt\(/g, '∛(')
  s = s.replace(/\bexp\(/g, 'e^(')
  s = s.replace(/\btenx\(/g, '10^(')
  s = s.replace(/\binv\(/g, '1/(')
  s = s.replace(/\babs\(/g, '|−(')

  s = s.replace(/√\(([^()]*)\)/g, '√($1)')
  s = s.replace(/∛\(([^()]*)\)/g, '∛($1)')
  s = s.replace(/e\^\(([^()]*)\)/g, 'e^($1)')
  s = s.replace(/10\^\(([^()]*)\)/g, '10^($1)')
  s = s.replace(/1\/\(([^()]*)\)/g, '1/($1)')
  s = s.replace(/\|−\(([^()]*)\)\|/g, '|$1|')

  s = s.replace(/\bsq\(([^()]*)\)/g, '($1)²')
  s = s.replace(/\bcu\(([^()]*)\)/g, '($1)³')
  s = s.replace(/\bfact\(([^()]*)\)/g, '($1)!')
  s = s.replace(/\bfloor\(([^()]*)\)/g, '⌊$1⌋')
  s = s.replace(/\bceil\(([^()]*)\)/g, '⌈$1⌉')
  s = s.replace(/\bround\(([^()]*)\)/g, '[$1]')
  s = s.replace(/\bneg\(([^()]*)\)/g, '−($1)')

  s = s.replace(/×\s*−/g, '× −')
  s = s.replace(/\+\s*−/g, '+ −')
  return s
}