'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FactorialCalculator() {
  const [nVal, setN] = useState('5')

  const n = parseInt(nVal, 10)
  const valid = !isNaN(n) && n >= 0 && n <= 170
  let result = 1
  if (valid) {
    for (let i = 2; i <= n; i++) result *= i
  }

  return (
    <FormCalculatorShell title="Factorial Calculator" subtitle="n! = n × (n−1) × ... × 1" badge="MATH">
      <RetroInput label="Number n" value={nVal} onChange={setN} placeholder="e.g. 5" id="fc-n" />
      {!valid && n > 170 && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">n must be ≤ 170</div>}
      {!valid && !isNaN(n) && n < 0 && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">n must be ≥ 0</div>}
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`${n}! =`} value={result.toExponential(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Multiplication Chain</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="fcGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#fcGrid)" rx="8" />
              {Array.from({ length: Math.min(8, n) }).map((_, idx) => {
                const bh = Math.max(3, Math.min(50, (idx + 1) * 5))
                return <path key={idx} d={wobblyBar(20 + idx * 18, 60 - bh, 12, bh)} fill="#dfaa44" fillOpacity="0.7" stroke="#be8b32" strokeWidth="1" />
              })}
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">{n}! = {result.toExponential(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}