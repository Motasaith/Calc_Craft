'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WorkCalculator() {
  const [force, setForce] = useState('50')
  const [dist, setDist] = useState('10')
  const [angle, setAngle] = useState('0')

  const f = parseFloat(force), d = parseFloat(dist), ang = parseFloat(angle)
  const valid = !isNaN(f) && !isNaN(d) && !isNaN(ang) && f >= 0 && d >= 0
  const rad = (ang * Math.PI) / 180
  const work = valid ? f * d * Math.cos(rad) : 0

  const fLen = Math.min(80, f / 2)
  const fx = 45 + fLen * Math.cos(rad)
  const fy = 65 - fLen * Math.sin(rad)

  return (
    <FormCalculatorShell title="Work Calculator" subtitle="W = F × d × cos(θ)" badge="PHYSICS">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Force (F)" value={force} onChange={setForce} placeholder="50" id="wk-f" unit="N" />
        <RetroInput label="Distance (d)" value={dist} onChange={setDist} placeholder="10" id="wk-d" unit="m" />
      </div>
      <RetroInput label="Angle (θ)" value={angle} onChange={setAngle} placeholder="0" id="wk-ang" unit="degrees" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Work Done" value={work.toFixed(2)} unit="J" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Force-Angle Diagram</span>
            <svg width="180" height="100" viewBox="0 0 180 100" className="select-none">
              <defs>
                <pattern id="wGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="100" fill="url(#wGrid)" rx="8" />
              {/* Object */}
              <path d={wobblyRect(30, 55, 30, 20)} fill="#fde68a" stroke="#a16207" strokeWidth="2" />
              {/* Surface */}
              <path d="M 15 78 L 165 78" stroke="#4c5c4a" strokeWidth="2" />
              {/* Force vector at angle */}
              <path d={`M 45 65 L ${fx} ${fy}`} stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              <path d={`M ${fx} ${fy} L ${fx - 7 * Math.cos(rad - 0.4)} ${fy + 7 * Math.sin(rad - 0.4)} L ${fx - 7 * Math.cos(rad + 0.4)} ${fy + 7 * Math.sin(rad + 0.4)} Z`} fill="#dc2626" />
              <text x="90" y="20" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#dc2626" fontWeight="bold">W = {work.toFixed(1)} J</text>
              <text x="55" y="50" fontSize="8" fontFamily="monospace" fill="#6b7280">θ = {ang}°</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}