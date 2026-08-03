'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SolarInverterCalculator() {
  const [arrayStr, setArrayStr] = useState('4000') // Watts DC

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, size: 0 }
    const array = parseFloat(arrayStr)
    if (isNaN(array) || array <= 0) return { ...defaultObj, error: 'Please enter a valid array size.' }
    // standard sizing inverter ratio around 1.15 to 1.25
    const size = array / 1.2
    return { error: null, size }
  }, [arrayStr])

  return (
    <FormCalculatorShell title="Solar Inverter Sizing Solver" subtitle="Estimate inverter output capacity sizing based on solar arrays" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Solar Array Rating (Watts DC)" value={arrayStr} onChange={setArrayStr} id="si-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Recommended Inverter Size" value={`${Math.round(results.size)} Watts AC`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
