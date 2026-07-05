'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

function factorial(n: number): number {
  if (n < 0) return NaN
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

export default function CombinationWithRepetitionCalculator() {
  const [nVal, setN] = useState('5')
  const [rVal, setR] = useState('3')

  const n = parseInt(nVal, 10), r = parseInt(rVal, 10)
  const valid = !isNaN(n) && !isNaN(r) && n >= 0 && r >= 0
  // C(n+r-1, r)
  const top = n + r - 1
  const result = valid ? factorial(top) / (factorial(r) * factorial(n - 1)) : 0
  const ok = valid && isFinite(result)

  return (
    <FormCalculatorShell title="Combinations w/ Repetition" subtitle="C(n+r−1, r)" badge="MATH">
      <div className="text-[10px] font-mono text-neutral-500 mb-2">Choose r from n types, with repetition allowed</div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="n (types)" value={nVal} onChange={setN} id="cr-n" />
        <RetroInput label="r (chosen)" value={rVal} onChange={setR} id="cr-r" />
      </div>
      {ok && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`C(${n + r - 1},${r}) =`} value={result.toFixed(0)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Selection</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="crGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#crGrid)" rx="8" />
              {Array.from({ length: Math.min(8, n) }).map((_, idx) => (
                <circle key={idx} cx={30 + idx * 18} cy="35" r="6" fill="none" stroke="#6b7280" strokeWidth="1.5" />
              ))}
              {Array.from({ length: Math.min(6, r) }).map((_, idx) => (
                <path key={idx} d={wobblyBar(30 + idx * 18, 55, 10, 8)} fill="#dfaa44" fillOpacity="0.7" stroke="#be8b32" strokeWidth="1" />
              ))}
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">{result.toFixed(0)} ways</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}