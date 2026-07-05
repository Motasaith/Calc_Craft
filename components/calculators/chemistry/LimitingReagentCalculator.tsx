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

export default function LimitingReagentCalculator() {
  const [moles1, setMoles1] = useState('2')
  const [moles2, setMoles2] = useState('3')
  const [ratio1, setRatio1] = useState('1')
  const [ratio2, setRatio2] = useState('2')

  const n1 = parseFloat(moles1), n2 = parseFloat(moles2), r1 = parseFloat(ratio1), r2 = parseFloat(ratio2)
  const valid = !isNaN(n1) && !isNaN(n2) && !isNaN(r1) && !isNaN(r2) && r1 > 0 && r2 > 0
  const eff1 = valid ? n1 / r1 : 0
  const eff2 = valid ? n2 / r2 : 0
  const limiting = valid ? (eff1 < eff2 ? 'Reagent 1' : 'Reagent 2') : ''

  return (
    <FormCalculatorShell title="Limiting Reagent" subtitle="Compare n/coefficient" badge="CHEMISTRY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Moles Reagent 1" value={moles1} onChange={setMoles1} placeholder="2" id="lr-n1" unit="mol" />
        <RetroInput label="Moles Reagent 2" value={moles2} onChange={setMoles2} placeholder="3" id="lr-n2" unit="mol" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Coeff 1" value={ratio1} onChange={setRatio1} placeholder="1" id="lr-r1" unit="" />
        <RetroInput label="Coeff 2" value={ratio2} onChange={setRatio2} placeholder="2" id="lr-r2" unit="" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Reagent 1 Eff." value={eff1.toFixed(3)} large />
            <ResultDisplay label="Reagent 2 Eff." value={eff2.toFixed(3)} large />
          </div>
          <div className="mt-3">
            <ResultDisplay label="Limiting Reagent" value={limiting} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Reagent Comparison</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="lrGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#lrGrid)" rx="8" />
              <path d={wobblyCircle(50, 40, 14)} fill={limiting === 'Reagent 1' ? '#ef4444' : '#34d399'} fillOpacity="0.2" stroke={limiting === 'Reagent 1' ? '#dc2626' : '#059669'} strokeWidth="2" />
              <text x="50" y="43" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={limiting === 'Reagent 1' ? '#dc2626' : '#059669'}>R1</text>
              <path d={wobblyCircle(110, 40, 14)} fill={limiting === 'Reagent 2' ? '#ef4444' : '#34d399'} fillOpacity="0.2" stroke={limiting === 'Reagent 2' ? '#dc2626' : '#059669'} strokeWidth="2" />
              <text x="110" y="43" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={limiting === 'Reagent 2' ? '#dc2626' : '#059669'}>R2</text>
              <text x="80" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#dc2626" fontWeight="bold">Limiting: {limiting}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}