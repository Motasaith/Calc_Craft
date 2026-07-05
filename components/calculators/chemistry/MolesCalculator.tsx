'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  const steps = 28
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const jitter = (Math.sin(i * 3.1) - 0.5) * 1.0
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}

export default function MolesCalculator() {
  const [mass, setMass] = useState('36')
  const [molarMass, setMolarMass] = useState('18')

  const m = parseFloat(mass), mm = parseFloat(molarMass)
  const valid = !isNaN(m) && !isNaN(mm) && mm > 0 && m >= 0
  const moles = valid ? m / mm : 0
  const molecules = valid ? moles * 6.022e23 : 0

  return (
    <FormCalculatorShell title="Moles Calculator" subtitle="n = m / M" badge="CHEMISTRY">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 36" id="ml-m" unit="g" />
      <RetroInput label="Molar Mass (M)" value={molarMass} onChange={setMolarMass} placeholder="e.g. 18" id="ml-mm" unit="g/mol" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Moles" value={moles.toFixed(4)} unit="mol" large />
            <ResultDisplay label="Molecules" value={molecules.toExponential(3)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Molecule Count</span>
            <svg width="140" height="100" viewBox="0 0 140 100" className="select-none">
              <defs>
                <pattern id="mlGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="100" fill="url(#mlGrid)" rx="8" />
              {[30, 50, 70, 90, 110].map((x, i) => (
                <g key={i}>
                  <path d={wobblyCircle(x, 30 + (i % 2) * 20, 8)} fill="#34d399" fillOpacity="0.2" stroke="#059669" strokeWidth="1.5" />
                  <path d={wobblyCircle(x + 15, 40 + (i % 2) * 15, 6)} fill="#a78bfa" fillOpacity="0.2" stroke="#7c3aed" strokeWidth="1.5" />
                </g>
              ))}
              <text x="70" y="90" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">n = {moles.toFixed(2)} mol</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}