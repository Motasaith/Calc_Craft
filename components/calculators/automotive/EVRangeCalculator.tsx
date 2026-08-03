'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EVRangeCalculator() {
  const [batteryCapacityStr, setBatteryCapacityStr] = useState('75') // kWh
  const [consumptionStr, setConsumptionStr] = useState('300') // Wh/mi

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, range: 0, steps: [] as string[] }
    const cap = parseFloat(batteryCapacityStr)
    const cons = parseFloat(consumptionStr)
    if (isNaN(cap) || isNaN(cons) || cap <= 0 || cons <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    // range = (cap in Wh) / consumption
    const range = (cap * 1000) / cons
    return {
      error: null,
      range,
      steps: [
        `Total Energy = ${cap} kWh × 1000 = ${cap * 1000} Wh`,
        `Range = Total Energy / Consumption = ${range.toFixed(1)} miles`
      ]
    }
  }, [batteryCapacityStr, consumptionStr])

  return (
    <FormCalculatorShell title="EV Range Solver" subtitle="Estimate electric vehicle range based on battery capacity" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Battery Size Capacity (kWh)" value={batteryCapacityStr} onChange={setBatteryCapacityStr} id="evr-c" />
          <RetroInput label="Energy Consumption (Wh/mile)" value={consumptionStr} onChange={setConsumptionStr} id="evr-con" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Range (miles)" value={results.range.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
