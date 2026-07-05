'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GeometricSequenceCalculator() {
  const [first, setFirst] = useState('2')
  const [ratio, setRatio] = useState('2')
  const [nVal, setN] = useState('10')

  const a = parseFloat(first), r = parseFloat(ratio), n = parseInt(nVal, 10)
  const valid = !isNaN(a) && !isNaN(r) && !isNaN(n) && n > 0
  const nth = valid ? a * Math.pow(r, n - 1) : 0
  const sum = valid ? (r === 1 ? a * n : a * (Math.pow(r, n) - 1) / (r - 1)) : 0

  return (
    <FormCalculatorShell title="Geometric Sequence" subtitle="nth term and sum" badge="MATH">
      <div className="text-[10px] font-mono text-neutral-500 mb-2">aₙ = a·r^(n−1) &nbsp; Sₙ = a(r^n−1)/(r−1)</div>
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="First term a" value={first} onChange={setFirst} id="gs-a" />
        <RetroInput label="Common ratio r" value={ratio} onChange={setRatio} id="gs-r" />
        <RetroInput label="n" value={nVal} onChange={setN} id="gs-n" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="nth term" value={isFinite(nth) ? nth.toExponential(4) : '∞'} large />
            <ResultDisplay label="Sum Sₙ" value={isFinite(sum) ? sum.toExponential(4) : '∞'} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Growth Curve</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="gsGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#gsGrid)" rx="8" />
              <line x1="20" y1="60" x2="160" y2="60" stroke="#9ca3af" strokeWidth="1" />
              {Array.from({ length: Math.min(8, n) }).map((_, idx) => {
                const val = a * Math.pow(r, idx)
                const bh = Math.max(2, Math.min(50, Math.abs(val) * 0.05))
                return <path key={idx} d={wobblyBar(20 + idx * 18, 60 - bh, 12, bh)} fill="#3b82f6" fillOpacity="0.7" stroke="#2563eb" strokeWidth="1" />
              })}
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">r={r}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}