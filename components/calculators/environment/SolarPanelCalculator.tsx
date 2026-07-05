'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SolarPanelCalculator() {
  const [area, setArea] = useState('20')
  const [efficiency, setEfficiency] = useState('18')
  const [sunHours, setSunHours] = useState('5')

  const a = parseFloat(area), eff = parseFloat(efficiency), sh = parseFloat(sunHours)
  const valid = !isNaN(a) && !isNaN(eff) && !isNaN(sh) && a > 0 && eff > 0 && sh > 0
  // Power = area × efficiency × 1000 W/m² × sun hours / day
  const dailyWh = valid ? a * (eff / 100) * 1000 * sh : 0
  const dailyKwh = valid ? dailyWh / 1000 : 0
  const monthlyKwh = valid ? dailyKwh * 30 : 0

  return (
    <FormCalculatorShell title="Solar Panel Output" subtitle="P = Area × Eff × Sun" badge="ENVIRONMENT">
      <RetroInput label="Panel Area" value={area} onChange={setArea} placeholder="20" id="sp-a" unit="m²" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Efficiency" value={efficiency} onChange={setEfficiency} placeholder="18" id="sp-e" unit="%" />
        <RetroInput label="Peak Sun Hrs" value={sunHours} onChange={setSunHours} placeholder="5" id="sp-s" unit="h/day" />
      </div>
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Daily Output" value={dailyKwh.toFixed(2)} unit="kWh" large />
            <ResultDisplay label="Monthly" value={monthlyKwh.toFixed(0)} unit="kWh" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Solar Generation</span>
            <svg width="160" height="80" viewBox="0 0 160 80" className="select-none">
              <defs>
                <pattern id="spGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="80" fill="url(#spGrid)" rx="8" />
              {/* Sun */}
              <circle cx="30" cy="20" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              {/* Panel grid */}
              <path d={wobblyBar(50, 25, 90, 40)} fill="#1e40af" fillOpacity="0.2" stroke="#1e3a8a" strokeWidth="2" />
              {[60, 75, 90, 105, 120].map((x) => (
                <path key={x} d={`M ${x} 25 L ${x} 65`} stroke="#1e3a8a" strokeWidth="1" />
              ))}
              <path d="M 50 45 L 140 45" stroke="#1e3a8a" strokeWidth="1" />
              <text x="80" y="78" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#1e3a8a" fontWeight="bold">{dailyKwh.toFixed(1)} kWh/day</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}