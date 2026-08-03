'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MileageCalculator() {
  const [milesStr, setMilesStr] = useState('300')
  const [gallonsStr, setGallonsStr] = useState('10')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, mpg: 0 }
    const m = parseFloat(milesStr)
    const g = parseFloat(gallonsStr)

    if (isNaN(m) || isNaN(g) || m <= 0 || g <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const mpg = m / g
    return { error: null, mpg }
  }, [milesStr, gallonsStr])

  return (
    <FormCalculatorShell title="Gas Mileage MPG Solver" subtitle="Calculate average vehicle gas mileage efficiency ratios" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Miles Driven" value={milesStr} onChange={setMilesStr} id="mil-m" />
          <RetroInput label="Gallons Consumed" value={gallonsStr} onChange={setGallonsStr} id="mil-g" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Fuel Economy (MPG)" value={`${results.mpg.toFixed(1)} MPG`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
