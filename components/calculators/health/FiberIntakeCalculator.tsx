'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FiberIntakeCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [calories, setCalories] = useState('2000')

  const a = parseFloat(age), c = parseFloat(calories)
  const valid = !isNaN(a) && !isNaN(c) && a > 0 && c > 0
  // 14 g per 1000 kcal, with adjustments
  const baseFiber = valid ? (c / 1000) * 14 : 0
  const fiber = valid ? (a < 50 ? baseFiber : baseFiber * 0.9) : 0

  const barWidth = valid ? Math.min(fiber / 50, 1) * 180 : 0

  return (
    <FormCalculatorShell title="Fiber Intake Calculator" subtitle="Daily fiber needs" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="fib-a" unit="yrs" min={1} max={120} />
        <RetroInput label="Daily Calories" value={calories} onChange={setCalories} placeholder="2000" id="fib-c" unit="kcal" min={500} max={10000} />
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
            <ResultDisplay label="Daily Fiber" value={fiber.toFixed(1)} unit="g" large />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(10, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">0 g</text>
            <text x="160" y="18" fontSize="8" fontFamily="monospace" fill="#555">50 g</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">~14 g per 1000 kcal. General target: 25-38 g/day.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}