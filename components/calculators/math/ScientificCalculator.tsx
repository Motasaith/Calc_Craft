'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Delete } from 'lucide-react'
import { useKeyboardInput } from '@/hooks/useKeyboardInput'

/* =========================================================================
   EXPRESSION-BASED SCIENTIFIC CALCULATOR
   Behaves like a real scientific calculator (TI/Casio style):
     - User builds an expression by pressing keys:  √(8) × 2 =
     - The display shows the expression as it is being built
     - Pressing = parses and evaluates the full expression
   ========================================================================= */

type AngleMode = 'DEG' | 'RAD'

/* ----------------------- Tokenizer & Parser ----------------------- */

type Token =
  | { type: 'num'; value: number }
  | { type: 'op'; value: '+' | '-' | '*' | '/' | '^' | 'mod' }
  | { type: 'fn'; value: FnName }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'const'; value: 'pi' | 'e' }

type FnName =
  | 'sqrt' | 'cbrt' | 'sq' | 'cu'
  | 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan'
  | 'ln' | 'log' | 'exp' | 'tenx'
  | 'abs' | 'inv' | 'fact' | 'floor' | 'ceil' | 'round' | 'neg'

function tokenize(input: string): Token[] {
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
      else if (
        ['sqrt','cbrt','sq','cu','sin','cos','tan','asin','acos','atan',
         'ln','log','exp','tenx','abs','inv','fact','floor','ceil','round','neg'].includes(lower)
      ) {
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

/* Inject implicit multiplication:
   Between value-ending tokens (num/const/rparen) and value-starting tokens
   (num/const/lparen/fn). Examples: 2π, 2sin(x), (2)(3), 8√2
*/
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

/* Recursive-descent evaluator:
   expr   := term (('+'|'-') term)*
   term   := factor (('*'|'/'|'mod') factor)*
   factor := unary ('^' factor)?       // right-assoc
   unary  := ('-'|'+') unary | postfix
   postfix := primary '!'*
   primary := number | const | '(' expr ')' | fn '(' ... ')'
   Functions consume the next sub-expression as their argument, e.g. sqrt(8).
*/
function evaluate(tokens: Token[], angleMode: AngleMode): number {
  const t = injectImplicitMultiplication(tokens)
  let p = 0
  const peek = () => t[p]
  const eat = () => t[p++]

  const toRad = (v: number) => angleMode === 'DEG' ? v * Math.PI / 180 : v
  const fromRad = (v: number) => angleMode === 'DEG' ? v * 180 / Math.PI : v

  const applyFn = (fn: FnName, val: number): number => {
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

  const parsePrimary = (): number => {
    const tok = peek()
    if (!tok) throw new Error('unexpected end')
    if (tok.type === 'num') { eat(); return tok.value }
    if (tok.type === 'const') {
      eat()
      if (tok.value === 'pi') return Math.PI
      return Math.E
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
      return applyFn(tok.value, v)
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
    while (peek()?.type === 'fn' && (peek() as any).value === 'fact') {
      eat()
      v = applyFn('fact', v)
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
    if (peek()?.type === 'op' && (peek() as any).value === '^') {
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

function formatNumberForDisplay(v: number): string {
  if (!isFinite(v) || isNaN(v)) return 'ERROR'
  if (Math.abs(v) < 1e-14) return '0'
  let s = v.toString()
  if (s.length > 14) {
    if (Math.abs(v) >= 1e10 || Math.abs(v) < 1e-6) s = v.toExponential(6)
    else s = parseFloat(v.toPrecision(10)).toString()
  }
  return s
}

/* Convert raw expression buffer into a pretty display string.
   "sqrt(8)"      => "√(8)"
   "cbrt(27)"     => "∛(27)"
   "pi"           => "π"
   "2*pi"         => "2π"
   "exp(2)"       => "e^(2)"   (display only — parser still reads "exp")
   "log(100)"     => "log(100)"
   "sin(pi/2)"    => "sin(π/2)"
   "sq(3)"        => "(3)²"
   "cu(2)"        => "(2)³"
   "inv(4)"       => "1/(4)"
   "abs(-7)"      => "|−7|"
   "fact(5)"      => "(5)!"
   "floor(3.7)"   => "⌊3.7⌋"
   "ceil(3.2)"    => "⌈3.2⌉"
   "round(3.7)"   => "[3.7]"
   "tenx(3)"      => "10^(3)"
   "neg(5)"       => "−(5)"
   "mod"          => " mod "
*/
function prettifyExpr(raw: string): string {
  if (!raw) return ''
  // First, replace named constants with their symbols
  let s = raw
    .replace(/\bpi\b/g, 'π')
    .replace(/\bmod\b/g, ' mod ')
    .replace(/×/g, '×')
    .replace(/÷/g, '÷')
    .replace(/--/g, '+')
  // Now replace function calls with pretty forms.
  // The pattern "name(" is replaced with the symbol, and a matching ")" is
  // also handled when it follows an expression: "sqrt(8)" => "√(8)".
  s = s.replace(/\bsqrt\(/g, '√(')
  s = s.replace(/\bcbrt\(/g, '∛(')
  s = s.replace(/\bexp\(/g, 'e^(')
  s = s.replace(/\btenx\(/g, '10^(')
  s = s.replace(/\binv\(/g, '1/(')
  s = s.replace(/\babs\(/g, '|−(')
  // For "name(expr)" form, fold expr into the symbol form
  s = s.replace(/√\(([^()]*)\)/g, '√($1)')
  s = s.replace(/∛\(([^()]*)\)/g, '∛($1)')
  s = s.replace(/e\^\(([^()]*)\)/g, 'e^($1)')
  s = s.replace(/10\^\(([^()]*)\)/g, '10^($1)')
  s = s.replace(/1\/\(([^()]*)\)/g, '1/($1)')
  s = s.replace(/\|−\(([^()]*)\)\|/g, '|$1|')
  // sq(x) and cu(x) become (x)² and (x)³
  s = s.replace(/\bsq\(([^()]*)\)/g, '($1)²')
  s = s.replace(/\bcu\(([^()]*)\)/g, '($1)³')
  // fact(x) becomes (x)!
  s = s.replace(/\bfact\(([^()]*)\)/g, '($1)!')
  // floor/ceil/round/neg
  s = s.replace(/\bfloor\(([^()]*)\)/g, '⌊$1⌋')
  s = s.replace(/\bceil\(([^()]*)\)/g, '⌈$1⌉')
  s = s.replace(/\bround\(([^()]*)\)/g, '[$1]')
  s = s.replace(/\bneg\(([^()]*)\)/g, '−($1)')
  // Collapse "× −" and "−−" to look cleaner
  s = s.replace(/×\s*−/g, '× −')
  s = s.replace(/\+\s*−/g, '+ −')
  return s
}

/* ----------------------- Main component ----------------------- */

export default function ScientificCalculator() {
  // Expression buffer the user is building
  const [expr, setExpr] = useState('')
  const [ans, setAns] = useState<number | null>(null)
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG')
  const [memory, setMemory] = useState(0)
  const [isInv, setIsInv] = useState(false)
  const [preview, setPreview] = useState<{ val: number } | null>(null)
  const exprRef = useRef(expr)
  exprRef.current = expr

  const append = (s: string) => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return s
      return cur + s
    })
    setPreview(null)
  }

  // Appends a function and auto-closes the parenthesis with cursor inside
  // so the user can immediately type the argument.
  const appendFn = (name: string) => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return `${name}(`
      return cur + `${name}(`
    })
    setPreview(null)
  }

  const appendNumber = (n: string) => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return n
      // Auto-close open paren before typing number: "sqrt(" + "8" => "sqrt(8"
      // (the closing paren will be auto-inserted when the user types ) or a binary op)
      return cur + n
    })
    setPreview(null)
  }

  const appendDot = () => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return '0.'
      const tail = cur.split(/[^0-9.]/).pop() || ''
      if (tail.includes('.')) return cur
      return cur + '.'
    })
    setPreview(null)
  }

  const backspace = () => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return ''
      return cur.slice(0, -1)
    })
    setPreview(null)
  }

  const clearAll = () => {
    setExpr('')
    setPreview(null)
  }

  const clearEntry = () => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return ''
      return cur.replace(/[0-9.]+$/, '').replace(/(pi|e)$/, '')
    })
    setPreview(null)
  }

  const toggleSign = () => {
    setExpr((cur) => {
      if (!cur) return '-'
      const m = cur.match(/(-?[0-9]+(?:\.[0-9]*)?)$/)
      if (m) {
        const num = m[1]
        const start = m.index!
        const toggled = num.startsWith('-') ? num.slice(1) : '-' + num
        return cur.slice(0, start) + toggled
      }
      return cur + '-'
    })
    setPreview(null)
  }

  const appendPercent = () => {
    setExpr((cur) => (cur === 'ERROR' || cur === 'Ans' ? '' : cur + '/100'))
    setPreview(null)
  }

  const equals = () => {
    const e = exprRef.current
    if (!e.trim()) return
    // Auto-close any unmatched parens so users can press = without closing them
    let balanced = e
    const openCount = (balanced.match(/\(/g) || []).length
    const closeCount = (balanced.match(/\)/g) || []).length
    for (let i = 0; i < openCount - closeCount; i++) balanced += ')'
    try {
      const tokens = tokenize(balanced)
      if (tokens.length === 0) return
      const v = evaluate(tokens, angleMode)
      if (!isFinite(v) || isNaN(v)) throw new Error('math error')
      const formatted = formatNumberForDisplay(v)
      setAns(v)
      setExpr(formatted)
      setPreview(null)
    } catch {
      setExpr('ERROR')
      setPreview(null)
    }
  }

  // Live preview of current expression value (also auto-closes open parens)
  const evaluateCurrent = useCallback((): number | null => {
    const e = exprRef.current
    if (!e.trim()) return null
    let balanced = e
    const openCount = (balanced.match(/\(/g) || []).length
    const closeCount = (balanced.match(/\)/g) || []).length
    for (let i = 0; i < openCount - closeCount; i++) balanced += ')'
    try {
      const tokens = tokenize(balanced)
      if (tokens.length === 0) return null
      const v = evaluate(tokens, angleMode)
      if (!isFinite(v) || isNaN(v)) return null
      return v
    } catch {
      return null
    }
  }, [angleMode])

  useEffect(() => {
    if (!expr) { setPreview(null); return }
    const v = evaluateCurrent()
    if (v === null) { setPreview(null); return }
    setPreview({ val: v })
  }, [expr, angleMode, evaluateCurrent])

  // Display: pretty expression on top, live result on bottom
  const displayExpr = expr === '' ? '0' : (expr === 'ERROR' || expr === 'Ans' ? expr : prettifyExpr(expr))
  const bottomDisplay = preview
    ? formatNumberForDisplay(preview.val)
    : expr === 'ERROR'
      ? 'ERROR'
      : expr
        ? '0'
        : '0'

  // Keyboard
  useKeyboardInput({
    '0': () => appendNumber('0'),
    '1': () => appendNumber('1'),
    '2': () => appendNumber('2'),
    '3': () => appendNumber('3'),
    '4': () => appendNumber('4'),
    '5': () => appendNumber('5'),
    '6': () => appendNumber('6'),
    '7': () => appendNumber('7'),
    '8': () => appendNumber('8'),
    '9': () => appendNumber('9'),
    '.': () => appendDot(),
    '+': () => append('+'),
    '-': () => append('-'),
    '*': () => append('*'),
    '/': () => append('/'),
    '^': () => append('^'),
    '(': () => append('('),
    ')': () => append(')'),
    '!': () => append('!'),
    '%': () => appendPercent(),
    'Backspace': () => backspace(),
    'Delete': () => backspace(),
    'Escape': () => clearAll(),
    'c': () => clearAll(),
    'C': () => clearAll(),
    '=': () => equals(),
    'Enter': () => equals(),
  })

  const bSci = "h-9 text-[10px] font-bold bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all font-mono"
  const bNum = "h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 hover:bg-neutral-100 transition-all"
  const bOp = "h-10 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 hover:bg-[#c2cbc0] transition-all"

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono">CALC-CRAFT SCIENTIFIC</span>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
              className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold hover:bg-neutral-350 transition-all"
            >
              {angleMode}
            </button>
            <div className="w-10 h-3 bg-neutral-400 rounded-sm border border-neutral-500 shadow-inner flex justify-around items-center">
              <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
              <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
              <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
            </div>
          </div>
        </div>

        {/* Display — expression on top, live result on bottom */}
        <div className="relative mb-4 bg-[#cbd8ca] border-2 border-[#b0bdae] p-3 rounded-lg shadow-inner flex flex-col items-end justify-center min-h-[80px] overflow-hidden select-none">
          {/* Top-left status indicators */}
          <div className="absolute left-2 top-1 text-[8px] font-bold text-[#4c5c4a] font-mono flex gap-2">
            <span>{angleMode}</span>
            {memory !== 0 && <span>M</span>}
            {isInv && <span className="text-amber-800">INV</span>}
            {ans !== null && <span>Ans</span>}
          </div>

          {/* Expression line (small) */}
          <div className="w-full text-right font-mono font-bold text-[#4c5c4a] text-[11px] sm:text-xs break-all whitespace-pre-wrap max-h-[24px] overflow-hidden leading-tight mt-3">
            {displayExpr}
          </div>

          {/* Live result / main display (large) */}
          <div className="w-full text-right mt-1 font-mono font-black text-[#1a2019] text-2xl sm:text-3xl break-all">
            {bottomDisplay}
          </div>
        </div>

        <div className="text-[9px] text-center font-mono text-neutral-400 mb-2">⌨ Keyboard enabled · Type expressions like √(8)×2</div>

        {/* Memory & Mode Row */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          <button onClick={() => setMemory(memory + (preview?.val ?? 0))} className={bSci}>M+</button>
          <button onClick={() => setMemory(memory - (preview?.val ?? 0))} className={bSci}>M−</button>
          <button onClick={() => ans !== null && append(formatNumberForDisplay(ans))} className={bSci}>Ans</button>
          <button onClick={() => setMemory(0)} className={bSci}>MC</button>
          <button onClick={() => setIsInv(!isInv)} className={`${bSci} ${isInv ? 'bg-amber-200 border-amber-400' : ''}`}>INV</button>
        </div>

        {/* Trig row */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          <button onClick={() => appendFn(isInv ? 'asin' : 'sin')} className={bSci}>{isInv ? 'sin⁻¹' : 'sin'}</button>
          <button onClick={() => appendFn(isInv ? 'acos' : 'cos')} className={bSci}>{isInv ? 'cos⁻¹' : 'cos'}</button>
          <button onClick={() => appendFn(isInv ? 'atan' : 'tan')} className={bSci}>{isInv ? 'tan⁻¹' : 'tan'}</button>
          <button onClick={() => appendFn(isInv ? 'exp' : 'ln')} className={bSci}>{isInv ? 'eˣ' : 'ln'}</button>
          <button onClick={() => appendFn(isInv ? 'tenx' : 'log')} className={bSci}>{isInv ? '10ˣ' : 'log'}</button>
        </div>

        {/* Power/root row */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          <button onClick={() => appendFn('sqrt')} className={bSci}>√</button>
          <button onClick={() => appendFn('cbrt')} className={bSci}>∛</button>
          <button onClick={() => appendFn('sq')} className={bSci}>x²</button>
          <button onClick={() => appendFn('cu')} className={bSci}>x³</button>
          <button onClick={() => append('^')} className={bSci}>xʸ</button>
        </div>

        {/* Misc row */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          <button onClick={() => appendFn('fact')} className={bSci}>n!</button>
          <button onClick={() => appendFn('inv')} className={bSci}>1/x</button>
          <button onClick={() => appendFn('abs')} className={bSci}>|x|</button>
          <button onClick={() => append('pi')} className={bSci}>π</button>
          <button onClick={() => append('e')} className={bSci}>e</button>
        </div>

        {/* Standard Keys */}
        <div className="grid grid-cols-5 gap-1.5 mt-1">
          <button onClick={clearEntry} className="h-10 text-xs font-extrabold bg-[#cc6666] text-white rounded shadow border border-red-800 active:scale-95 transition-all">CE</button>
          <button onClick={clearAll} className="h-10 text-xs font-extrabold bg-[#cc6666] text-white rounded shadow border border-red-800 active:scale-95 transition-all">AC</button>
          <button onClick={backspace} className="h-10 text-xs font-extrabold bg-neutral-400 text-neutral-900 rounded shadow border border-neutral-500 active:scale-95 transition-all flex items-center justify-center">
            <Delete className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => append('mod')} className={bOp}>mod</button>
          <button onClick={() => append('/')} className={bOp}>÷</button>

          <button onClick={() => appendNumber('7')} className={bNum}>7</button>
          <button onClick={() => appendNumber('8')} className={bNum}>8</button>
          <button onClick={() => appendNumber('9')} className={bNum}>9</button>
          <button onClick={() => append('*')} className={bOp}>×</button>
          <button onClick={() => append('-')} className={bOp}>−</button>

          <button onClick={() => appendNumber('4')} className={bNum}>4</button>
          <button onClick={() => appendNumber('5')} className={bNum}>5</button>
          <button onClick={() => appendNumber('6')} className={bNum}>6</button>
          <button onClick={() => append('+')} className={bOp}>+</button>
          <button onClick={() => append('(')} className={bOp}>(</button>

          <button onClick={() => appendNumber('1')} className={bNum}>1</button>
          <button onClick={() => appendNumber('2')} className={bNum}>2</button>
          <button onClick={() => appendNumber('3')} className={bNum}>3</button>
          <button onClick={() => append(')')} className={bOp}>)</button>
          <button onClick={appendPercent} className={bOp}>%</button>

          <button onClick={() => appendNumber('0')} className={`${bNum} col-span-2`}>0</button>
          <button onClick={appendDot} className={bNum}>.</button>
          <button onClick={toggleSign} className={bOp}>+/−</button>
          <button onClick={() => append('!')} className={bOp}>!</button>
        </div>

        <button onClick={equals} className="mt-1.5 h-10 w-full text-base font-extrabold bg-[#dfaa44] text-neutral-900 rounded-lg shadow border border-[#be8b32] active:scale-95 hover:bg-[#e5b44e] transition-all">=</button>
      </div>
    </div>
  )
}
