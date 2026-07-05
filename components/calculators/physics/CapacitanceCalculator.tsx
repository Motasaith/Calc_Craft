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

export default function CapacitanceCalculator() {
  const [charge, setCharge] = useState('0.001')
  const [voltage, setVoltage] = useState('12')

  const q = parseFloat(charge), v = parseFloat(voltage)
  const valid = !isNaN(q) && !isNaN(v) && v > 0
  const capacitance = valid ? q / v : 0

  return (
    <FormCalculatorShell title="Capacitance Calculator" subtitle="C = Q / V" badge="PHYSICS">
      <RetroInput label="Charge (Q)" value={charge} onChange={setCharge} placeholder="e.g. 0.001" id="cap-q" unit="C" />
      <RetroInput label="Voltage (V)" value={voltage} onChange={setVoltage} placeholder="e.g. 12" id="cap-v" unit="V" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Capacitance" value={(capacitance * 1e6).toFixed(4)} unit="μF" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Capacitor Plates</span>
            <svg width="160" height="100" viewBox="0 0 160 100" className="select-none">
              <defs>
                <pattern id="capGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="100" fill="url(#capGrid)" rx="8" />
              {/* Two plates */}
              <path d={wobblyCircle(55, 50, 20)} fill="none" stroke="#dc2626" strokeWidth="2.5" />
              <path d={wobblyCircle(105, 50, 20)} fill="none" stroke="#2563eb" strokeWidth="2.5" />
              <text x="55" y="53" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#dc2626" fontWeight="bold">+</text>
              <text x="105" y="53" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#2563eb" fontWeight="bold">−</text>
              {/* Field lines */}
              <path d="M 65 40 L 95 40" stroke="#9ca3af" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M 65 50 L 95 50" stroke="#9ca3af" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M 65 60 L 95 60" stroke="#9ca3af" strokeWidth="1" strokeDasharray="2 2" />
              <text x="80" y="90" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">C = {(capacitance * 1e6).toFixed(2)} μF</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}