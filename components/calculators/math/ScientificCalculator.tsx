'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Delete } from 'lucide-react'
import { useKeyboardInput } from '@/hooks/useKeyboardInput'
import {
  tokenize,
  evaluate,
  balanceParens,
  formatNumberForDisplay,
  prettifyExpr,
  type AngleMode,
} from '@/lib/scientific-engine'

/* =========================================================================
   EXPRESSION-BASED SCIENTIFIC CALCULATOR
   Behaves like a real scientific calculator (TI/Casio style):
     - User builds an expression by pressing keys:  √(8) × 2 =
     - The display shows the expression as it is being built
     - Pressing = parses and evaluates the full expression
   The math engine lives in @/lib/scientific-engine and is shared with the
   hero Casio-style calculator so both behave identically.
   ========================================================================= */

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
    const balanced = balanceParens(e)
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
    const balanced = balanceParens(e)
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
          <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono">HoC SCIENTIFIC</span>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
              className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold hover:bg-neutral-350 transition-all"
            >
              {angleMode}
            </button>
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
          <button onClick={clearEntry} className="h-10 text-xs font-extrabold bg-[#ab3232] text-white rounded shadow border border-red-800 active:scale-95 transition-all">CE</button>
          <button onClick={clearAll} className="h-10 text-xs font-extrabold bg-[#ab3232] text-white rounded shadow border border-red-800 active:scale-95 transition-all">AC</button>
          <button onClick={backspace} aria-label="Backspace" className="h-10 text-xs font-extrabold bg-neutral-400 text-neutral-900 rounded shadow border border-neutral-500 active:scale-95 transition-all flex items-center justify-center">
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
