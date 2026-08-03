'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function VoltageDropCalculator() {
  const [lengthStr, setLengthStr] = useState('100') // feet
  const [currentStr, setCurrentStr] = useState('15') // amps
  const [resistanceStr, setResistanceStr] = useState('1.29') // ohms per 1000ft (approx 12 AWG)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, drop: 0 }
    const l = parseFloat(lengthStr)
    const i = parseFloat(currentStr)
    const r = parseFloat(resistanceStr)

    if (isNaN(l) || isNaN(i) || isNaN(r) || l <= 0 || i < 0 || r < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Voltage drop = 2 * L * I * R / 1000 for single phase AC
    const drop = (2 * l * i * r) / 1000
    return { error: null, drop }
  }, [lengthStr, currentStr, resistanceStr])

  return (
    <FormCalculatorShell title="Electrical Voltage Drop Solver" subtitle="Calculate AC/DC conductor voltage drops over custom distances" badge="ENGINEERING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="One-way Distance (feet)" value={lengthStr} onChange={setLengthStr} id="vd-l" />
          <RetroInput label="Load Current (Amperes)" value={currentStr} onChange={setCurrentStr} id="vd-i" />
          <RetroInput label="Conductor Resistance (Ω per 1000ft)" value={resistanceStr} onChange={setResistanceStr} id="vd-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Voltage Drop" value={`${results.drop.toFixed(2)} Volts`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
