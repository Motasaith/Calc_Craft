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

export default function WaveSpeedCalculator() {
  const [freq, setFreq] = useState('440')
  const [wavelen, setWavelen] = useState('0.78')

  const f = parseFloat(freq), wl = parseFloat(wavelen)
  const valid = !isNaN(f) && !isNaN(wl) && f >= 0 && wl > 0
  const speed = valid ? f * wl : 0

  return (
    <FormCalculatorShell title="Wave Speed Calculator" subtitle="v = f × λ" badge="PHYSICS">
      <RetroInput label="Frequency (f)" value={freq} onChange={setFreq} placeholder="e.g. 440" id="ws-f" unit="Hz" />
      <RetroInput label="Wavelength (λ)" value={wavelen} onChange={setWavelen} placeholder="e.g. 0.78" id="ws-wl" unit="m" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Wave Speed" value={speed.toFixed(2)} unit="m/s" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Waveform</span>
            <svg width="200" height="80" viewBox="0 0 200 80" className="select-none">
              <defs>
                <pattern id="wsGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="200" height="80" fill="url(#wsGrid)" rx="8" />
              <path d={wobblyWave(15, 40, Math.min(25, 5 + f / 50), Math.min(4, 1 + f / 200), 170)} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
              <text x="100" y="75" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#2563eb" fontWeight="bold">v = {speed.toFixed(1)} m/s</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}