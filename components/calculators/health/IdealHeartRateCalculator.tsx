'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function IdealHeartRateCalculator() {
  const [age, setAge] = useState('')
  const [fitness, setFitness] = useState('average')

  const a = parseFloat(age)
  const valid = !isNaN(a) && a > 0 && a <= 120

  // Ideal resting HR range by fitness level
  const getRanges = () => {
    const base: Record<string, [number, number]> = {
      athlete: [40, 55],
      excellent: [50, 60],
      good: [55, 65],
      average: [60, 75],
      poor: [75, 90],
    }
    const [low, high] = base[fitness] || base.average
    // Slight age adjustment: older = slightly higher
    const adj = Math.max(0, (a - 40) * 0.2)
    return { low: Math.round(low + adj), high: Math.round(high + adj) }
  }

  const { low, high } = valid ? getRanges() : { low: 0, high: 0 }
  const barWidth = valid ? ((high - low) / 60) * 180 : 0
  const barX = valid ? 10 + (low / 100) * 180 : 10

  return (
    <FormCalculatorShell title="Ideal Resting Heart Rate" subtitle="Target RHR by fitness" badge="HEALTH">
      <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="ihr-a" unit="yrs" min={1} max={120} />
      <div className="mb-3">
        <label className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">Fitness Level</label>
        <div className="flex gap-1 bg-neutral-200 p-1 rounded-lg border border-neutral-300 flex-wrap">
          {['athlete', 'excellent', 'good', 'average', 'poor'].map((f) => (
            <button key={f} onClick={() => setFitness(f)} className={`flex-1 py-1.5 text-[9px] font-bold font-mono rounded-md capitalize ${fitness === f ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>{f}</button>
          ))}
        </div>
      </div>

      {valid && (
        <>
          <div className="mt-2">
            <ResultDisplay label="Ideal Resting HR" value={`${low}-${high}`} unit="bpm" large />
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg">
            <path d={wobblyBar(10, 25, 180, 20)} fill="#e5e1d8" />
            <path d={wobblyBar(barX, 25, barWidth, 20)} fill="#dfaa44" />
            <text x="10" y="18" fontSize="8" fontFamily="monospace" fill="#555">40</text>
            <text x="160" y="18" fontSize="8" fontFamily="monospace" fill="#555">100</text>
          </svg>
          <p className="text-[9px] text-neutral-500 font-mono mt-2">Lower RHR generally indicates better cardiovascular fitness.</p>
        </>
      )}
    </FormCalculatorShell>
  )
}