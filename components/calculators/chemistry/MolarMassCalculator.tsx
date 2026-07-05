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

export default function MolarMassCalculator() {
  const [moles, setMoles] = useState('2')
  const [mass, setMass] = useState('58.44')

  const n = parseFloat(moles), m = parseFloat(mass)
  const valid = !isNaN(n) && !isNaN(m) && n > 0 && m >= 0
  const molarMass = valid ? m / n : 0

  return (
    <FormCalculatorShell title="Molar Mass Calculator" subtitle="M = m / n" badge="CHEMISTRY">
      <RetroInput label="Mass (m)" value={mass} onChange={setMass} placeholder="e.g. 58.44" id="mm-m" unit="g" />
      <RetroInput label="Moles (n)" value={moles} onChange={setMoles} placeholder="e.g. 2" id="mm-n" unit="mol" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Molar Mass" value={molarMass.toFixed(2)} unit="g/mol" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Molecule Cluster</span>
            <svg width="140" height="100" viewBox="0 0 140 100" className="select-none">
              <defs>
                <pattern id="mmGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="100" fill="url(#mmGrid)" rx="8" />
              <path d={wobblyCircle(50, 40, 14)} fill="#34d399" fillOpacity="0.2" stroke="#059669" strokeWidth="2" />
              <text x="50" y="43" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669">m</text>
              <path d={wobblyCircle(90, 60, 14)} fill="#34d399" fillOpacity="0.2" stroke="#059669" strokeWidth="2" />
              <text x="90" y="63" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669">m</text>
              <path d="M 64 40 L 76 60" stroke="#059669" strokeWidth="1.5" />
              <text x="70" y="90" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">M = {molarMass.toFixed(1)} g/mol</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}