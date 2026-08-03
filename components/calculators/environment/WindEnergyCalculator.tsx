'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WindEnergyCalculator() {
  const [speedStr, setSpeedStr] = useState('12') // mph
  const [radiusStr, setRadiusStr] = useState('10') // feet rotor radius

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, power: 0 }
    const v = parseFloat(speedStr)
    const r = parseFloat(radiusStr)

    if (isNaN(v) || isNaN(r) || v < 0 || r <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive wind speed and rotor radius.' }
    }

    // Convert mph to m/s, feet to meters
    const vMps = v * 0.44704
    const rM = r * 0.3048
    const area = Math.PI * rM * rM
    const rho = 1.225 // air density kg/m³
    // P = 0.5 * rho * A * v³
    const power = 0.5 * rho * area * Math.pow(vMps, 3) * 0.35 // 35% turbine efficiency

    return { error: null, power }
  }, [speedStr, radiusStr])

  return (
    <FormCalculatorShell title="Wind Turbine Power Output Solver" subtitle="Estimate electrical wattage output based on wind speed and rotor radius" badge="ENVIRONMENT">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Wind Speed (mph)" value={speedStr} onChange={setSpeedStr} id="we-s" />
          <RetroInput label="Rotor Radius (feet)" value={radiusStr} onChange={setRadiusStr} id="we-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Output (Watts)" value={`${results.power.toFixed(1)} W`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
