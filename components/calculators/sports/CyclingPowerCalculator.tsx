'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CyclingPowerCalculator() {
  const [speedStr, setSpeedStr] = useState('20') // mph
  const [weightStr, setWeightStr] = useState('170') // rider + bike weight lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, power: 0 }
    const speed = parseFloat(speedStr)
    const weight = parseFloat(weightStr)

    if (isNaN(speed) || isNaN(weight) || speed <= 0 || weight <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Rough approximation of power output: rolling resistance + aerodynamic drag
    const vMps = speed * 0.44704
    const wKg = weight * 0.453592
    const gravityPower = 0 // assuming flat road
    const aeroPower = 0.5 * 1.225 * 0.5 * 0.9 * Math.pow(vMps, 3)
    const rollPower = 0.005 * wKg * 9.81 * vMps
    const power = (aeroPower + rollPower + gravityPower) / 0.95 // drivetrain loss

    return { error: null, power }
  }, [speedStr, weightStr])

  return (
    <FormCalculatorShell title="Cycling Power Output Solver" subtitle="Estimate target cycling wattage based on speed and rider weights" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Riding Speed (mph)" value={speedStr} onChange={setSpeedStr} id="cp-s" />
          <RetroInput label="Total Weight (Rider + Bike, lbs)" value={weightStr} onChange={setWeightStr} id="cp-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Power (Watts)" value={`${Math.round(results.power)} W`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
