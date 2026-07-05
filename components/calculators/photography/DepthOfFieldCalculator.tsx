'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DepthOfFieldCalculator() {
  const [focal, setFocal] = useState('50')
  const [aperture, setAperture] = useState('2.8')
  const [distance, setDistance] = useState('5')
  const [coc, setCoc] = useState('0.03')

  const f = parseFloat(focal), ap = parseFloat(aperture), d = parseFloat(distance), c = parseFloat(coc)
  const valid = !isNaN(f) && !isNaN(ap) && !isNaN(d) && !isNaN(c) && f > 0 && ap > 0 && d > 0 && c > 0
  // Hyperfocal distance
  const H = valid ? (f * f) / (ap * c) + f : 0
  // Near and far limits (in mm → convert to m)
  const near = valid ? (d * (H - f)) / (H + d - 2 * f) / 1000 : 0
  const far = valid ? (d * (H - f)) / (H - d) / 1000 : 0
  const dof = valid ? Math.abs(far - near) : 0

  return (
    <FormCalculatorShell title="Depth of Field" subtitle="DOF from hyperfocal distance" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Focal Length" value={focal} onChange={setFocal} placeholder="50" id="dof-f" unit="mm" />
        <RetroInput label="Aperture (f/)" value={aperture} onChange={setAperture} placeholder="2.8" id="dof-ap" unit="" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Distance" value={distance} onChange={setDistance} placeholder="5" id="dof-d" unit="m" />
        <RetroInput label="Circle of Confusion" value={coc} onChange={setCoc} placeholder="0.03" id="dof-c" unit="mm" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="Near" value={near.toFixed(2)} unit="m" />
            <ResultDisplay label="Far" value={far.toFixed(2)} unit="m" />
            <ResultDisplay label="DOF" value={dof.toFixed(2)} unit="m" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Focus Range</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="dofGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#dofGrid)" rx="8" />
              {/* Camera */}
              <path d={wobblyRect(15, 25, 25, 20)} fill="#78716c" fillOpacity="0.3" stroke="#57534e" strokeWidth="2" />
              {/* Focus line */}
              <path d="M 45 35 L 165 35" stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />
              {/* DOF zone */}
              <path d={wobblyRect(45 + Math.min(120, near * 20), 25, Math.min(120, far * 20) - Math.min(120, near * 20), 20)} fill="#fbbf24" fillOpacity="0.2" stroke="#d97706" strokeWidth="1.5" />
              {/* Subject */}
              <circle cx={45 + Math.min(120, d * 20)} cy="35" r="5" fill="#ec4899" stroke="#be185d" strokeWidth="2" />
              <text x="90" y="65" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#d97706" fontWeight="bold">DOF: {dof.toFixed(2)}m</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}