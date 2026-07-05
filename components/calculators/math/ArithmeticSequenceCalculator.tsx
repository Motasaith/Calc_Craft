'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ArithmeticSequenceCalculator() {
  const [first, setFirst] = useState('2')
  const [diff, setDiff] = useState('3')
  const [nVal, setN] = useState('10')

  const a = parseFloat(first), d = parseFloat(diff), n = parseInt(nVal, 10)
  const valid = !isNaN(a) && !isNaN(d) && !isNaN(n) && n > 0
  const nth = valid ? a + (n - 1) * d : 0
  const sum = valid ? (n / 2) * (2 * a + (n - 1) * d) : 0

  return (
    <FormCalculatorShell title="Arithmetic Sequence" subtitle="nth term and sum" badge="MATH">
      <div className="text-[10px] font-mono text-neutral-500 mb-2">aₙ = a + (n−1)d &nbsp; Sₙ = n/2(2a + (n−1)d)</div>
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="First term a" value={first} onChange={setFirst} id="as-a" />
        <RetroInput label="Common diff d" value={diff} onChange={setDiff} id="as-d" />
        <RetroInput label="n" value={nVal} onChange={setN} id="as-n" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="nth term" value={nth.toFixed(4)} large />
            <ResultDisplay label="Sum Sₙ" value={sum.toFixed(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Sequence Bars</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="asGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#asGrid)" rx="8" />
              {Array.from({ length: Math.min(8, n) }).map((_, idx) => {
                const val = a + idx * d
                const bh = Math.max(2, Math.min(50, Math.abs(val) * 0.8))
                return <path key={idx} d={wobblyBar(20 + idx * 18, 60 - bh, 12, bh)} fill="#dfaa44" fillOpacity="0.7" stroke="#be8b32" strokeWidth="1" />
              })}
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">aₙ={nth.toFixed(1)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}