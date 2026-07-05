'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function GPMCalculator() {
  const [bucketSize, setBucketSize] = useState('5')
  const [fillTime, setFillTime] = useState('30')

  const b = parseFloat(bucketSize), t = parseFloat(fillTime)
  const valid = !isNaN(b) && !isNaN(t) && b > 0 && t > 0
  // GPM = bucket size (gal) / time (s) × 60
  const gpm = valid ? (b / t) * 60 : 0

  return (
    <FormCalculatorShell title="GPM Calculator" subtitle="GPM = (Bucket ÷ Time) × 60" badge="PLUMBING">
      <RetroInput label="Bucket Size" value={bucketSize} onChange={setBucketSize} placeholder="5" id="gp-b" unit="gal" />
      <RetroInput label="Fill Time" value={fillTime} onChange={setFillTime} placeholder="30" id="gp-t" unit="sec" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <ResultDisplay label="Flow Rate" value={gpm.toFixed(2)} unit="GPM" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Bucket Test</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="gpGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#gpGrid)" rx="8" />
              <path d={wobblyBar(60, 15, 40, 60)} fill="#cbd5e1" fillOpacity="0.3" stroke="#64748b" strokeWidth="2" />
              <path d={wobblyBar(62, 15 + 60 - Math.min(50, b * 8), 36, Math.min(50, b * 8))} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{gpm.toFixed(1)} GPM</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}