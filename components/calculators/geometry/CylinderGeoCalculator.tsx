'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function CylinderGeoCalculator() {
  const [radius, setRadius] = useState('3')
  const [height, setHeight] = useState('10')
  const [result, setResult] = useState<{volume:number,lateral:number,total:number}|null>(null)

  const calculate = () => {
    const r = parseFloat(radius), h = parseFloat(height)
    if (isNaN(r)||isNaN(h) || r<=0 || h<=0) { setResult(null); return }
    const volume = Math.PI * r * r * h
    const lateral = 2 * Math.PI * r * h
    const total = lateral + 2 * Math.PI * r * r
    setResult({ volume, lateral, total })
  }

  // Visual shape morphing calculations
  const rVal = parseFloat(radius) || 3
  const hVal = parseFloat(height) || 10
  const scaleX = Math.min(1.4, Math.max(0.5, rVal / 3))
  const scaleY = Math.min(1.4, Math.max(0.5, hVal / 10))
  const rx = Math.min(65, 45 * scaleX)
  const ry = 12
  const cylHeight = Math.min(110, 80 * scaleY)
  const cx = 100
  const cy = 100
  const topY = cy - cylHeight / 2
  const bottomY = cy + cylHeight / 2

  return (
    <FormCalculatorShell title="Cylinder Calculator" badge="GEOMETRY">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <RetroInput label="Radius" value={radius} onChange={setRadius} placeholder="3" id="cyl-r" />
          <RetroInput label="Height" value={height} onChange={setHeight} placeholder="10" id="cyl-h" />
          <div className="pt-2">
            <RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton>
          </div>
        </div>

        {/* Dynamic Morphing Cylinder Diagram */}
        <div className="flex justify-center items-center bg-[#cbd8ca]/30 border border-neutral-300 rounded-xl p-2 h-[210px]">
          <svg width="100%" height="200" viewBox="0 0 200 200" className="drop-shadow-sm select-none">
            <defs>
              <pattern id="draftGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              </pattern>
              <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4c5c4a" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#687e66" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4c5c4a" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <rect width="200" height="200" fill="url(#draftGrid)" rx="8" />

            {/* Cylinder Body (back lines & fills) */}
            <path d={`M ${cx - rx} ${topY} L ${cx - rx} ${bottomY}`} stroke="#374151" strokeWidth="2.5" />
            <path d={`M ${cx + rx} ${topY} L ${cx + rx} ${bottomY}`} stroke="#374151" strokeWidth="2.5" />
            <rect x={cx - rx} y={topY} width={rx * 2} height={cylHeight} fill="url(#cylinderGrad)" />

            {/* Bottom hidden ellipse (dashed) */}
            <path d={`M ${cx - rx} ${bottomY} A ${rx} ${ry} 0 0 0 ${cx + rx} ${bottomY}`} stroke="#374151" strokeWidth="2" strokeDasharray="4 3" fill="none" />
            {/* Bottom front visible ellipse */}
            <path d={`M ${cx - rx} ${bottomY} A ${rx} ${ry} 0 0 1 ${cx + rx} ${bottomY}`} stroke="#374151" strokeWidth="2.5" fill="none" />
            
            {/* Top ellipse */}
            <ellipse cx={cx} cy={topY} rx={rx} ry={ry} stroke="#374151" strokeWidth="2.5" fill="#cbd8ca" />

            {/* Radius line indicator */}
            <line x1={cx} y1={topY} x2={cx + rx} y2={topY} stroke="#b91c1c" strokeWidth="2" strokeDasharray="2 2" />
            <circle cx={cx} cy={topY} r="3" fill="#b91c1c" />
            <circle cx={cx + rx} cy={topY} r="3" fill="#b91c1c" />
            <text x={cx + rx / 2} y={topY - 6} fill="#b91c1c" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              r={rVal.toFixed(1)}
            </text>

            {/* Height line indicator */}
            <line x1={cx - rx - 12} y1={topY} x2={cx - rx - 12} y2={bottomY} stroke="#1d4ed8" strokeWidth="2" />
            <line x1={cx - rx} y1={topY} x2={cx - rx - 16} y2={topY} stroke="#9ca3af" strokeWidth="1" strokeDasharray="2 2" />
            <line x1={cx - rx} y1={bottomY} x2={cx - rx - 16} y2={bottomY} stroke="#9ca3af" strokeWidth="1" strokeDasharray="2 2" />
            <path d={`M ${cx - rx - 15} ${topY + 5} L ${cx - rx - 12} ${topY} L ${cx - rx - 9} ${topY + 5}`} fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
            <path d={`M ${cx - rx - 15} ${bottomY - 5} L ${cx - rx - 12} ${bottomY} L ${cx - rx - 9} ${bottomY - 5}`} fill="none" stroke="#1d4ed8" strokeWidth="1.5" />
            <text x={cx - rx - 20} y={cy} fill="#1d4ed8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">
              h={hVal.toFixed(1)}
            </text>
          </svg>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Volume" value={result.volume.toFixed(2)} />
          <ResultDisplay label="Lateral Area" value={result.lateral.toFixed(2)} />
          <ResultDisplay label="Total Area" value={result.total.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
