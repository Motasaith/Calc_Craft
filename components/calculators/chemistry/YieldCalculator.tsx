'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function YieldCalculator() {
  const [actual, setActual] = useState('8.5')
  const [theoretical, setTheoretical] = useState('10')

  const a = parseFloat(actual), th = parseFloat(theoretical)
  const valid = !isNaN(a) && !isNaN(th) && th > 0 && a >= 0
  const percent = valid ? (a / th) * 100 : 0

  return (
    <FormCalculatorShell title="Percent Yield" subtitle="% = (actual / theoretical) × 100" badge="CHEMISTRY">
      <RetroInput label="Actual Yield" value={actual} onChange={setActual} placeholder="e.g. 8.5" id="yd-a" unit="g" />
      <RetroInput label="Theoretical Yield" value={theoretical} onChange={setTheoretical} placeholder="e.g. 10" id="yd-t" unit="g" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Percent Yield" value={percent.toFixed(2)} unit="%" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Yield Comparison</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="ydGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#ydGrid)" rx="8" />
              {/* Theoretical bar */}
              <path d={wobblyBar(30, 20, 30, 55)} fill="#9ca3af" fillOpacity="0.2" stroke="#6b7280" strokeWidth="1.5" />
              <text x="45" y="82" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#6b7280">theo</text>
              {/* Actual bar */}
              <path d={wobblyBar(90, 20 + 55 - (percent / 100) * 55, 30, (percent / 100) * 55)} fill="#34d399" fillOpacity="0.4" stroke="#059669" strokeWidth="2" />
              <text x="105" y="82" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#059669">actual</text>
              <text x="80" y="12" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#059669" fontWeight="bold">{percent.toFixed(1)}%</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}