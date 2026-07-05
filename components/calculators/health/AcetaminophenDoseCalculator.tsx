'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AcetaminophenDoseCalculator() {
  const [weight, setWeight] = useState('')

  const w = parseFloat(weight)
  const valid = !isNaN(w) && w > 0 && w < 200
  const singleDose = valid ? Math.round(w * 15) : 0
  const dailyMax = valid ? Math.min(Math.round(w * 75), 4000) : 0
  const dosesPerDay = valid ? Math.floor(dailyMax / singleDose) : 0

  const barWidth = valid ? Math.min(singleDose / 1000, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Acetaminophen Dose Calculator" subtitle="Pediatric dosing by weight" badge="HEALTH">
      <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="20" id="ace-w" unit="kg" min={1} max={150} />

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="Single Dose" value={`${singleDose} mg`} large />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <ResultDisplay label="Daily Max" value={`${dailyMax} mg`} />
            <ResultDisplay label="Doses/Day" value={dosesPerDay} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0 mg</text>
            <text x="145" y="18" fontSize="8" fontFamily="monospace" fill="#555">1000 mg</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">15 mg/kg per dose, every 4-6 hours. Max 75 mg/kg/day or 4000 mg. Consult a doctor.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}