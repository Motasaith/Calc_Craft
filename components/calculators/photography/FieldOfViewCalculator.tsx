'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FieldOfViewCalculator() {
  const [focal, setFocal] = useState('50')
  const [sensorW, setSensorW] = useState('36')
  const [sensorH, setSensorH] = useState('24')

  const f = parseFloat(focal), sw = parseFloat(sensorW), sh = parseFloat(sensorH)
  const valid = !isNaN(f) && !isNaN(sw) && !isNaN(sh) && f > 0 && sw > 0 && sh > 0
  const fovH = valid ? 2 * Math.atan(sw / (2 * f)) * (180 / Math.PI) : 0
  const fovV = valid ? 2 * Math.atan(sh / (2 * f)) * (180 / Math.PI) : 0
  const fovD = valid ? 2 * Math.atan(Math.sqrt(sw * sw + sh * sh) / (2 * f)) * (180 / Math.PI) : 0

  return (
    <FormCalculatorShell title="Field of View" subtitle="FOV = 2 × arctan(sensor / 2f)" badge="PHOTOGRAPHY">
      <RetroInput label="Focal Length" value={focal} onChange={setFocal} placeholder="50" id="fov-f" unit="mm" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Sensor W" value={sensorW} onChange={setSensorW} placeholder="36" id="fov-sw" unit="mm" />
        <RetroInput label="Sensor H" value={sensorH} onChange={setSensorH} placeholder="24" id="fov-sh" unit="mm" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="FOV H" value={fovH.toFixed(1)} unit="°" />
            <ResultDisplay label="FOV V" value={fovV.toFixed(1)} unit="°" />
            <ResultDisplay label="FOV D" value={fovD.toFixed(1)} unit="°" />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">View Cone</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="fovGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#fovGrid)" rx="8" />
              {/* Camera */}
              <path d={wobblyRect(15, 30, 20, 20)} fill="#78716c" fillOpacity="0.3" stroke="#57534e" strokeWidth="2" />
              {/* FOV cone */}
              <path d={`M 35 40 L ${35 + 120 * Math.cos((fovH / 2) * (Math.PI / 180))} ${40 - 120 * Math.sin((fovH / 2) * (Math.PI / 180))}`} stroke="#ec4899" strokeWidth="2" />
              <path d={`M 35 40 L ${35 + 120 * Math.cos((fovH / 2) * (Math.PI / 180))} ${40 + 120 * Math.sin((fovH / 2) * (Math.PI / 180))}`} stroke="#ec4899" strokeWidth="2" />
              <path d={`M 35 40 L ${35 + 120 * Math.cos((fovH / 2) * (Math.PI / 180))} ${40 - 120 * Math.sin((fovH / 2) * (Math.PI / 180))} L ${35 + 120 * Math.cos((fovH / 2) * (Math.PI / 180))} ${40 + 120 * Math.sin((fovH / 2) * (Math.PI / 180))} Z`} fill="#ec4899" fillOpacity="0.1" />
              <text x="90" y="75" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ec4899" fontWeight="bold">FOV: {fovH.toFixed(0)}°</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}