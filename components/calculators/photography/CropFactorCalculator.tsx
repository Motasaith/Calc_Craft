'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CropFactorCalculator() {
  const [sensorW, setSensorW] = useState('36')
  const [sensorH, setSensorH] = useState('24')

  const w = parseFloat(sensorW), h = parseFloat(sensorH)
  const valid = !isNaN(w) && !isNaN(h) && w > 0 && h > 0
  const diagonal = valid ? Math.sqrt(w * w + h * h) : 0
  const fullFrameDiag = 43.27 // 36² + 24² diagonal
  const cropFactor = valid ? fullFrameDiag / diagonal : 0

  return (
    <FormCalculatorShell title="Crop Factor Calculator" subtitle="CF = 43.27 / sensor diagonal" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Sensor Width" value={sensorW} onChange={setSensorW} placeholder="36" id="cf-w" unit="mm" />
        <RetroInput label="Sensor Height" value={sensorH} onChange={setSensorH} placeholder="24" id="cf-h" unit="mm" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Crop Factor" value={cropFactor.toFixed(2)} unit="×" large />
            <ResultDisplay label="Diagonal" value={diagonal.toFixed(2)} unit="mm" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Sensor Comparison</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="cfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#cfGrid)" rx="8" />
              {/* Full frame */}
              <path d={wobblyRect(20, 10, 120, 55)} fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="80" y="40" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#9ca3af">Full Frame</text>
              {/* Crop sensor */}
              <path d={wobblyRect(20 + (120 - 120 / cropFactor) / 2, 10 + (55 - 55 / cropFactor) / 2, 120 / cropFactor, 55 / cropFactor)} fill="#fbbf24" fillOpacity="0.2" stroke="#d97706" strokeWidth="2" />
              <text x="80" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">{cropFactor.toFixed(1)}× crop</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}