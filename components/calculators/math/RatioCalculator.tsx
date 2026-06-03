'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t }; return a }

export default function RatioCalculator() {
  const [a, setA] = useState(''); const [b, setB] = useState('')
  const [c, setC] = useState(''); const [d, setD] = useState('')
  const [mode, setMode] = useState<'simplify' | 'solve'>('simplify')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError(''); setResult(null)
    if (mode === 'simplify') {
      const av = parseFloat(a), bv = parseFloat(b)
      if (isNaN(av) || isNaN(bv) || av <= 0 || bv <= 0) { setError('Enter positive numbers'); return }
      const g = gcd(Math.round(av), Math.round(bv))
      setResult(`${Math.round(av) / g} : ${Math.round(bv) / g}`)
    } else {
      const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c)
      if (isNaN(av) || isNaN(bv) || isNaN(cv)) { setError('Enter valid numbers'); return }
      if (av === 0) { setError('First ratio term cannot be 0'); return }
      const dv = (bv * cv) / av
      setResult(`${cv} : ${parseFloat(dv.toFixed(6))}`)
    }
  }

  return (
    <FormCalculatorShell title="Ratio Calculator" badge="MATH">
      <div className="flex gap-1 mb-4 bg-neutral-200 p-1 rounded-lg border border-neutral-300">
        <button onClick={() => { setMode('simplify'); setResult(null) }}
          className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md transition-all ${mode === 'simplify' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>
          Simplify Ratio
        </button>
        <button onClick={() => { setMode('solve'); setResult(null) }}
          className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md transition-all ${mode === 'solve' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>
          Solve Proportion
        </button>
      </div>

      {mode === 'simplify' ? (
        <div className="grid grid-cols-2 gap-3">
          <RetroInput label="First Number" value={a} onChange={setA} placeholder="e.g. 12" id="ratio-a" />
          <RetroInput label="Second Number" value={b} onChange={setB} placeholder="e.g. 8" id="ratio-b" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 items-end">
          <RetroInput label="A" value={a} onChange={setA} placeholder="3" id="ratio-a2" />
          <RetroInput label="B" value={b} onChange={setB} placeholder="4" id="ratio-b2" />
          <RetroInput label="C" value={c} onChange={setC} placeholder="9" id="ratio-c2" />
        </div>
      )}

      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
