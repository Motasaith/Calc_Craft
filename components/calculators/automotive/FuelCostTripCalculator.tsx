'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FuelCostTripCalculator() {
  const [distanceStr, setDistanceStr] = useState('300') // miles
  const [mpgStr, setMpgStr] = useState('25')
  const [priceStr, setPriceStr] = useState('3.50') // per gallon

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, totalCost: 0, steps: [] as string[] }
    const d = parseFloat(distanceStr)
    const mpg = parseFloat(mpgStr)
    const p = parseFloat(priceStr)
    if (isNaN(d) || isNaN(mpg) || isNaN(p) || d <= 0 || mpg <= 0 || p <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const gallons = d / mpg
    const totalCost = gallons * p
    return {
      error: null,
      totalCost,
      steps: [
        `Gallons consumed = Distance / MPG = ${gallons.toFixed(2)} gallons`,
        `Trip Cost = Gallons × Price per gallon = ${totalCost.toLocaleString(undefined, {style: 'currency', currency: 'USD'})}`
      ]
    }
  }, [distanceStr, mpgStr, priceStr])

  return (
    <FormCalculatorShell title="Trip Fuel Cost Solver" subtitle="Calculate total fuel expenditure for vehicle journeys" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Trip Distance (miles)" value={distanceStr} onChange={setDistanceStr} id="fct-d" />
          <RetroInput label="Fuel Economy (MPG)" value={mpgStr} onChange={setMpgStr} id="fct-mpg" />
          <RetroInput label="Fuel Price ($ per Gallon)" value={priceStr} onChange={setPriceStr} id="fct-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Trip Cost" value={results.totalCost.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
