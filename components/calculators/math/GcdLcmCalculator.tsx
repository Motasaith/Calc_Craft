'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react'

type InputMode = 'rows' | 'text'

interface NumberRow {
  id: string
  val: string
}

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return Math.abs(a * b) / gcd(a, b)
}

function getPrimeFactors(n: number): number[] {
  const factors: number[] = []
  let d = 2
  let temp = n
  while (temp > 1) {
    while (temp % d === 0) {
      factors.push(d)
      temp /= d
    }
    d++
    if (d * d > temp) {
      if (temp > 1) {
        factors.push(temp)
        break
      }
    }
  }
  return factors
}

function formatPrimeFactorization(factors: number[]): string {
  if (factors.length === 0) return 'None'
  const counts: Record<number, number> = {}
  factors.forEach(f => {
    counts[f] = (counts[f] || 0) + 1
  })
  return Object.keys(counts)
    .map(Number)
    .sort((a, b) => a - b)
    .map(f => (counts[f] > 1 ? `${f}^${counts[f]}` : `${f}`))
    .join(' × ')
}

export default function GcdLcmCalculator() {
  const [inputMode, setInputMode] = useState<InputMode>('rows')

  // Mode 1: dynamic rows
  const [rows, setRows] = useState<NumberRow[]>([
    { id: '1', val: '12' },
    { id: '2', val: '18' }
  ])

  // Mode 2: text string
  const [textInput, setTextInput] = useState('12, 18, 24')

  const addRow = () => {
    const nextId = (Math.max(...rows.map(r => parseInt(r.id) || 0)) + 1).toString()
    setRows([...rows, { id: nextId, val: '' }])
  }

  const removeRow = (id: string) => {
    if (rows.length > 2) {
      setRows(rows.filter(r => r.id !== id))
    }
  }

  const updateRow = (id: string, val: string) => {
    setRows(rows.map(r => (r.id === id ? { ...r, val } : r)))
  }

  const resetRows = () => {
    setRows([
      { id: '1', val: '12' },
      { id: '2', val: '18' }
    ])
  }

  // Calculations
  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      gcdValue: 0,
      lcmValue: 0,
      nums: [] as number[],
      factorizations: [] as { num: number; factors: number[]; formatted: string }[],
      venn: null as { intersection: number[]; onlyA: number[]; onlyB: number[]; numA: number; numB: number } | null
    }

    let nums: number[] = []

    if (inputMode === 'rows') {
      nums = rows
        .map(r => parseInt(r.val))
        .filter(n => !isNaN(n) && Number.isInteger(n) && n > 0)
    } else {
      nums = textInput
        .split(/[,\s]+/)
        .map(n => parseInt(n))
        .filter(n => !isNaN(n) && Number.isInteger(n) && n > 0)
    }

    if (nums.length < 2) {
      return { ...defaultObj, error: 'Please enter at least 2 positive integers.' }
    }

    let g = nums[0]
    let l = nums[0]

    for (let i = 1; i < nums.length; i++) {
      g = gcd(g, nums[i])
      l = lcm(l, nums[i])
    }

    if (!isFinite(l) || l > 999999999999) {
      return { ...defaultObj, error: 'The LCM value is too large to compute safely.' }
    }

    // Generate prime factors for each number
    const factorizations = nums.map(n => {
      const factors = getPrimeFactors(n)
      return {
        num: n,
        factors,
        formatted: formatPrimeFactorization(factors)
      }
    })

    // If exactly 2 numbers, calculate Venn intersections of prime factors
    let venn = null
    if (nums.length === 2) {
      const aFactors = getPrimeFactors(nums[0])
      const bFactors = getPrimeFactors(nums[1])

      const countA: Record<number, number> = {}
      const countB: Record<number, number> = {}
      aFactors.forEach(x => (countA[x] = (countA[x] || 0) + 1))
      bFactors.forEach(x => (countB[x] = (countB[x] || 0) + 1))

      const allPrimes = Array.from(new Set([...aFactors, ...bFactors]))
      const intersection: number[] = []
      const onlyA: number[] = []
      const onlyB: number[] = []

      allPrimes.forEach(p => {
        const cA = countA[p] || 0
        const cB = countB[p] || 0
        const common = Math.min(cA, cB)
        for (let i = 0; i < common; i++) intersection.push(p)
        for (let i = 0; i < cA - common; i++) onlyA.push(p)
        for (let i = 0; i < cB - common; i++) onlyB.push(p)
      })

      venn = {
        intersection,
        onlyA,
        onlyB,
        numA: nums[0],
        numB: nums[1]
      }
    }

    return {
      error: null,
      gcdValue: g,
      lcmValue: l,
      nums,
      factorizations,
      venn
    }
  }, [rows, textInput, inputMode])

  return (
    <FormCalculatorShell title="GCD & LCM Calculator" subtitle="Find the Greatest Common Divisor and Least Common Multiple" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200 p-1">
            <button
              onClick={() => setInputMode('rows')}
              className={`py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                inputMode === 'rows' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              List Rows
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                inputMode === 'text' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Comma Separated
            </button>
          </div>

          {/* Mode 1: Rows */}
          {inputMode === 'rows' && (
            <div className="space-y-3">
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {rows.map((row, idx) => (
                  <div key={row.id} className="flex gap-2 items-center">
                    <RetroInput
                      label={`Number ${idx + 1}`}
                      value={row.val}
                      onChange={(v) => updateRow(row.id, v)}
                      placeholder="e.g. 12"
                      id={`gcd-r-${row.id}`}
                    />
                    {rows.length > 2 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="mt-6 p-2 bg-neutral-200 text-neutral-500 hover:text-red-650 hover:bg-neutral-300 rounded-lg border border-neutral-350 transition"
                        title="Remove Number"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={addRow}
                  className="flex-grow h-10 flex items-center justify-center gap-1.5 text-xs font-extrabold font-mono rounded-lg border-2 border-dashed border-neutral-400 text-neutral-600 hover:text-neutral-800 transition"
                >
                  <Plus className="w-4 h-4" /> Add Number
                </button>
                <button
                  onClick={resetRows}
                  className="h-10 px-3 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 border border-neutral-350 rounded-lg transition"
                >
                  <RefreshCw className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          )}

          {/* Mode 2: Comma Separated */}
          {inputMode === 'text' && (
            <div className="space-y-1">
              <label htmlFor="gcd-raw" className="block text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider">Number String</label>
              <textarea
                id="gcd-raw"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g. 12, 18, 24"
                rows={3}
                className="w-full px-3 py-2 bg-white border border-neutral-350 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-neutral-500 shadow-inner resize-none"
              />
              <span className="text-[10px] text-neutral-500 font-mono">Use commas, spaces, or newlines to separate numbers.</span>
            </div>
          )}
        </div>

        {/* ── Right Column: Results ── */}
        <div className="min-h-[440px]">
          {results && !results.error ? (
            <div className="space-y-4">
              
              {/* Primary Results */}
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Greatest Common Divisor (GCD)" value={results.gcdValue.toString()} large />
                <ResultDisplay label="Least Common Multiple (LCM)" value={results.lcmValue.toString()} large />
              </div>

              {/* Venn Diagram Visual (if exactly 2 numbers) */}
              {results.venn && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">
                    Prime Factors Intersection Venn Diagram
                  </p>
                  <svg viewBox="0 0 280 140" className="w-64 h-32" role="img" aria-label="A Venn diagram showing prime factors intersection representing the GCD.">
                    {/* Circle A */}
                    <circle cx="110" cy="70" r="55" fill="#8ab4a0" opacity="0.6" stroke="#4c5c4a" strokeWidth="2" />
                    {/* Circle B */}
                    <circle cx="170" cy="70" r="55" fill="#dfaa44" opacity="0.6" stroke="#be8b32" strokeWidth="2" />

                    {/* Circle Labels */}
                    <text x="75" y="30" fontSize="9" fontWeight="bold" fill="#4c5c4a" fontFamily="monospace">{results.venn.numA}</text>
                    <text x="205" y="30" fontSize="9" fontWeight="bold" fill="#be8b32" fontFamily="monospace">{results.venn.numB}</text>

                    {/* Factors unique to A (left) */}
                    <text x="85" y="75" fontSize="10" fontWeight="bold" fill="#1f2937" fontFamily="monospace" textAnchor="middle">
                      {results.venn.onlyA.join(', ') || '—'}
                    </text>
                    
                    {/* Intersection factors (middle) */}
                    <text x="140" y="75" fontSize="10" fontWeight="bold" fill="#1f2937" fontFamily="monospace" textAnchor="middle">
                      {results.venn.intersection.join(', ') || '—'}
                    </text>

                    {/* Factors unique to B (right) */}
                    <text x="195" y="75" fontSize="10" fontWeight="bold" fill="#1f2937" fontFamily="monospace" textAnchor="middle">
                      {results.venn.onlyB.join(', ') || '—'}
                    </text>
                  </svg>
                  <span className="text-[9px] text-neutral-500 font-mono mt-1">Shared Prime Factors (overlap) product = GCD ({results.gcdValue})</span>
                </div>
              )}

              {/* Prime Factorizations Table */}
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Prime Factorizations
                </p>
                <div className="divide-y divide-neutral-200">
                  {results.factorizations.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center text-xs font-mono">
                      <span className="font-extrabold text-neutral-700">{item.num}</span>
                      <span className="font-bold text-neutral-800">{item.formatted}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results?.error || 'Enter at least two numbers to compute GCD and LCM.'}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
