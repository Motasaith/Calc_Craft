'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PulsePressureCalculator() {
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')

  const s = parseFloat(systolic), d = parseFloat(diastolic)
  const valid = !isNaN(s) && !isNaN(d) && s > 0 && d > 0 && s > d
  const pp = valid ? s - d : 0

  const getCategory = () => {
    if (!valid) return ''
    if (pp < 40) return 'Low (Narrow)'
    if (pp <= 60) return 'Normal'
    return 'High (Wide)'
  }

  const category = getCategory()
  const barWidth = valid ? Math.min(pp / 100, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Pulse Pressure Calculator" subtitle="SBP minus DBP" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Systolic" value={systolic} onChange={setSystolic} placeholder="120" id="pp-s" unit="mmHg" min={60} max={300} />
        <RetroInput label="Diastolic" value={diastolic} onChange={setDiastolic} placeholder="80" id="pp-d" unit="mmHg" min={30} max={200} />
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="Pulse Pressure" value={pp.toFixed(0)} unit="mmHg" large />
          </div>
          <div className="mt-2">
            <ResultDisplay label="Category" value={category} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0</text>
            <text x="160" y="18" fontSize="8" fontFamily="monospace" fill="#555">100+</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">Normal: 40-60 mmHg. Wide PP may indicate arterial stiffness.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}