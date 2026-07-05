'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CreatinineClearanceCalculator() {
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [scr, setScr] = useState('')
  const [gender, setGender] = useState('male')

  const a = parseFloat(age), w = parseFloat(weight), s = parseFloat(scr)
  const valid = !isNaN(a) && !isNaN(w) && !isNaN(s) && a > 0 && w > 0 && s > 0
  const crcl = valid ? ((140 - a) * w * (gender === 'male' ? 1 : 0.85)) / (72 * s) : 0

  const getCategory = () => {
    if (!valid) return ''
    if (crcl >= 90) return 'Normal'
    if (crcl >= 60) return 'Mildly Decreased'
    if (crcl >= 45) return 'Mild-Moderate'
    if (crcl >= 30) return 'Moderate'
    if (crcl >= 15) return 'Severe'
    return 'Kidney Failure'
  }

  const category = getCategory()
  const barWidth = valid ? Math.min(crcl / 120, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Creatinine Clearance" subtitle="Cockcroft-Gault equation" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="65" id="crcl-a" unit="yrs" min={1} max={120} />
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="70" id="crcl-w" unit="kg" min={1} max={300} />
      </div>
      <RetroInput label="Serum Creatinine" value={scr} onChange={setScr} placeholder="1.0" id="crcl-s" unit="mg/dL" min={0.1} max={20} step={0.1} />
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
            <ResultDisplay label="CrCl" value={crcl.toFixed(1)} unit="mL/min" large />
          </div>
          <div className="mt-2">
            <ResultDisplay label="Renal Function" value={category} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0</text>
            <text x="165" y="18" fontSize="8" fontFamily="monospace" fill="#555">120+</text>
          </svg>
        </>
      )}
    </FormCalculatorShell>
  )
}