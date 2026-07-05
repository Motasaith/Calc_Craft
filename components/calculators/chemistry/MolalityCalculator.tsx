'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MolalityCalculator() {
  const [moles, setMoles] = useState('0.5')
  const [kg, setKg] = useState('1')

  const n = parseFloat(moles), k = parseFloat(kg)
  const valid = !isNaN(n) && !isNaN(k) && k > 0 && n >= 0
  const molality = valid ? n / k : 0

  return (
    <FormCalculatorShell title="Molality Calculator" subtitle="m = n / kg solvent" badge="CHEMISTRY">
      <RetroInput label="Moles Solute (n)" value={moles} onChange={setMoles} placeholder="0.5" id="ml2-n" unit="mol" />
      <RetroInput label="Solvent Mass" value={kg} onChange={setKg} placeholder="1" id="ml2-k" unit="kg" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Molality" value={molality.toFixed(4)} unit="mol/kg" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Solution Visual</span>
            <svg width="140" height="90" viewBox="0 0 140 90" className="select-none">
              <defs>
                <pattern id="ml2Grid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="90" fill="url(#ml2Grid)" rx="8" />
              <path d={wobblyBar(35, 15, 70, 55)} fill="none" stroke="#6b7280" strokeWidth="2.5" />
              <path d={wobblyBar(35, 15 + 55 - 35, 70, 35)} fill="#60a5fa" fillOpacity="0.2" stroke="#2563eb" strokeWidth="1.5" />
              <text x="70" y="82" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">m = {molality.toFixed(2)} mol/kg</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}