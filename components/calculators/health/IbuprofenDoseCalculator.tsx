'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function IbuprofenDoseCalculator() {
  const [weight, setWeight] = useState('')
  const [maxDaily, setMaxDaily] = useState('40')

  const w = parseFloat(weight), md = parseFloat(maxDaily)
  const valid = !isNaN(w) && !isNaN(md) && w > 0 && w < 200 && md > 0 && md <= 60
  const singleDose = valid ? Math.round(w * 10) : 0
  const dailyMax = valid ? Math.min(Math.round(w * md), 3200) : 0
  const dosesPerDay = valid ? Math.floor(dailyMax / singleDose) : 0

  const barWidth = valid ? Math.min(singleDose / 600, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Ibuprofen Dose Calculator" subtitle="Pediatric dosing by weight" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="20" id="ibu-w" unit="kg" min={1} max={150} />
        <RetroInput label="Max Daily Dose" value={maxDaily} onChange={setMaxDaily} placeholder="40" id="ibu-md" unit="mg/kg" min={10} max={60} />
      </div>

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
            <text x="150" y="18" fontSize="8" fontFamily="monospace" fill="#555">600 mg</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">10 mg/kg per dose, every 6-8 hours. Max 3200 mg/day. Consult a doctor.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}