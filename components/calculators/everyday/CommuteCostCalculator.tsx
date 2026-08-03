'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CommuteCostCalculator() {
  const [distanceStr, setDistanceStr] = useState('20') // miles one-way
  const [mpgStr, setMpgStr] = useState('25')
  const [gasPriceStr, setGasPriceStr] = useState('3.50')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, daily: 0 }
    const dist = parseFloat(distanceStr)
    const mpg = parseFloat(mpgStr)
    const gas = parseFloat(gasPriceStr)

    if (isNaN(dist) || isNaN(mpg) || isNaN(gas) || dist <= 0 || mpg <= 0 || gas <= 0) {
      return { ...defaultObj, error: 'Please enter valid commute parameters.' }
    }

    const dailyGallons = (dist * 2) / mpg
    const daily = dailyGallons * gas

    return { error: null, daily }
  }, [distanceStr, mpgStr, gasPriceStr])

  return (
    <FormCalculatorShell title="Commute Expense Solver" subtitle="Estimate daily vehicle travel fuel expenditures" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Distance to Work (miles one-way)" value={distanceStr} onChange={setDistanceStr} id="cc-dis" />
          <RetroInput label="Vehicle Fuel Economy (MPG)" value={mpgStr} onChange={setMpgStr} id="cc-mpg" />
          <RetroInput label="Gas Price per Gallon ($)" value={gasPriceStr} onChange={setGasPriceStr} id="cc-gas" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Daily Commute Fuel Cost" value={results.daily.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
