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

export default function GasPressureCalculator() {
  const [moles, setMoles] = useState('1')
  const [temp, setTemp] = useState('298')
  const [vol, setVol] = useState('24.5')
  const R = 0.0821

  const n = parseFloat(moles), t = parseFloat(temp), v = parseFloat(vol)
  const valid = !isNaN(n) && !isNaN(t) && !isNaN(v) && v > 0 && t > 0
  const pressure = valid ? (n * R * t) / v : 0

  return (
    <FormCalculatorShell title="Ideal Gas Law" subtitle="PV = nRT" badge="CHEMISTRY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Moles (n)" value={moles} onChange={setMoles} placeholder="1" id="ig-n" unit="mol" />
        <RetroInput label="Temp (T)" value={temp} onChange={setTemp} placeholder="298" id="ig-t" unit="K" />
      </div>
      <RetroInput label="Volume (V)" value={vol} onChange={setVol} placeholder="24.5" id="ig-v" unit="L" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Pressure" value={pressure.toFixed(3)} unit="atm" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Gas in Container</span>
            <svg width="140" height="100" viewBox="0 0 140 100" className="select-none">
              <defs>
                <pattern id="igGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="100" fill="url(#igGrid)" rx="8" />
              {/* Container */}
              <rect x="25" y="15" width="90" height="70" fill="none" stroke="#6b7280" strokeWidth="2.5" rx="3" />
              {/* Gas molecules */}
              {[40, 60, 80, 100].map((x, i) => (
                [25, 45, 65].map((y, j) => (
                  <path key={`${i}-${j}`} d={wobblyCircle(x + (i % 2) * 5, y + (j % 2) * 5, 5)} fill="#a78bfa" fillOpacity="0.3" stroke="#7c3aed" strokeWidth="1.5" />
                ))
              ))}
              <text x="70" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">P = {pressure.toFixed(2)} atm</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}