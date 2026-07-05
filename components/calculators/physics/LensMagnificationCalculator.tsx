'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  const steps = 28
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const jitter = (Math.sin(i * 3.1) - 0.5) * 1.0
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return path + ' Z'
}

export default function LensMagnificationCalculator() {
  const [objDist, setObjDist] = useState('30')
  const [imgDist, setImgDist] = useState('15')

  const u = parseFloat(objDist), v = parseFloat(imgDist)
  const valid = !isNaN(u) && !isNaN(v) && u > 0
  const mag = valid ? -v / u : 0
  const focal = valid ? (u * v) / (u + v) : 0

  return (
    <FormCalculatorShell title="Lens Magnification" subtitle="m = -v/u, 1/f = 1/u + 1/v" badge="PHYSICS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Object Dist (u)" value={objDist} onChange={setObjDist} placeholder="30" id="lm-u" unit="cm" />
        <RetroInput label="Image Dist (v)" value={imgDist} onChange={setImgDist} placeholder="15" id="lm-v" unit="cm" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Magnification" value={mag.toFixed(3)} large />
            <ResultDisplay label="Focal Length" value={focal.toFixed(2)} unit="cm" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Lens Ray Diagram</span>
            <svg width="180" height="100" viewBox="0 0 180 100" className="select-none">
              <defs>
                <pattern id="lmGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="100" fill="url(#lmGrid)" rx="8" />
              {/* Optical axis */}
              <path d="M 15 50 L 165 50" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              {/* Lens */}
              <path d={wobblyCircle(90, 50, 18)} fill="#a78bfa" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="2" />
              {/* Object (arrow up) */}
              <path d="M 40 50 L 40 30" stroke="#2563eb" strokeWidth="2" />
              <path d="M 40 30 L 36 35 L 44 35 Z" fill="#2563eb" />
              {/* Image (arrow down if inverted) */}
              <path d="M 130 50 L 130 65" stroke="#dc2626" strokeWidth="2" />
              <path d="M 130 65 L 126 60 L 134 60 Z" fill="#dc2626" />
              <text x="90" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">m = {mag.toFixed(2)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}