'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WilksScoreCalculator() {
  const [weight, setWeight] = useState('80')
  const [total, setTotal] = useState('500')
  const [isMale, setIsMale] = useState('1')

  const bw = parseFloat(weight), t = parseFloat(total), male = parseInt(isMale) === 1
  const valid = !isNaN(bw) && !isNaN(t) && bw > 0 && t > 0
  // Simplified Wilks formula coefficients
  const a = male ? -216.0475144 : 594.3174778
  const b = male ? 16.2606339 : -27.2384254
  const c = male ? -0.002388645 : 0.8211226769
  const d = male ? 0.001073276 : -0.008302939
  const e = male ? -0.0000001291 : 0.0000428546
  const x = bw
  const coeff = valid ? 500 / (a + b * x + c * x * x + d * x * x * x + e * x * x * x * x) : 0
  const wilks = valid ? t * coeff : 0

  return (
    <FormCalculatorShell title="Wilks Score" subtitle="Powerlifting comparison" badge="SPORTS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Body Weight" value={weight} onChange={setWeight} placeholder="80" id="wk-bw" unit="kg" />
        <RetroInput label="Total Lifted" value={total} onChange={setTotal} placeholder="500" id="wk-t" unit="kg" />
      </div>
      <RetroInput label="Gender (1=M, 0=F)" value={isMale} onChange={setIsMale} placeholder="1" id="wk-g" unit="" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Wilks Score" value={wilks.toFixed(1)} unit="pts" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Wilks Rating</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="wkGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#wkGrid)" rx="8" />
              <path d={wobblyBar(15, 25, 150, 25)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="3" />
              <path d={wobblyBar(15, 25, Math.min(150, (wilks / 500) * 150), 25)} fill="#f97316" fillOpacity="0.4" stroke="#ea580c" strokeWidth="1.5" rx="3" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{wilks.toFixed(0)} Wilks pts</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}