'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function BloodPressureCategoryCalculator() {
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')

  const s = parseFloat(systolic), d = parseFloat(diastolic)
  const valid = !isNaN(s) && !isNaN(d) && s > 0 && d > 0

  const getCategory = () => {
    if (!valid) return ''
    if (s >= 180 || d >= 120) return 'Crisis (Emergency)'
    if (s >= 140 || d >= 90) return 'Stage 2 Hypertension'
    if (s >= 130 || d >= 80) return 'Stage 1 Hypertension'
    if (s >= 120 && s < 130 && d < 80) return 'Elevated'
    if (s < 120 && d < 80) return 'Normal'
    return 'Stage 1 Hypertension'
  }

  const category = getCategory()
  const stageIndex = valid
    ? (s >= 180 || d >= 120 ? 4 : s >= 140 || d >= 90 ? 3 : s >= 130 || d >= 80 ? 2 : s >= 120 ? 1 : 0)
    : 0

  return (
    <FormCalculatorShell title="Blood Pressure Category" subtitle="ACC/AHA 2017 guidelines" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Systolic" value={systolic} onChange={setSystolic} placeholder="120" id="bp-s" unit="mmHg" min={50} max={300} />
        <RetroInput label="Diastolic" value={diastolic} onChange={setDiastolic} placeholder="80" id="bp-d" unit="mmHg" min={30} max={200} />
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="Category" value={category} large />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10 + stageIndex * 36, 25, 36, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="7" fontFamily="monospace" fill="#555">NORMAL</text>
            <text x="55" y="18" fontSize="7" fontFamily="monospace" fill="#555">ELEV</text>
            <text x="85" y="18" fontSize="7" fontFamily="monospace" fill="#555">STG1</text>
            <text x="120" y="18" fontSize="7" fontFamily="monospace" fill="#555">STG2</text>
            <text x="155" y="18" fontSize="7" fontFamily="monospace" fill="#555">CRISIS</text>
          </svg>
        </>
      )}
    </FormCalculatorShell>
  )
}