'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MolarityChemCalculator() {
  const [moles, setMoles] = useState('0.5')
  const [vol, setVol] = useState('1')

  const n = parseFloat(moles), v = parseFloat(vol)
  const valid = !isNaN(n) && !isNaN(v) && v > 0 && n >= 0
  const molarity = valid ? n / v : 0

  return (
    <FormCalculatorShell title="Molarity Calculator" subtitle="M = n / V" badge="CHEMISTRY">
      <RetroInput label="Moles (n)" value={moles} onChange={setMoles} placeholder="0.5" id="mc-n" unit="mol" />
      <RetroInput label="Volume (V)" value={vol} onChange={setVol} placeholder="1" id="mc-v" unit="L" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Molarity" value={molarity.toFixed(4)} unit="mol/L" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Solution Beaker</span>
            <svg width="120" height="100" viewBox="0 0 120 100" className="select-none">
              <defs>
                <pattern id="mcGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="120" height="100" fill="url(#mcGrid)" rx="8" />
              <path d={wobblyBar(30, 15, 60, 65)} fill="none" stroke="#6b7280" strokeWidth="2.5" />
              <path d={wobblyBar(30, 15 + 65 - 40, 60, 40)} fill="#34d399" fillOpacity="0.25" stroke="#059669" strokeWidth="1.5" />
              <text x="60" y="92" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">M = {molarity.toFixed(2)} M</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}