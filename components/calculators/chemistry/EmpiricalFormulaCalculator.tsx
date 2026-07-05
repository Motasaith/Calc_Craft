'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EmpiricalFormulaCalculator() {
  const [mass, setMass] = useState('40')
  const [molarMass, setMolarMass] = useState('30')

  const m = parseFloat(mass), mm = parseFloat(molarMass)
  const valid = !isNaN(m) && !isNaN(mm) && mm > 0 && m >= 0
  const moles = valid ? m / mm : 0
  const ratio = valid ? m / mm : 0

  return (
    <FormCalculatorShell title="Empirical Formula" subtitle="n = mass / atomic mass" badge="CHEMISTRY">
      <RetroInput label="Element Mass" value={mass} onChange={setMass} placeholder="e.g. 40" id="ef-m" unit="g" />
      <RetroInput label="Atomic Mass" value={molarMass} onChange={setMolarMass} placeholder="e.g. 30" id="ef-mm" unit="g/mol" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Moles of Element" value={moles.toFixed(4)} unit="mol" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Mole Ratio Bar</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="efGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#efGrid)" rx="8" />
              <path d={wobblyBar(30, 20, 30, Math.min(45, moles * 20))} fill="#34d399" fillOpacity="0.3" stroke="#059669" strokeWidth="2" />
              <text x="80" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">n = {moles.toFixed(3)} mol</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}