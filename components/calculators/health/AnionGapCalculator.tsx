'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AnionGapCalculator() {
  const [na, setNa] = useState('')
  const [cl, setCl] = useState('')
  const [hco3, setHco3] = useState('')

  const n = parseFloat(na), c = parseFloat(cl), h = parseFloat(hco3)
  const valid = !isNaN(n) && !isNaN(c) && !isNaN(h) && n > 0 && c > 0 && h > 0
  const gap = valid ? n - (c + h) : 0

  const getCategory = () => {
    if (!valid) return ''
    if (gap < 3) return 'Low'
    if (gap <= 11) return 'Normal'
    return 'High (Metabolic Acidosis)'
  }

  const category = getCategory()
  const barWidth = valid ? Math.min(Math.max(gap, 0) / 30, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Anion Gap Calculator" subtitle="Acid-base evaluation" badge="HEALTH">
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="Na+" value={na} onChange={setNa} placeholder="140" id="ag-na" unit="mEq/L" min={100} max={180} />
        <RetroInput label="Cl-" value={cl} onChange={setCl} placeholder="104" id="ag-cl" unit="mEq/L" min={60} max={140} />
        <RetroInput label="HCO3-" value={hco3} onChange={setHco3} placeholder="24" id="ag-h" unit="mEq/L" min={5} max={60} />
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="Anion Gap" value={gap.toFixed(1)} unit="mEq/L" large />
          </div>
          <div className="mt-2">
            <ResultDisplay label="Interpretation" value={category} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0</text>
            <text x="160" y="18" fontSize="8" fontFamily="monospace" fill="#555">30+</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">Normal range: 3-11 mEq/L. Na - (Cl + HCO3).</p>
        </>
      )}
    </FormCalculatorShell>
  )
}