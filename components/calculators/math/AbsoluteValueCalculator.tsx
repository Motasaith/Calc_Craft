'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AbsoluteValueCalculator() {
  const [num, setNum] = useState('-7')

  const x = parseFloat(num)
  const valid = !isNaN(x)
  const abs = valid ? Math.abs(x) : 0

  return (
    <FormCalculatorShell title="Absolute Value" subtitle="|x| = distance from zero" badge="MATH">
      <RetroInput label="Number x" value={num} onChange={setNum} placeholder="e.g. -7" id="av-x" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`|${x}| =`} value={abs.toFixed(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Number Line</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="avGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#avGrid)" rx="8" />
              <line x1="20" y1="40" x2="160" y2="40" stroke="#9ca3af" strokeWidth="1" />
              <line x1="90" y1="30" x2="90" y2="50" stroke="#6b7280" strokeWidth="1.5" />
              <line x1="90" y1="40" x2={90 + Math.max(-60, Math.min(60, x * 10))} y2="40" stroke="#dfaa44" strokeWidth="3" />
              <circle cx={90 + Math.max(-60, Math.min(60, x * 10))} cy="40" r="4" fill="#ab3232" />
              <text x="90" y="70" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">|{x}|={abs.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}