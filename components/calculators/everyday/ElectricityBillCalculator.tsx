'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ElectricityBillCalculator() {
  const [wattsStr, setWattsStr] = useState('500') // device wattage
  const [hoursStr, setHoursStr] = useState('8') // hours per day
  const [rateStr, setRateStr] = useState('0.15') // $ per kWh

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, monthly: 0 }
    const w = parseFloat(wattsStr)
    const h = parseFloat(hoursStr)
    const rate = parseFloat(rateStr)

    if (isNaN(w) || isNaN(h) || isNaN(rate) || w < 0 || h < 0 || rate < 0) {
      return { ...defaultObj, error: 'Please enter valid power parameters.' }
    }

    const dailyKwh = (w * h) / 1000
    const monthlyKwh = dailyKwh * 30
    const monthly = monthlyKwh * rate

    return { error: null, monthly }
  }, [wattsStr, hoursStr, rateStr])

  return (
    <FormCalculatorShell title="Appliance Utility Solver" subtitle="Estimate monthly electric utility bills for single appliances" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Device Power (Watts)" value={wattsStr} onChange={setWattsStr} id="eb-w" />
          <RetroInput label="Usage Time (Hours/Day)" value={hoursStr} onChange={setHoursStr} id="eb-h" />
          <RetroInput label="Utility Rate ($/kWh)" value={rateStr} onChange={setRateStr} id="eb-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Monthly Cost" value={results.monthly.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
