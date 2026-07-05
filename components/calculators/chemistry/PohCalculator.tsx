'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PohCalculator() {
  const [conc, setConc] = useState('0.001')

  const c = parseFloat(conc)
  const valid = !isNaN(c) && c > 0
  const ph = valid ? -Math.log10(c) : 0
  const poh = valid ? 14 - ph : 0

  return (
    <FormCalculatorShell title="pOH Calculator" subtitle="pOH = 14 - pH" badge="CHEMISTRY">
      <RetroInput label="OH⁻ Concentration" value={conc} onChange={setConc} placeholder="0.001" id="po-c" unit="mol/L" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="pH" value={ph.toFixed(2)} large />
            <ResultDisplay label="pOH" value={poh.toFixed(2)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">pH + pOH = 14</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="poGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#poGrid)" rx="8" />
              <path d={wobblyBar(20, 25, (ph / 14) * 140, 20)} fill="#ef4444" fillOpacity="0.3" stroke="#dc2626" strokeWidth="2" />
              <text x={20 + (ph / 14) * 70} y="40" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#dc2626">pH={ph.toFixed(1)}</text>
              <path d={wobblyBar(20, 50, (poh / 14) * 140, 12)} fill="#3b82f6" fillOpacity="0.3" stroke="#2563eb" strokeWidth="2" />
              <text x={20 + (poh / 14) * 70} y="62" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb">pOH={poh.toFixed(1)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}