'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HomeAppreciationCalculator() {
  const [valueStr, setValueStr] = useState('200000')
  const [yearsStr, setYearsStr] = useState('5')
  const [rateStr, setRateStr] = useState('3.5') // % annual appreciation

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, futureValue: 0 }
    const v = parseFloat(valueStr)
    const y = parseFloat(yearsStr)
    const r = parseFloat(rateStr)

    if (isNaN(v) || isNaN(y) || isNaN(r) || v <= 0 || y < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const futureValue = v * Math.pow(1 + r / 100, y)
    return { error: null, futureValue }
  }, [valueStr, yearsStr, rateStr])

  return (
    <FormCalculatorShell title="Property Appreciation Solver" subtitle="Estimate compounding future valuations of residential real estate" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Current Home Value ($)" value={valueStr} onChange={setValueStr} id="ha-v" />
          <RetroInput label="Duration (Years)" value={yearsStr} onChange={setYearsStr} id="ha-y" />
          <RetroInput label="Annual Appreciation (%)" value={rateStr} onChange={setRateStr} id="ha-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Projected Appreciated Value" value={results.futureValue.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
