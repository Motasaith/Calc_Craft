'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PipeVolumeCalculator() {
  const [diameter, setDiameter] = useState('2')
  const [length, setLength] = useState('10')

  const d = parseFloat(diameter), l = parseFloat(length)
  const valid = !isNaN(d) && !isNaN(l) && d > 0 && l > 0
  // diameter in inches, length in feet → volume in gallons
  // V (gal) = π × (d/2)² × (l×12) / 231
  const radiusIn = valid ? d / 2 : 0
  const lengthIn = valid ? l * 12 : 0
  const volumeGal = valid ? (Math.PI * radiusIn * radiusIn * lengthIn) / 231 : 0
  const volumeL = volumeGal * 3.78541

  return (
    <FormCalculatorShell title="Pipe Volume Calculator" subtitle="V = π × r² × L" badge="PLUMBING">
      <RetroInput label="Pipe Diameter" value={diameter} onChange={setDiameter} placeholder="2" id="pv-d" unit="in" />
      <RetroInput label="Pipe Length" value={length} onChange={setLength} placeholder="10" id="pv-l" unit="ft" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Volume" value={volumeGal.toFixed(2)} unit="gal" large />
            <ResultDisplay label="Volume" value={volumeL.toFixed(2)} unit="L" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Pipe Cross-Section</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="pvGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#pvGrid)" rx="8" />
              <path d={wobblyBar(20, 20, 120, 50)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <circle cx="80" cy="45" r={Math.min(25, d * 3)} fill="#60a5fa" fillOpacity="0.35" stroke="#2563eb" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{volumeGal.toFixed(1)} gal</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}