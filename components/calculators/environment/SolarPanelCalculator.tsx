'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SolarPanelCalculator() {
  const [billStr, setBillStr] = useState('150') // $ monthly electric bill
  const [sunHoursStr, setSunHoursStr] = useState('4.5') // peak sun hours/day

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, kwNeeded: 0, steps: [] as string[] }
    const bill = parseFloat(billStr)
    const sun = parseFloat(sunHoursStr)
    if (isNaN(bill) || isNaN(sun) || bill <= 0 || sun <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    // Assume electricity rate of $0.15/kWh
    const kwhMonthly = bill / 0.15
    const kwhDaily = kwhMonthly / 30
    const kwNeeded = (kwhDaily / sun) * 1.2 // 1.2 inefficiency factor
    return {
      error: null,
      kwNeeded,
      steps: [
        `Estimated monthly usage = $${bill} / $0.15 = ${kwhMonthly.toFixed(1)} kWh`,
        `Estimated daily usage = ${kwhDaily.toFixed(1)} kWh/day`,
        `Required Solar Array capacity = (Daily usage / Sun hours) × 1.2 = ${kwNeeded.toFixed(2)} kW`
      ]
    }
  }, [billStr, sunHoursStr])

  return (
    <FormCalculatorShell title="Solar Panel Array Sizing Solver" subtitle="Estimate solar array size needed based on monthly bills" badge="ENVIRONMENT">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Monthly Electric Bill ($)" value={billStr} onChange={setBillStr} id="sol-b" />
          <RetroInput label="Average Peak Sun Hours per Day" value={sunHoursStr} onChange={setSunHoursStr} id="sol-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Array Size Required (kW)" value={results.kwNeeded.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
