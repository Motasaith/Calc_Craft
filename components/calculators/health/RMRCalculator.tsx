'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RMRCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')

  const w = parseFloat(weight), h = parseFloat(height), a = parseFloat(age)
  const valid = !isNaN(w) && !isNaN(h) && !isNaN(a) && w > 0 && h > 0 && a > 0
  const rmr = valid
    ? gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161
    : 0

  const barWidth = valid ? Math.min(rmr / 3000, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Resting Metabolic Rate" subtitle="Mifflin-St Jeor equation" badge="HEALTH">
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="70" id="rmr-w" unit="kg" min={20} max={400} />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="170" id="rmr-h" unit="cm" min={50} max={280} />
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="rmr-a" unit="yrs" min={1} max={120} />
      </div>
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">Gender</label>
        <div className="flex gap-1 bg-neutral-200 p-1 rounded-lg border border-neutral-300">
          <button onClick={() => setGender('male')} className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md ${gender === 'male' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>Male</button>
          <button onClick={() => setGender('female')} className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md ${gender === 'female' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>Female</button>
        </div>
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="RMR" value={Math.round(rmr)} unit="kcal/day" large />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0</text>
            <text x="155" y="18" fontSize="8" fontFamily="monospace" fill="#555">3000</text>
          </svg>
        </>
      )}
    </FormCalculatorShell>
  )
}