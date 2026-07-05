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

export default function AvogadrosNumberCalculator() {
  const [moles, setMoles] = useState('2')

  const n = parseFloat(moles)
  const valid = !isNaN(n) && n >= 0
  const molecules = valid ? n * 6.022e23 : 0
  const atoms = valid ? n * 6.022e23 : 0

  return (
    <FormCalculatorShell title="Avogadro's Number" subtitle="N = n × Nₐ" badge="CHEMISTRY">
      <RetroInput label="Moles (n)" value={moles} onChange={setMoles} placeholder="e.g. 2" id="av-n" unit="mol" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Molecules/Atoms" value={molecules.toExponential(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Particle Cloud</span>
            <svg width="140" height="90" viewBox="0 0 140 90" className="select-none">
              <defs>
                <pattern id="avGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="90" fill="url(#avGrid)" rx="8" />
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2
                const r = 20 + (i % 3) * 8
                const x = 70 + r * Math.cos(angle)
                const y = 40 + r * Math.sin(angle)
                return <path key={i} d={wobblyCircle(x, y, 4)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="1.2" />
              })}
              <text x="70" y="82" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">N = {molecules.toExponential(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}