'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Activity,
  DollarSign,
  Delete,
  ChevronLeft,
  ChevronRight,
  Calculator,
} from 'lucide-react'
import DigitalText from './DigitalText'
import { useKeyboardInput, createStandardKeyMap } from '@/hooks/useKeyboardInput'
import { calculateBMI, calculateEMI, formatCurrency } from '@/lib/calc-engine'
import Link from 'next/link'
import { CalculatorEntry, CATEGORY_LABELS } from '@/lib/calculators'
import CompoundInterestCalculator from './calculators/finance/CompoundInterestCalculator'

// ==========================================
// CALCULATOR 1: RETRO SCIENTIFIC CALCULATOR
// ==========================================
function ScientificCalculator() {
  const [expr, setExpr] = useState('')
  const [ans, setAns] = useState<number | null>(null)
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG')
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

  const appendFn = (name: string) => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return `${name}( `
      return cur + `${name}( `
    })
    setPreview(null)
  }

  const appendNumber = (n: string) => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return n
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
    let balanced = e
    const openCount = (balanced.match(/\(/g) || []).length
    const closeCount = (balanced.match(/\)/g) || []).length
    for (let i = 0; i < openCount - closeCount; i++) balanced += ')'
    try {
      // eslint-disable-next-line no-eval
      const v = eval(balanced.replace(/\^/g, '**').replace(/mod/g, '%').replace(/sin\(/g, `Math.sin(${angleMode === 'DEG' ? 'Math.PI/180*' : ''}`).replace(/cos\(/g, `Math.cos(${angleMode === 'DEG' ? 'Math.PI/180*' : ''}`).replace(/tan\(/g, `Math.tan(${angleMode === 'DEG' ? 'Math.PI/180*' : ''}`).replace(/asin\(/g, `${angleMode === 'DEG' ? '180/Math.PI*' : ''}Math.asin(`).replace(/acos\(/g, `${angleMode === 'DEG' ? '180/Math.PI*' : ''}Math.acos(`).replace(/atan\(/g, `${angleMode === 'DEG' ? '180/Math.PI*' : ''}Math.atan(`).replace(/sqrt\(/g, 'Math.sqrt(').replace(/cbrt\(/g, 'Math.cbrt(').replace(/sq\(/g, '((').replace(/cu\(/g, '((').replace(/ln\(/g, 'Math.log(').replace(/log\(/g, 'Math.log10(').replace(/exp\(/g, 'Math.exp(').replace(/tenx\(/g, '(10**').replace(/abs\(/g, 'Math.abs(').replace(/inv\(/g, '(1/').replace(/floor\(/g, 'Math.floor(').replace(/ceil\(/g, 'Math.ceil(').replace(/round\(/g, 'Math.round(').replace(/neg\(/g, '(-').replace(/fact\(/g, 'factorial(').replace(/\bpi\b/g, 'Math.PI').replace(/\be\b/g, 'Math.E'))
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

  const evaluateCurrent = useCallback((): number | null => {
    const e = exprRef.current
    if (!e.trim()) return null
    let balanced = e
    const openCount = (balanced.match(/\(/g) || []).length
    const closeCount = (balanced.match(/\)/g) || []).length
    for (let i = 0; i < openCount - closeCount; i++) balanced += ')'
    try {
      // eslint-disable-next-line no-eval
      const v = eval(balanced.replace(/\^/g, '**').replace(/mod/g, '%').replace(/sin\(/g, `Math.sin(${angleMode === 'DEG' ? 'Math.PI/180*' : ''}`).replace(/cos\(/g, `Math.cos(${angleMode === 'DEG' ? 'Math.PI/180*' : ''}`).replace(/tan\(/g, `Math.tan(${angleMode === 'DEG' ? 'Math.PI/180*' : ''}`).replace(/asin\(/g, `${angleMode === 'DEG' ? '180/Math.PI*' : ''}Math.asin(`).replace(/acos\(/g, `${angleMode === 'DEG' ? '180/Math.PI*' : ''}Math.acos(`).replace(/atan\(/g, `${angleMode === 'DEG' ? '180/Math.PI*' : ''}Math.atan(`).replace(/sqrt\(/g, 'Math.sqrt(').replace(/cbrt\(/g, 'Math.cbrt(').replace(/sq\(/g, '((').replace(/cu\(/g, '((').replace(/ln\(/g, 'Math.log(').replace(/log\(/g, 'Math.log10(').replace(/exp\(/g, 'Math.exp(').replace(/tenx\(/g, '(10**').replace(/abs\(/g, 'Math.abs(').replace(/inv\(/g, '(1/').replace(/floor\(/g, 'Math.floor(').replace(/ceil\(/g, 'Math.ceil(').replace(/round\(/g, 'Math.round(').replace(/neg\(/g, '(-').replace(/fact\(/g, 'factorial(').replace(/\bpi\b/g, 'Math.PI').replace(/\be\b/g, 'Math.E'))
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

  function factorial(n: number): number {
    if (n < 0 || n > 170 || !Number.isInteger(n)) return NaN
    let r = 1
    for (let i = 2; i <= n; i++) r *= i
    return r
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

  function prettifyExpr(raw: string): string {
    if (!raw) return ''
    let s = raw
      .replace(/\bpi\b/g, 'π')
      .replace(/\bmod\b/g, ' mod ')
      .replace(/sqrt\(/g, '√(')
      .replace(/cbrt\(/g, '∛(')
      .replace(/exp\(/g, 'e^(')
      .replace(/tenx\(/g, '10^(')
      .replace(/inv\(/g, '1/(')
      .replace(/abs\(/g, '|−(')
      .replace(/sq\(([^()]*)\)/g, '($1)²')
      .replace(/cu\(([^()]*)\)/g, '($1)³')
      .replace(/fact\(([^()]*)\)/g, '($1)!')
      .replace(/floor\(([^()]*)\)/g, '⌊$1⌋')
      .replace(/ceil\(([^()]*)\)/g, '⌈$1⌉')
      .replace(/round\(([^()]*)\)/g, '[$1]')
      .replace(/neg\(([^()]*)\)/g, '−($1)')
    s = s.replace(/\|−\(([^()]*)\)\|/g, '|$1|')
    return s
  }

  const displayExpr = expr === '' ? '0' : (expr === 'ERROR' || expr === 'Ans' ? expr : prettifyExpr(expr))
  const bottomDisplay = preview
    ? formatNumberForDisplay(preview.val)
    : expr === 'ERROR'
      ? 'ERROR'
      : expr
        ? '0'
        : '0'

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

  const bSci = "h-8 text-[10px] font-bold bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all font-mono"
  const bNum = "h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 hover:bg-neutral-100 transition-all"
  const bOp = "h-8 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 hover:bg-[#c2cbc0] transition-all"

  return (
    <div className="flex flex-col h-full bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-2 py-2.5 shadow-inner text-neutral-800">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold tracking-wider text-neutral-600 font-mono">HoC SCIENTIFIC</span>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
            className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold hover:bg-neutral-350 transition-all"
          >
            {angleMode}
          </button>
        </div>
      </div>

      {/* Screen Display — expression on top, live result on bottom */}
      <div className="relative mb-3 bg-[#cbd8ca] border-2 border-[#b0bdae] p-3.5 rounded shadow-inner flex flex-col items-end justify-center min-h-[100px] select-none">
        <div className="absolute left-2 top-1 text-[8px] font-bold text-[#4c5c4a] font-mono flex gap-2">
          <span>{angleMode}</span>
          {memory !== 0 && <span>M</span>}
          {isInv && <span className="text-amber-800">INV</span>}
          {ans !== null && <span>Ans</span>}
        </div>

        {/* Expression line */}
        <div className="w-full text-right font-mono font-bold text-[#4c5c4a] text-base sm:text-lg break-all whitespace-pre-wrap leading-snug mt-4 pr-1">
          {displayExpr}
        </div>

        {/* Live result / main display (large) */}
        <div className="w-full text-right mt-1 font-mono font-black text-[#1a2019] text-3xl sm:text-4xl break-all">
          {bottomDisplay}
        </div>
      </div>

      {/* Memory & Mode Row */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <button onClick={() => setMemory(memory + (preview?.val ?? 0))} className={bSci}>M+</button>
        <button onClick={() => setMemory(memory - (preview?.val ?? 0))} className={bSci}>M−</button>
        <button onClick={() => ans !== null && append(formatNumberForDisplay(ans))} className={bSci}>Ans</button>
        <button onClick={() => setMemory(0)} className={bSci}>MC</button>
        <button onClick={() => setIsInv(!isInv)} className={`${bSci} ${isInv ? 'bg-amber-200 border-amber-400' : ''}`}>INV</button>
      </div>

      {/* Trig row */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <button onClick={() => appendFn(isInv ? 'asin' : 'sin')} className={bSci}>{isInv ? 'sin⁻¹' : 'sin'}</button>
        <button onClick={() => appendFn(isInv ? 'acos' : 'cos')} className={bSci}>{isInv ? 'cos⁻¹' : 'cos'}</button>
        <button onClick={() => appendFn(isInv ? 'atan' : 'tan')} className={bSci}>{isInv ? 'tan⁻¹' : 'tan'}</button>
        <button onClick={() => appendFn(isInv ? 'exp' : 'ln')} className={bSci}>{isInv ? 'eˣ' : 'ln'}</button>
        <button onClick={() => appendFn(isInv ? 'tenx' : 'log')} className={bSci}>{isInv ? '10ˣ' : 'log'}</button>
      </div>

      {/* Power/root row */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <button onClick={() => appendFn('sqrt')} className={bSci}>√</button>
        <button onClick={() => appendFn('cbrt')} className={bSci}>∛</button>
        <button onClick={() => appendFn('sq')} className={bSci}>x²</button>
        <button onClick={() => appendFn('cu')} className={bSci}>x³</button>
        <button onClick={() => append('^')} className={bSci}>xʸ</button>
      </div>

      {/* Misc row */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        <button onClick={() => appendFn('fact')} className={bSci}>n!</button>
        <button onClick={() => appendFn('inv')} className={bSci}>1/x</button>
        <button onClick={() => appendFn('abs')} className={bSci}>|x|</button>
        <button onClick={() => append('pi')} className={bSci}>π</button>
        <button onClick={() => append('e')} className={bSci}>e</button>
      </div>

      {/* Standard Keys */}
      <div className="grid grid-cols-5 gap-1 mt-1">
        <button onClick={() => setExpr((cur) => cur === 'ERROR' || cur === 'Ans' ? '' : cur.replace(/[0-9.]+$/, '').replace(/(pi|e)$/, ''))} className="min-h-[44px] text-xs font-extrabold bg-[#ab3232] text-white rounded shadow border border-red-800 active:scale-95 transition-all">CE</button>
        <button onClick={clearAll} className="min-h-[44px] text-xs font-extrabold bg-[#ab3232] text-white rounded shadow border border-red-800 active:scale-95 transition-all">AC</button>
        <button onClick={backspace} aria-label="Backspace" className="min-h-[44px] text-xs font-extrabold bg-neutral-400 text-neutral-900 rounded shadow border border-neutral-500 active:scale-95 transition-all flex items-center justify-center">
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

      <button onClick={equals} className="mt-1 h-8 w-full text-sm font-extrabold bg-[#dfaa44] text-neutral-900 rounded shadow border border-[#be8b32] active:scale-95 hover:bg-[#e5b44e] transition-all">=</button>
    </div>
  )
}

// ==========================================
// CALCULATOR 3: RETRO BMI CALCULATOR (form-based with number inputs)
// ==========================================
function BMICalculator() {
  const [unit, setUnit] = useState('metric')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('170')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('10')
  const [lbs, setLbs] = useState('160')

  const calculate = (): { bmi: number; category: string } | null => {
    if (unit === 'metric') {
      const w = parseFloat(weight), h = parseFloat(height)
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null
      if (h < 50 || h > 280) return null
      if (w < 2 || w > 650) return null
      const bmi = calculateBMI(w, h)
      return { bmi, category: getCategory(bmi) }
    } else {
      const f = parseFloat(feet), i = parseFloat(inches || '0'), w = parseFloat(lbs)
      if (isNaN(f) || isNaN(w) || f <= 0 || w <= 0) return null
      const totalInches = f * 12 + (isNaN(i) ? 0 : i)
      if (totalInches < 20 || totalInches > 110) return null
      if (w < 5 || w > 1400) return null
      const bmi = calculateBMI(w * 0.453592, totalInches * 2.54)
      return { bmi, category: getCategory(bmi) }
    }
  }

  const getCategory = (bmi: number) => {
    if (bmi < 16) return 'Severe Underweight'
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Overweight'
    if (bmi < 35) return 'Obese (Class I)'
    if (bmi < 40) return 'Obese (Class II)'
    return 'Obese (Class III)'
  }

  const result = calculate()

  return (
    <div className="flex flex-col h-full bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-inner text-neutral-800">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold tracking-wider text-neutral-600 font-mono flex items-center gap-1">
          <Activity className="w-4 h-4 text-neutral-700" />
          HoC FITNESS
        </span>
        <span className="text-[10px] uppercase px-2 py-1 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold">BMI</span>
      </div>

      {/* Unit Toggle */}
      <div className="flex gap-1 mb-3 bg-neutral-200 p-1 rounded border border-neutral-300">
        <button onClick={() => setUnit('metric')}
          className={`flex-1 py-1.5 text-[11px] font-bold font-mono rounded transition-all ${unit === 'metric' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-600'}`}
        >Metric (kg/cm)</button>
        <button onClick={() => setUnit('imperial')}
          className={`flex-1 py-1.5 text-[11px] font-bold font-mono rounded transition-all ${unit === 'imperial' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-600'}`}
        >Imperial (lbs/ft)</button>
      </div>

      {/* Form-style number inputs */}
      {unit === 'metric' ? (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 font-mono uppercase tracking-wider mb-1">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70"
              min="2" max="650" step="0.1"
              className="w-full h-11 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 shadow-inner" />
            <p className="text-[10px] text-neutral-600 font-mono mt-1 leading-tight">Enter 2–650 kg</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 font-mono uppercase tracking-wider mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 170"
              min="50" max="280" step="0.1"
              className="w-full h-11 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 shadow-inner" />
            <p className="text-[10px] text-neutral-600 font-mono mt-1 leading-tight">Enter 50–280 cm</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 font-mono uppercase tracking-wider mb-1">Feet</label>
            <input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} placeholder="e.g. 5"
              min="1" max="8" step="1"
              className="w-full h-11 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 shadow-inner" />
            <p className="text-[10px] text-neutral-600 font-mono mt-1 leading-tight">Enter 1–8 ft</p>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 font-mono uppercase tracking-wider mb-1">Inches</label>
            <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} placeholder="e.g. 10"
              min="0" max="11" step="1"
              className="w-full h-11 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 shadow-inner" />
            <p className="text-[10px] text-neutral-600 font-mono mt-1 leading-tight">Enter 0–11 in</p>
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-bold text-neutral-700 font-mono uppercase tracking-wider mb-1">Weight (lbs)</label>
            <input type="number" value={lbs} onChange={(e) => setLbs(e.target.value)} placeholder="e.g. 160"
              min="5" max="1400" step="0.1"
              className="w-full h-11 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 shadow-inner" />
            <p className="text-[10px] text-neutral-600 font-mono mt-1 leading-tight">Enter 5–1400 lbs</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <>
          <div className="mb-3 bg-[#cbd8ca] border-2 border-[#b0bdae] rounded p-3 shadow-inner flex flex-col items-center">
            <span className="text-[11px] font-bold text-[#384536] font-mono uppercase mb-1">Your BMI</span>
            <div className="flex items-center">
              <DigitalText text={result.bmi.toFixed(1)} theme="lcd" size={32} gap={2} animate={false} activeColor="#1a2019" inactiveColor="#b8c6b6" />
              <span className="text-sm font-bold text-[#384536] font-mono ml-1.5">kg/m²</span>
            </div>
            <span className="text-sm font-mono font-bold text-[#1a2019] mt-1">{result.category}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <div className={`text-[10px] font-bold text-center py-1.5 rounded border font-mono ${result.bmi < 18.5 ? 'bg-neutral-800 text-white border-neutral-800' : 'bg-neutral-200 text-neutral-600 border-neutral-300'}`}>UNDER</div>
            <div className={`text-[10px] font-bold text-center py-1.5 rounded border font-mono ${result.bmi >= 18.5 && result.bmi < 25 ? 'bg-neutral-800 text-white border-neutral-800' : 'bg-neutral-200 text-neutral-600 border-neutral-300'}`}>NORMAL</div>
            <div className={`text-[10px] font-bold text-center py-1.5 rounded border font-mono ${result.bmi >= 25 && result.bmi < 30 ? 'bg-neutral-800 text-white border-neutral-800' : 'bg-neutral-200 text-neutral-600 border-neutral-300'}`}>OVER</div>
            <div className={`text-[10px] font-bold text-center py-1.5 rounded border font-mono ${result.bmi >= 30 ? 'bg-neutral-800 text-white border-neutral-800' : 'bg-neutral-200 text-neutral-600 border-neutral-300'}`}>OBESE</div>
          </div>
        </>
      )}
    </div>
  )
}

// ==========================================
// CALCULATOR 4: RETRO EMI LOAN CALCULATOR (form-based with number inputs)
// ==========================================
function LoanCalculator() {
  const [principal, setPrincipal] = useState('100000')
  const [rate, setRate] = useState('7.5')
  const [tenure, setTenure] = useState('15')

  const P = parseFloat(principal) || 0
  const R = (parseFloat(rate) || 0) / 12 / 100
  const N = (parseFloat(tenure) || 0) * 12

  const emi = R > 0 ? (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1) : P / N
  const totalPayment = emi * N
  const totalInterest = totalPayment - P

  const emiStr = Math.round(emi).toString()
  const interestStr = Math.round(totalInterest).toString()

  const getDigitSize = (valStr: string) => {
    const len = valStr.length
    if (len <= 5) return 24
    if (len === 6) return 22
    if (len === 7) return 18
    return 15
  }

  return (
    <div className="flex flex-col h-full bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-inner text-neutral-800">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-600 font-mono flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-neutral-700" />
          HoC PLANNER
        </span>
        <span className="text-[8px] uppercase px-1.5 py-0.5 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold">EMI</span>
      </div>

      {/* LCD Results Displays */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-neutral-200 border border-neutral-300 p-1.5 rounded flex flex-col justify-center items-center">
          <span className="text-[7.5px] font-bold text-neutral-600 uppercase tracking-wider mb-1">Monthly EMI</span>
          <div className="relative bg-[#cbd8ca] border border-[#b0bdae] rounded px-1.5 py-1 w-full flex justify-center items-center h-8 select-none">
            <span className="absolute left-1 text-[8px] font-bold text-[#384536] font-mono">$</span>
            <DigitalText text={emiStr} theme="lcd" size={getDigitSize(emiStr)} gap={1} animate={false} activeColor="#1a2019" inactiveColor="#b8c6b6" />
          </div>
        </div>
        <div className="bg-neutral-200 border border-neutral-300 p-1.5 rounded flex flex-col justify-center items-center">
          <span className="text-[7.5px] font-bold text-neutral-600 uppercase tracking-wider mb-1">Total Interest</span>
          <div className="relative bg-[#cbd8ca] border border-[#b0bdae] rounded px-1.5 py-1 w-full flex justify-center items-center h-8 select-none">
            <span className="absolute left-1 text-[8px] font-bold text-[#384536] font-mono">$</span>
            <DigitalText text={interestStr} theme="lcd" size={getDigitSize(interestStr)} gap={1} animate={false} activeColor="#1a2019" inactiveColor="#b8c6b6" />
          </div>
        </div>
      </div>

      {/* Form-style number inputs with helper labels */}
      <div className="flex flex-col gap-2.5 flex-grow px-1">
        <div>
          <label className="block text-[9px] font-bold text-neutral-700 font-mono uppercase tracking-wider mb-0.5">Loan Amount ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g. 100000"
            min="1000" max="1000000" step="1000"
            className="w-full h-8 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-xs font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 shadow-inner" />
          <p className="text-[7.5px] text-neutral-600 font-mono mt-0.5 leading-tight">Enter 1,000 – 1,000,000</p>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-neutral-700 font-mono uppercase tracking-wider mb-0.5">Interest Rate (%)</label>
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 7.5"
            min="0.5" max="30" step="0.1"
            className="w-full h-8 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-xs font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 shadow-inner" />
          <p className="text-[7.5px] text-neutral-600 font-mono mt-0.5 leading-tight">Annual rate, 0.5 – 30%</p>
        </div>
        <div>
          <label className="block text-[9px] font-bold text-neutral-700 font-mono uppercase tracking-wider mb-0.5">Tenure (Years)</label>
          <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} placeholder="e.g. 15"
            min="1" max="30" step="1"
            className="w-full h-8 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-xs font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 shadow-inner" />
          <p className="text-[7.5px] text-neutral-600 font-mono mt-0.5 leading-tight">Loan term, 1 – 30 years</p>
        </div>
      </div>

      {/* Visual breakdown bar */}
      {totalPayment > 0 && (
        <>
          <div className="mt-2 h-3 rounded-full overflow-hidden bg-neutral-200 border border-neutral-300 flex">
            <div className="bg-[#4c5c4a] h-full transition-all" style={{ width: `${(P / totalPayment) * 100}%` }} />
            <div className="bg-[#dfaa44] h-full transition-all" style={{ width: `${(totalInterest / totalPayment) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-[8px] font-mono font-bold text-neutral-600">
            <span>■ Principal ({((P / totalPayment) * 100).toFixed(1)}%)</span>
            <span>■ Interest ({((totalInterest / totalPayment) * 100).toFixed(1)}%)</span>
          </div>
        </>
      )}

      {/* Summary Footer */}
      <div className="mt-2 bg-[#cbd8ca]/80 border border-[#b0bdae] rounded p-1.5 text-center text-[9.5px] font-bold text-[#4c5c4a] font-mono select-none flex justify-center items-center gap-1.5 h-7">
        TOTAL: <span className="text-[#1a2019]">${Math.round(totalPayment).toLocaleString()}</span>
      </div>
    </div>
  )
}

// ==========================================
// PREVIEW CARD: For calculators without interactive retro versions
// ==========================================
function CalculatorPreviewCard({ entry }: { entry: CalculatorEntry }) {
  return (
    <div className="flex flex-col h-full bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-inner text-neutral-800">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono uppercase">
          {CATEGORY_LABELS[entry.category]}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-center px-1">
        <div className="w-14 h-14 rounded-full bg-[#cbd8ca] border-2 border-[#b0bdae] flex items-center justify-center mb-3 shadow-inner">
          <Calculator className="w-7 h-7 text-[#4c5c4a]" />
        </div>
        <h3 className="text-sm font-bold text-neutral-800 mb-1.5 leading-tight">{entry.name}</h3>
        <p className="text-[10px] text-neutral-500 leading-relaxed mb-3">{entry.description}</p>
        
        <div className="grid grid-cols-2 gap-1 w-full mb-3">
          {entry.keywords.slice(0, 4).map((k, i) => (
            <span key={i} className="text-[8px] font-mono text-[#4c5c4a] bg-[#cbd8ca]/50 rounded px-1.5 py-0.5 truncate">
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/calculators/${entry.slug}`}
        className="block w-full text-center py-2 text-[11px] font-bold font-mono bg-[#dfaa44] text-neutral-900 rounded shadow border border-[#be8b32] active:scale-95 transition-transform hover:bg-[#e8b84f]"
      >
        OPEN CALCULATOR →
      </Link>
    </div>
  )
}

// ==========================================
// MAIN COMPONENT: CALCULATOR STACK
// ==========================================
export default function CalculatorStack() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0) // Start with first card active
  const [isMobile, setIsMobile] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1024)
  const [mounted, setMounted] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  // Track responsive screen dimensions
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      setWindowWidth(window.innerWidth)
    }
    handleResize()
    setMounted(true) // Signal that we're now on the client with real values
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Detect active card on scroll for mobile
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const containerCenter = container.scrollLeft + container.clientWidth / 2
    let closestIndex = 0
    let minDistance = Infinity

    const cards = container.children
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement
      const cardCenter = card.offsetLeft + card.clientWidth / 2
      const distance = Math.abs(containerCenter - cardCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = i
      }
    }
    setActiveIndex(closestIndex)
  }

  // Cards layout configurations
  const cards = [
    { name: 'Scientific Calculator', render: <ScientificCalculator /> },
    { name: 'BMI Calculator', render: <BMICalculator /> },
    { name: 'Loan EMI Calculator', render: <LoanCalculator /> },
    { name: 'Compound Interest', render: <CompoundInterestCalculator /> },
  ]

  // Math configurations for fanning out cards (Desktop)
  const getDesktopCardStyle = (index: number) => {
    const defaultRotations = [-12, -4, 4, 12]
    const defaultTranslatesX = [-210, -75, 75, 210]
    const defaultTranslatesY = [18, 3, 3, 18]

    if (activeIndex === null) {
      return {
        rotate: `${defaultRotations[index]}deg`,
        x: `${defaultTranslatesX[index]}px`,
        y: `${defaultTranslatesY[index]}px`,
        scale: 0.95,
        zIndex: index + 10,
        filter: 'brightness(0.95)',
      }
    }

    if (activeIndex === index) {
      return {
        rotate: '0deg',
        x: `${defaultTranslatesX[index]}px`,
        y: '-70px',
        scale: 1.08,
        zIndex: 50,
        filter: 'brightness(1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(99, 102, 241, 0.1)',
      }
    }

    // Unfocused cards separate slightly
    const offsetDirection = index < activeIndex ? -1 : 1
    const xOffset = defaultTranslatesX[index] + offsetDirection * 45
    const rotOffset = defaultRotations[index] + offsetDirection * 4

    return {
      rotate: `${rotOffset}deg`,
      x: `${xOffset}px`,
      y: `${defaultTranslatesY[index] + 15}px`,
      scale: 0.9,
      zIndex: 10 + (index < activeIndex ? index : cards.length - index),
      filter: 'brightness(0.6) blur(0.5px)',
    }
  }

  return (
    <section
      className="relative w-full py-12 sm:py-14 md:py-16 flex flex-col items-center justify-center overflow-hidden"
      aria-label="Interactive calculator stack - Popular free online calculators"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      {/* Decorative floating rings background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-dark-900/5 dark:border-white/5 bg-gradient-to-b from-primary-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full border border-dark-900/10 dark:border-white/5 opacity-50" />
      </div>

      {/* Component Title & Instruction */}
      <div className="text-center mb-10 sm:mb-14 px-4 z-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-900 mb-3 sm:mb-4">
          Popular Calculators
        </h2>
        <p className="text-dark-400 max-w-lg mx-auto mb-2 text-sm leading-relaxed">
          Explore our most used <strong>free online calculators</strong> to save time and simplify your life.
        </p>
        <p className="text-[11px] font-semibold text-primary-600 tracking-wider uppercase bg-primary-50 border border-primary-100 px-3 py-1 rounded-full inline-block mt-2">
          {isMobile
            ? 'Swipe to choose a calculator'
            : 'Hover over any calculator to use it'}
        </p>
      </div>

      {isMobile ? (
        // Mobile Stacked-Overlay Carousel — mirrors Testimonials: center card in front, left/right peeking behind
        <div className="relative w-full max-w-full flex flex-col items-center py-6 px-2 sm:px-4"
          onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].screenX }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const diff = touchStartX.current - e.changedTouches[0].screenX
            const threshold = 50
            if (diff > threshold) {
              setActiveIndex((a) => (a !== null && a < cards.length - 1 ? a + 1 : 0))
            } else if (diff < -threshold) {
              setActiveIndex((a) => (a !== null && a > 0 ? a - 1 : cards.length - 1))
            }
            touchStartX.current = null
          }}
        >
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-[500px] sm:h-[520px] flex items-center justify-center">
            {cards.map((card, i) => {
              const offset = i - (activeIndex ?? 0)
              const isCenter = offset === 0
              const isLeft = offset === -1
              const isRight = offset === 1
              const isVisible = isCenter || isLeft || isRight

              // Translate offset to the side so the adjacent card peeks out from behind the center one.
              // Until mounted, use the default (≥480px) offset so SSR + first client render are identical.
              const translateX = offset * ((mounted && windowWidth < 480) ? 150 : 170)

              return (
                <div
                  key={card.name}
                  onClick={() => !isCenter && setActiveIndex(i)}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${isCenter ? 1 : 0.88})`,
                    zIndex: isCenter ? 30 : 10 + (Math.abs(offset) === 1 ? 1 : 0),
                    opacity: isCenter ? 1 : isVisible ? 0.75 : 0,
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                  className={`
                    absolute left-1/2 top-1/2 transition-all duration-500 ease-out select-none flex-shrink-0 cursor-pointer
                    w-[290px] sm:w-[320px] h-[500px] sm:h-[520px]
                  `}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${cards.length}: ${card.name}`}
                >
                  <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-xl">
                    {card.render}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Prev / Next + Pagination dots — exactly like Testimonials */}
          <div className="flex justify-center items-center gap-4 mt-6 relative z-20">
            <button
              onClick={() => setActiveIndex((a) => (a !== null && a > 0 ? a - 1 : cards.length - 1))}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
              aria-label="Previous calculator"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2 items-center" role="tablist" aria-label="Calculator carousel indicators">
              {cards.map((_, i) => {
                const isActive = (activeIndex ?? 0) === i
                return (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to calculator ${i + 1}`}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 relative after:absolute after:-inset-4 ${isActive ? 'bg-primary-600 w-5 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-slate-300 w-2 hover:bg-slate-400'}`}
                  />
                )
              })}
            </div>

            <button
              onClick={() => setActiveIndex((a) => (a !== null && a < cards.length - 1 ? a + 1 : 0))}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
              aria-label="Next calculator"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        // Desktop Fanned Overlay Cards Layout
        <div
          className="relative w-[880px] h-[580px] mt-10 flex items-center justify-center"
          onMouseLeave={() => setActiveIndex(null)} // Return focus to resting state
        >
          {cards.map((card, i) => {
            const style = getDesktopCardStyle(i)
            const isActive = activeIndex === i
            return (
              <motion.div
                key={card.name}
                className="absolute left-[270px] top-[25px] w-[340px] h-[520px] rounded-2xl origin-bottom transition-all duration-300"
                style={{
                  transform: `translate3d(${style.x}, ${style.y}, 0) rotate(${style.rotate}) scale(${style.scale})`,
                  zIndex: style.zIndex,
                  filter: style.filter,
                  boxShadow: style.boxShadow,
                }}
              >
                {/* Visual card glow border when active */}
                {isActive && (
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary-400 to-indigo-500 opacity-20 blur-md -z-10 animate-pulse-slow" />
                )}

                {/* Card Container wrapper */}
                <div className="w-full h-full relative rounded-2xl overflow-hidden bg-white shadow-xl">
                  {card.render}
                </div>

                {/* Overlay wrapper to capture hover and block child controls when not focused */}
                {!isActive && (
                  <div
                    className="absolute inset-0 z-40 cursor-pointer pointer-events-auto bg-transparent"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => setActiveIndex(i)}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </section>
  )
}
