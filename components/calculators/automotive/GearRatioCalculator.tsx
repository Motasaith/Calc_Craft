'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GearRatioCalculator() {
  const [teeth1, setTeeth1] = useState('20')
  const [teeth2, setTeeth2] = useState('60')

  const t1 = parseFloat(teeth1), t2 = parseFloat(teeth2)
  const valid = !isNaN(t1) && !isNaN(t2) && t1 > 0 && t2 > 0
  const ratio = valid ? t2 / t1 : 0
  const rpmOut = valid ? 3000 / ratio : 0 // assuming 3000 RPM input

  return (
    <FormCalculatorShell title="Gear Ratio Calculator" subtitle="Ratio = Driven / Drive" badge="AUTOMOTIVE">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Drive Gear Teeth" value={teeth1} onChange={setTeeth1} placeholder="20" id="gr-t1" unit="" />
        <RetroInput label="Driven Gear Teeth" value={teeth2} onChange={setTeeth2} placeholder="60" id="gr-t2" unit="" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Gear Ratio" value={ratio.toFixed(2)} unit=":1" large />
            <ResultDisplay label="Output RPM" value={rpmOut.toFixed(0)} unit="rpm" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Gear Mesh</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="grGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#grGrid)" rx="8" />
              {/* Small gear */}
              <circle cx="45" cy="40" r={Math.min(20, t1 / 3)} fill="none" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="45" cy="40" r="3" fill="#d97706" />
              {/* Large gear */}
              <circle cx="110" cy="40" r={Math.min(30, t2 / 3)} fill="none" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="110" cy="40" r="3" fill="#1e40af" />
              <text x="80" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#1e40af" fontWeight="bold">{ratio.toFixed(2)}:1 ratio</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}