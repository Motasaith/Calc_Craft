'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function NthRootCalculator() {
  const [num, setNum] = useState('16')
  const [nVal, setN] = useState('4')

  const x = parseFloat(num), n = parseFloat(nVal)
  const valid = !isNaN(x) && !isNaN(n) && n !== 0
  let root = 0
  let ok = valid
  if (valid) {
    if (x < 0 && Number.isInteger(n) && n % 2 !== 0) {
      root = -Math.pow(-x, 1 / n)
    } else if (x < 0) {
      ok = false
    } else {
      root = Math.pow(x, 1 / n)
    }
  }

  return (
    <FormCalculatorShell title="Nth Root Calculator" subtitle="ⁿ√x" badge="MATH">
      <div className="text-[10px] font-mono text-neutral-500 mb-2">Computes the nth root of a number</div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Number x" value={num} onChange={setNum} placeholder="e.g. 16" id="nr-x" />
        <RetroInput label="Root n" value={nVal} onChange={setN} placeholder="e.g. 4" id="nr-n" />
      </div>
      {valid && !ok && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">Even root of negative number is not real</div>}
      {ok && (
        <>
          <div className="mt-4">
            <ResultDisplay label={`${n}√${x} =`} value={root.toFixed(6)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Root Visualization</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="nrGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#nrGrid)" rx="8" />
              <line x1="20" y1="60" x2="160" y2="60" stroke="#9ca3af" strokeWidth="1" />
              <line x1="90" y1="15" x2="90" y2="65" stroke="#9ca3af" strokeWidth="1" />
              <path d={`M 30 60 Q 90 ${60 - Math.max(5, Math.min(40, Math.abs(root) * 5))} 150 60`} fill="none" stroke="#dfaa44" strokeWidth="2" />
              <circle cx="90" cy={60 - Math.max(5, Math.min(40, Math.abs(root) * 5))} r="3" fill="#ab3232" />
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">{n}√{x}={root.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}