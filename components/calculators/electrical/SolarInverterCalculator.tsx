'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyCircle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`
}

export default function SolarInverterCalculator() {
  const [panelWattage, setPanelWattage] = useState('4000')
  const [systemVoltage, setSystemVoltage] = useState('48')

  const watts = parseFloat(panelWattage) || 0
  const volts = parseFloat(systemVoltage) || 0

  // Inverter should be sized at 120% of total panel wattage
  const inverterWatts = watts * 1.2
  const inverterKw = inverterWatts / 1000
  const inverterAmps = volts > 0 ? inverterWatts / volts : 0

  const valid = watts > 0 && volts > 0

  const radius = Math.min(40, inverterKw * 4)

  return (
    <FormCalculatorShell
      title="Solar Inverter Calculator"
      subtitle="Size your solar inverter correctly"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Total Panel Wattage" value={panelWattage} onChange={setPanelWattage} unit="W" min={0} />
        <RetroInput label="System Voltage" value={systemVoltage} onChange={setSystemVoltage} unit="V" min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Inverter Size" value={inverterKw.toFixed(2)} unit="kW" large />
            <ResultDisplay label="Inverter Current" value={inverterAmps.toFixed(2)} unit="A" />
          </>
        )}
      </div>

      {valid && (
        <div className="mt-3 flex justify-center">
          <svg width="120" height="100" viewBox="0 0 120 100">
            <path d={wobblyCircle(60, 50, radius)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}