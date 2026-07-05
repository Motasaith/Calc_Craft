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

export default function BondEnergyCalculator() {
  const [reactantBonds, setReactantBonds] = useState('346')
  const [productBonds, setProductBonds] = useState('436')

  const rb = parseFloat(reactantBonds), pb = parseFloat(productBonds)
  const valid = !isNaN(rb) && !isNaN(pb)
  const deltaE = valid ? rb - pb : 0
  const isExothermic = deltaE > 0

  return (
    <FormCalculatorShell title="Bond Energy" subtitle="ΔE = Σ(reactant bonds) - Σ(product bonds)" badge="CHEMISTRY">
      <RetroInput label="Reactant Bond Energy" value={reactantBonds} onChange={setReactantBonds} placeholder="346" id="be-r" unit="kJ/mol" />
      <RetroInput label="Product Bond Energy" value={productBonds} onChange={setProductBonds} placeholder="436" id="be-p" unit="kJ/mol" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Energy Change" value={deltaE.toFixed(2)} unit="kJ/mol" large />
          </div>
          <div className="mt-2 text-center">
            <span className={`text-[10px] font-bold font-mono uppercase ${isExothermic ? 'text-red-600' : 'text-blue-600'}`}>
              {isExothermic ? '▼ Exothermic' : '▲ Endothermic'}
            </span>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Bond Diagram</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="beGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#beGrid)" rx="8" />
              <path d={wobblyCircle(40, 40, 12)} fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="2" />
              <path d={wobblyCircle(70, 40, 12)} fill="#3b82f6" fillOpacity="0.2" stroke="#2563eb" strokeWidth="2" />
              <path d="M 52 40 L 58 40" stroke="#2563eb" strokeWidth="2" />
              <path d={wobblyCircle(120, 40, 12)} fill="#ef4444" fillOpacity="0.2" stroke="#dc2626" strokeWidth="2" />
              <path d={wobblyCircle(120, 40, 20)} fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
              <text x="80" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={isExothermic ? '#dc2626' : '#2563eb'} fontWeight="bold">ΔE = {deltaE.toFixed(0)} kJ/mol</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}