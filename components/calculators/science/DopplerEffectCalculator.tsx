'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DopplerEffectCalculator() {
  const [freq, setFreq] = useState('440')
  const [vel, setVel] = useState('30')
  const [waveSpeed, setWaveSpeed] = useState('343')
  const [direction, setDirection] = useState('approach')

  const f = parseFloat(freq)
  const vs = parseFloat(vel)
  const v = parseFloat(waveSpeed)
  const valid = !isNaN(f) && !isNaN(vs) && !isNaN(v) && v > 0 && f > 0

  // f' = f * v / (v - vs)  approach ; f * v / (v + vs) recede
  const denom = direction === 'approach' ? v - vs : v + vs
  const observed = valid && denom !== 0 ? (f * v) / denom : 0
  const shift = valid ? observed - f : 0

  // Visualizer: source bar vs observed bar
  const maxF = Math.max(f, observed, 1)
  const h1 = (f / maxF) * 60
  const h2 = (observed / maxF) * 60

  return (
    <FormCalculatorShell
      title="Doppler Effect"
      subtitle="Observed frequency from moving source"
      badge="SCIENCE"
    >
      <div>
        <RetroInput label="Source Frequency" value={freq} onChange={setFreq} unit="Hz" placeholder="e.g. 440" />
        <RetroInput label="Source Velocity" value={vel} onChange={setVel} unit="m/s" placeholder="e.g. 30" />
        <RetroInput label="Wave Speed" value={waveSpeed} onChange={setWaveSpeed} unit="m/s" placeholder="e.g. 343" />
        <RetroSelect
          label="Direction"
          value={direction}
          onChange={setDirection}
          options={[
            { value: 'approach', label: 'Approaching' },
            { value: 'recede', label: 'Receding' },
          ]}
        />
      </div>

      {valid && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ResultDisplay label="Observed Freq" value={observed.toFixed(2)} unit="Hz" large />
          <ResultDisplay label="Frequency Shift" value={shift.toFixed(2)} unit="Hz" />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 bg-[#f4f1ea] rounded-lg border border-neutral-300">
        <path d={wobblyBar(40, 70 - h1, 40, h1)} fill="#dfaa44" opacity={0.85} />
        <path d={wobblyBar(120, 70 - h2, 40, h2)} fill="#4a6fa5" opacity={0.85} />
        <text x="60" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">source</text>
        <text x="140" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#555">observed</text>
      </svg>
    </FormCalculatorShell>
  )
}