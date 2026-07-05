'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyWave(cx: number, cy: number, amp: number, freq: number, width: number) {
  const steps = 40
  let path = `M ${cx} ${cy}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const x = cx + width * t
    const y = cy + amp * Math.sin(freq * t * Math.PI * 2) + (Math.sin(i * 3.3) - 0.5) * 0.8
    path += ` L ${x} ${y}`
  }
  return path
}

export default function SoundFrequencyCalculator() {
  const [speed, setSpeed] = useState('343')
  const [wavelen, setWavelen] = useState('0.78')

  const s = parseFloat(speed), wl = parseFloat(wavelen)
  const valid = !isNaN(s) && !isNaN(wl) && s >= 0 && wl > 0
  const freq = valid ? s / wl : 0

  return (
    <FormCalculatorShell title="Sound Frequency" subtitle="f = v / λ" badge="PHYSICS">
      <RetroInput label="Speed of Sound (v)" value={speed} onChange={setSpeed} placeholder="e.g. 343" id="sf-v" unit="m/s" />
      <RetroInput label="Wavelength (λ)" value={wavelen} onChange={setWavelen} placeholder="e.g. 0.78" id="sf-wl" unit="m" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Frequency" value={freq.toFixed(2)} unit="Hz" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Sound Wave</span>
            <svg width="200" height="80" viewBox="0 0 200 80" className="select-none">
              <defs>
                <pattern id="sfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="200" height="80" fill="url(#sfGrid)" rx="8" />
              <path d={wobblyWave(15, 40, Math.min(25, 5 + freq / 50), Math.min(4, 1 + freq / 200), 170)} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
              <text x="100" y="75" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">f = {freq.toFixed(1)} Hz</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}