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

export default function AtomCountCalculator() {
  const [moles, setMoles] = useState('1')
  const [atomsPerMolecule, setAtomsPerMolecule] = useState('3')

  const n = parseFloat(moles), a = parseFloat(atomsPerMolecule)
  const valid = !isNaN(n) && !isNaN(a) && n >= 0 && a >= 0
  const totalAtoms = valid ? n * a * 6.022e23 : 0

  return (
    <FormCalculatorShell title="Atom Count Calculator" subtitle="N = n × atoms × Nₐ" badge="CHEMISTRY">
      <RetroInput label="Moles (n)" value={moles} onChange={setMoles} placeholder="e.g. 1" id="ac-n" unit="mol" />
      <RetroInput label="Atoms/Molecule" value={atomsPerMolecule} onChange={setAtomsPerMolecule} placeholder="e.g. 3" id="ac-a" unit="" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Total Atoms" value={totalAtoms.toExponential(4)} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Atom Cluster</span>
            <svg width="140" height="90" viewBox="0 0 140 90" className="select-none">
              <defs>
                <pattern id="acGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="90" fill="url(#acGrid)" rx="8" />
              {/* Molecule with atoms */}
              <path d={wobblyCircle(70, 45, 10)} fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2" />
              <path d={wobblyCircle(50, 30, 7)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <path d={wobblyCircle(90, 30, 7)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="2" />
              <path d="M 60 38 L 50 35" stroke="#7c3aed" strokeWidth="1.5" />
              <path d="M 80 38 L 90 35" stroke="#7c3aed" strokeWidth="1.5" />
              <text x="70" y="82" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">N = {totalAtoms.toExponential(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}