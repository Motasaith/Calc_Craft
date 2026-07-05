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

export default function ElectronConfigCalculator() {
  const [atomicNum, setAtomicNum] = useState('11')

  const z = parseInt(atomicNum)
  const valid = !isNaN(z) && z > 0 && z <= 118

  // Calculate electron configuration
  const shells = valid ? (() => {
    const max = [2, 8, 18, 32, 32, 18, 8]
    const config: number[] = []
    let remaining = z
    for (let i = 0; i < max.length && remaining > 0; i++) {
      const e = Math.min(remaining, max[i])
      config.push(e)
      remaining -= e
    }
    return config
  })() : []

  return (
    <FormCalculatorShell title="Electron Configuration" subtitle="Shell filling: 2, 8, 18, 32..." badge="CHEMISTRY">
      <RetroInput label="Atomic Number (Z)" value={atomicNum} onChange={setAtomicNum} placeholder="e.g. 11" id="ec-z" unit="" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Configuration" value={shells.join('-')} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Bohr Shells</span>
            <svg width="140" height="120" viewBox="0 0 140 120" className="select-none">
              <defs>
                <pattern id="ecGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="120" fill="url(#ecGrid)" rx="8" />
              <path d={wobblyCircle(70, 55, 8)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="70" y="58" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#78350f">Z</text>
              {shells.map((e, i) => (
                <g key={i}>
                  <path d={wobblyCircle(70, 55, 15 + i * 12)} fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx={70 + 15 + i * 12} cy="55" r="4" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
                  <text x={70 + 15 + i * 12} y="48" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#7c3aed">{e}</text>
                </g>
              ))}
              <text x="70" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">{shells.join('-')}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}