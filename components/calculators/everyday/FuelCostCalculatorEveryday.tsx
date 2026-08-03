'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FuelCostCalculatorEveryday() {
  const [distanceStr, setDistanceStr] = useState('100')
  const [mpgStr, setMpgStr] = useState('25')
  const [priceStr, setPriceStr] = useState('3.50')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, total: 0 }
    const dist = parseFloat(distanceStr)
    const mpg = parseFloat(mpgStr)
    const pr = parseFloat(priceStr)

    if (isNaN(dist) || isNaN(mpg) || isNaN(pr) || dist <= 0 || mpg <= 0 || pr <= 0) {
      return { ...defaultObj, error: 'Please enter valid journey parameters.' }
    }

    const total = (dist / mpg) * pr
    return { error: null, total }
  }, [distanceStr, mpgStr, priceStr])

  return (
    <FormCalculatorShell title="Trip Fuel Cost Solver" subtitle="Calculate total gasoline costs for custom road trips" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Trip Distance (miles)" value={distanceStr} onChange={setDistanceStr} id="fc-d" />
          <RetroInput label="Fuel Efficiency (MPG)" value={mpgStr} onChange={setMpgStr} id="fc-m" />
          <RetroInput label="Gas Price ($/gallon)" value={priceStr} onChange={setPriceStr} id="fc-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Journey Cost" value={results.total.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
