'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function ConeCalculator() {
  const [radius, setRadius] = useState('3')
  const [height, setHeight] = useState('4')
  const [result, setResult] = useState<{volume:number,slant:number,lateral:number,total:number}|null>(null)

  const calculate = () => {
    const r = parseFloat(radius), h = parseFloat(height)
    if (isNaN(r)||isNaN(h) || r<=0 || h<=0) { setResult(null); return }
    const slant = Math.sqrt(r*r + h*h)
    const volume = (1/3) * Math.PI * r * r * h
    const lateral = Math.PI * r * slant
    const total = lateral + Math.PI * r * r
    setResult({ volume, slant, lateral, total })
  }

  // Visual shape morphing calculations
  const rVal = parseFloat(radius) || 3
  const hVal = parseFloat(height) || 4
  const scaleX = Math.min(1.4, Math.max(0.5, rVal / 3))
  const scaleY = Math.min(1.4, Math.max(0.5, hVal / 4))
  const rx = Math.min(65, 45 * scaleX)
  const ry = 10
  const coneHeight = Math.min(120, 80 * scaleY)
  const cx = 100
  const cy = 100
  const topY = cy - coneHeight / 2
  const bottomY = cy + coneHeight / 2

  return (
    <FormCalculatorShell title="Cone Calculator" badge="GEOMETRY">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <RetroInput label="Radius" value={radius} onChange={setRadius} placeholder="3" id="cone-r" />
          <RetroInput label="Height" value={height} onChange={setHeight} placeholder="4" id="cone-h" />
          <div className="pt-2">
            <RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton>
          </div>
        </div>

        {/* Dynamic Morphing Cone Diagram */}
        <div className="flex justify-center items-center bg-[#cbd8ca]/30 border border-neutral-300 rounded-xl p-2 h-[210px]">
          <svg width="100%" height="200" viewBox="0 0 200 200" className="drop-shadow-sm select-none">
            <defs>
              <pattern id="draftGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4c5c4a" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#687e66" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4c5c4a" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <rect width="200" height="200" fill="url(#draftGrid)" rx="8" />

            {/* Cone Fills (Sides and base) */}
            <path d={`M ${cx - rx} ${bottomY} L ${cx} ${topY} L ${cx + rx} ${bottomY} Z`} fill="url(#coneGrad)" />

            {/* Hidden back of base ellipse (dashed) */}
            <path d={`M ${cx - rx} ${bottomY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${bottomY}`} stroke="#374151" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            {/* Front of base ellipse */}
            <path d={`M ${cx - rx} ${bottomY} A ${rx} ${ry} 0 0 1 ${cx + rx} ${bottomY}`} stroke="#374151" strokeWidth="2.5" fill="none" />

            {/* Cone sides */}
            <line x1={cx - rx} y1={bottomY} x2={cx} y2={topY} stroke="#374151" strokeWidth="2.5" />
            <line x1={cx + rx} y1={bottomY} x2={cx} y2={topY} stroke="#374151" strokeWidth="2.5" />

            {/* Height Line inside cone */}
            <line x1={cx} y1={topY} x2={cx} y2={bottomY} stroke="#1d4ed8" strokeWidth="1.8" strokeDasharray="3 2" />
            <circle cx={cx} cy={topY} r="3" fill="#1d4ed8" />
            <circle cx={cx} cy={bottomY} r="3" fill="#1d4ed8" />
            <text x={cx - 6} y={(topY + bottomY) / 2} fill="#1d4ed8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="end">
              h={hVal.toFixed(1)}
            </text>

            {/* Radius line inside base */}
            <line x1={cx} y1={bottomY} x2={cx + rx} y2={bottomY} stroke="#b91c1c" strokeWidth="2" />
            <circle cx={cx + rx} cy={bottomY} r="3" fill="#b91c1c" />
            <text x={cx + rx / 2} y={bottomY - 4} fill="#b91c1c" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              r={rVal.toFixed(1)}
            </text>

            {/* Slant Height Label (on right edge) */}
            <text x={cx + rx / 2 + 10} y={(topY + bottomY) / 2 - 8} fill="#374151" fontSize="9" fontWeight="medium" fontFamily="monospace" textAnchor="start">
              s={Math.sqrt(rVal*rVal + hVal*hVal).toFixed(1)}
            </text>
          </svg>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Volume" value={result.volume.toFixed(2)} />
          <ResultDisplay label="Slant Height" value={result.slant.toFixed(2)} />
          <ResultDisplay label="Lateral Area" value={result.lateral.toFixed(2)} />
          <ResultDisplay label="Total Area" value={result.total.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
