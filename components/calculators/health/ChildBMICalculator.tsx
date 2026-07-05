'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ChildBMICalculator() {
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState('male')

  const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height)
  const valid = !isNaN(a) && !isNaN(w) && !isNaN(h) && a > 2 && a < 20 && w > 0 && h > 0
  const bmi = valid ? w / Math.pow(h / 100, 2) : 0

  // Simplified percentile approximation
  const getPercentile = () => {
    if (!valid) return { pct: 0, category: '' }
    // Approximate median BMI by age
    const median = gender === 'male' ? 15 + 0.5 * (a - 2) : 14.5 + 0.45 * (a - 2)
    const sd = 2 + 0.1 * a
    const z = (bmi - median) / sd
    const pct = Math.max(1, Math.min(99, Math.round(50 + z * 34)))
    let category = ''
    if (pct < 5) category = 'Underweight'
    else if (pct < 85) category = 'Healthy Weight'
    else if (pct < 95) category = 'Overweight'
    else category = 'Obese'
    return { pct, category }
  }

  const { pct, category } = getPercentile()
  const barWidth = valid ? (pct / 100) * 180 : 0

  return (
    <FormCalculatorShell title="Child BMI Calculator" subtitle="Ages 2-20, percentile" badge="HEALTH">
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="10" id="cbmi-a" unit="yrs" min={2} max={20} />
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="35" id="cbmi-w" unit="kg" min={5} max={200} />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="140" id="cbmi-h" unit="cm" min={50} max={220} />
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
            <ResultDisplay label="BMI" value={bmi.toFixed(1)} unit="kg/m²" large />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <ResultDisplay label="Percentile" value={`${pct}th`} />
            <ResultDisplay label="Category" value={category} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">5th</text>
            <text x="85" y="18" fontSize="8" fontFamily="monospace" fill="#555">50th</text>
            <text x="160" y="18" fontSize="8" fontFamily="monospace" fill="#555">95th</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">Approximate percentile. For clinical use, refer to CDC growth charts.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}