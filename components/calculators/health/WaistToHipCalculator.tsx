'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WaistToHipCalculator() {
  const [waist, setWaist] = useState('')
  const [hip, setHip] = useState('')
  const [gender, setGender] = useState('male')

  const w = parseFloat(waist), h = parseFloat(hip)
  const valid = !isNaN(w) && !isNaN(h) && w > 0 && h > 0 && w < 500 && h < 500
  const ratio = valid ? w / h : 0

  const getCategory = () => {
    if (!valid) return ''
    if (gender === 'male') {
      if (ratio < 0.90) return 'Low Risk'
      if (ratio < 1.00) return 'Moderate Risk'
      return 'High Risk'
    } else {
      if (ratio < 0.85) return 'Low Risk'
      if (ratio < 0.90) return 'Moderate Risk'
      return 'High Risk'
    }
  }

  const category = getCategory()
  const riskIndex = valid ? Math.min(ratio / 1.2, 1) : 0

  return (
    <FormCalculatorShell title="Waist-to-Hip Ratio" subtitle="Body fat distribution" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Waist" value={waist} onChange={setWaist} placeholder="85" id="whr-w" unit="cm" min={30} max={200} />
        <RetroInput label="Hip" value={hip} onChange={setHip} placeholder="100" id="whr-h" unit="cm" min={30} max={200} />
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
            <ResultDisplay label="Waist-to-Hip Ratio" value={ratio.toFixed(2)} large />
          </div>
          <div className="mt-2">
            <ResultDisplay label="Risk Category" value={category} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, 180 * riskIndex, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">LOW</text>
            <text x="170" y="18" fontSize="8" fontFamily="monospace" fill="#555">HIGH</text>
          </svg>
        </>
      )}
    </FormCalculatorShell>
  )
}