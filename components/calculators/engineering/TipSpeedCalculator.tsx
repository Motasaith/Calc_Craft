'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TipSpeedCalculator() {
  const [diameterStr, setDiameterStr] = useState('10') // inches
  const [rpmStr, setRpmStr] = useState('3000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, speed: 0 }
    const d = parseFloat(diameterStr)
    const rpm = parseFloat(rpmStr)

    if (isNaN(d) || isNaN(rpm) || d <= 0 || rpm <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    }

    // Tip Speed = pi * D * RPM / (12 * 60) in feet per second
    const speed = (Math.PI * d * rpm) / 720
    return { error: null, speed }
  }, [diameterStr, rpmStr])

  return (
    <FormCalculatorShell title="Propeller Tip Speed Solver" subtitle="Calculate propeller tip speeds in feet per second" badge="ENGINEERING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Propeller Diameter (inches)" value={diameterStr} onChange={setDiameterStr} id="ts-dia" />
          <RetroInput label="Propeller RPM" value={rpmStr} onChange={setRpmStr} id="ts-rpm" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Tip Speed" value={`${results.speed.toFixed(1)} ft/s`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
