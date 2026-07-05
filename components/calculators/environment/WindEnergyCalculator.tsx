'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function WindEnergyCalculator() {
  const [radius, setRadius] = useState('20')
  const [windSpeed, setWindSpeed] = useState('10')
  const airDensity = 1.225

  const r = parseFloat(radius), v = parseFloat(windSpeed)
  const valid = !isNaN(r) && !isNaN(v) && r > 0 && v > 0
  // P = 0.5 × ρ × A × v³ × Cp (Cp = 0.4 Betz limit)
  const area = valid ? Math.PI * r * r : 0
  const power = valid ? 0.5 * airDensity * area * Math.pow(v, 3) * 0.4 : 0
  const powerKW = valid ? power / 1000 : 0

  return (
    <FormCalculatorShell title="Wind Energy" subtitle="P = ½ × ρ × A × v³ × Cp" badge="ENVIRONMENT">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Rotor Radius" value={radius} onChange={setRadius} placeholder="20" id="we-r" unit="m" />
        <RetroInput label="Wind Speed" value={windSpeed} onChange={setWindSpeed} placeholder="10" id="we-v" unit="m/s" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Power Output" value={powerKW.toFixed(2)} unit="kW" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Wind Turbine</span>
            <svg width="140" height="100" viewBox="0 0 140 100" className="select-none">
              <defs>
                <pattern id="weGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="140" height="100" fill="url(#weGrid)" rx="8" />
              {/* Tower */}
              <path d="M 68 80 L 72 30 L 68 30 L 64 80 Z" fill="#78716c" stroke="#57534e" strokeWidth="1.5" />
              {/* Blades */}
              <path d="M 70 30 L 70 10" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
              <path d="M 70 30 L 90 40" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
              <path d="M 70 30 L 50 40" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
              <circle cx="70" cy="30" r="3" fill="#57534e" />
              {/* Wind arrows */}
              <path d="M 15 20 L 45 20" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2" />
              <path d="M 15 50 L 55 50" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="70" y="95" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#1e40af" fontWeight="bold">{powerKW.toFixed(1)} kW</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}