'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function MAPCalculator() {
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')

  const s = parseFloat(systolic), d = parseFloat(diastolic)
  const valid = !isNaN(s) && !isNaN(d) && s > 0 && d > 0 && s > d
  const map = valid ? (d + (s - d) / 3) : 0

  const getCategory = () => {
    if (!valid) return ''
    if (map < 70) return 'Low'
    if (map < 100) return 'Normal'
    if (map < 120) return 'Elevated'
    return 'High'
  }

  const category = getCategory()
  const barWidth = valid ? Math.min(map / 150, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Mean Arterial Pressure" subtitle="MAP calculator" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Systolic" value={systolic} onChange={setSystolic} placeholder="120" id="map-s" unit="mmHg" min={60} max={300} />
        <RetroInput label="Diastolic" value={diastolic} onChange={setDiastolic} placeholder="80" id="map-d" unit="mmHg" min={30} max={200} />
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="MAP" value={map.toFixed(1)} unit="mmHg" large />
          </div>
          <div className="mt-2">
            <ResultDisplay label="Category" value={category} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0</text>
            <text x="160" y="18" fontSize="8" fontFamily="monospace" fill="#555">150</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">MAP = DBP + 1/3(SBP - DBP). Normal: 70-100 mmHg.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}