'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CarbonFootprintCalculator() {
  const [electricity, setElectricity] = useState('300')
  const [gas, setGas] = useState('50')
  const [mileage, setMileage] = useState('12000')

  const e = parseFloat(electricity), g = parseFloat(gas), m = parseFloat(mileage)
  const valid = !isNaN(e) && !isNaN(g) && !isNaN(m) && e >= 0 && g >= 0 && m >= 0
  // Electricity: 0.4 kg CO2/kWh/month × 12
  // Gas: 2.3 kg CO2/therm/month × 12
  // Car: 0.4 kg CO2/mile
  const elecCO2 = valid ? e * 0.4 * 12 : 0
  const gasCO2 = valid ? g * 2.3 * 12 : 0
  const carCO2 = valid ? m * 0.4 : 0
  const total = valid ? elecCO2 + gasCO2 + carCO2 : 0

  return (
    <FormCalculatorShell title="Carbon Footprint" subtitle="CO₂ from energy + transport" badge="ENVIRONMENT">
      <RetroInput label="Electricity" value={electricity} onChange={setElectricity} placeholder="300" id="cf-e" unit="kWh/mo" />
      <RetroInput label="Natural Gas" value={gas} onChange={setGas} placeholder="50" id="cf-g" unit="therms/mo" />
      <RetroInput label="Car Mileage" value={mileage} onChange={setMileage} placeholder="12000" id="cf-m" unit="mi/yr" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Annual CO₂" value={total.toFixed(0)} unit="kg" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">CO₂ Breakdown</span>
            <svg width="180" height="80" viewBox="0 0 180 80" className="select-none">
              <defs>
                <pattern id="cfGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="80" fill="url(#cfGrid)" rx="8" />
              <path d={wobblyBar(20, 50 - (elecCO2 / total) * 40, 40, (elecCO2 / total) * 40)} fill="#fbbf24" fillOpacity="0.4" stroke="#d97706" strokeWidth="1.5" />
              <text x="40" y="72" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#d97706">Elec</text>
              <path d={wobblyBar(70, 50 - (gasCO2 / total) * 40, 40, (gasCO2 / total) * 40)} fill="#60a5fa" fillOpacity="0.4" stroke="#2563eb" strokeWidth="1.5" />
              <text x="90" y="72" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#2563eb">Gas</text>
              <path d={wobblyBar(120, 50 - (carCO2 / total) * 40, 40, (carCO2 / total) * 40)} fill="#84cc16" fillOpacity="0.4" stroke="#65a30d" strokeWidth="1.5" />
              <text x="140" y="72" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#65a30d">Car</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}