'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ModuloCalculator() {
  const [dividend, setDividend] = useState('17')
  const [divisor, setDivisor] = useState('5')

  const a = parseFloat(dividend), b = parseFloat(divisor)
  const valid = !isNaN(a) && !isNaN(b) && b !== 0
  const quotient = valid ? Math.trunc(a / b) : 0
  const remainder = valid ? a - quotient * b : 0

  return (
    <FormCalculatorShell title="Modulo Calculator" subtitle="a mod b = remainder" badge="MATH">
      <div className="text-[10px] font-mono text-neutral-500 mb-2">a = q·b + r</div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Dividend a" value={dividend} onChange={setDividend} id="mod-a" />
        <RetroInput label="Divisor b" value={divisor} onChange={setDivisor} id="mod-b" />
      </div>
      {valid && !Number.isInteger(a) && <div className="mt-2 text-[10px] font-mono text-amber-600 text-center">Note: non-integer inputs use truncated division</div>}
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Quotient q" value={quotient.toFixed(0)} large />
            <ResultDisplay label="Remainder r" value={remainder.toFixed(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Division Visual</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="modGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#modGrid)" rx="8" />
              {Array.from({ length: Math.max(1, Math.min(10, Math.abs(quotient))) }).map((_, idx) => (
                <path key={idx} d={wobblyBar(20 + idx * 14, 30, 10, 20)} fill="#3b82f6" fillOpacity="0.6" stroke="#2563eb" strokeWidth="1" />
              ))}
              <path d={wobblyBar(20, 58, Math.max(5, Math.min(140, Math.abs(remainder) * 8)), 8)} fill="#dfaa44" fillOpacity="0.8" stroke="#be8b32" strokeWidth="1" />
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">r={remainder.toFixed(1)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}