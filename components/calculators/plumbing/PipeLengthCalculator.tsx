'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PipeLengthCalculator() {
  const [sections, setSections] = useState('10')
  const [sectionLength, setSectionLength] = useState('8')
  const [wasteFactor, setWasteFactor] = useState('10')

  const n = parseFloat(sections), sl = parseFloat(sectionLength), wf = parseFloat(wasteFactor)
  const valid = !isNaN(n) && !isNaN(sl) && !isNaN(wf) && n > 0 && sl > 0 && wf >= 0
  const totalLength = valid ? n * sl : 0
  const withWaste = valid ? totalLength * (1 + wf / 100) : 0

  return (
    <FormCalculatorShell title="Pipe Length Calculator" subtitle="L = N × S × (1 + waste%)" badge="PLUMBING">
      <RetroInput label="Number of Sections" value={sections} onChange={setSections} placeholder="10" id="pl-n" unit="pcs" />
      <RetroInput label="Section Length" value={sectionLength} onChange={setSectionLength} placeholder="8" id="pl-s" unit="ft" />
      <RetroInput label="Waste Factor" value={wasteFactor} onChange={setWasteFactor} placeholder="10" id="pl-w" unit="%" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Total Length" value={totalLength.toFixed(1)} unit="ft" large />
            <ResultDisplay label="With Waste" value={withWaste.toFixed(1)} unit="ft" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Pipe Sections</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="plGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#plGrid)" rx="8" />
              <path d={wobblyBar(15, 40, 130, 12)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <path d={wobblyBar(15, 42, Math.min(130, (totalLength / withWaste) * 130), 8)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">{withWaste.toFixed(0)} ft</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}