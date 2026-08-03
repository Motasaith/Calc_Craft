'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LaundryCostCalculator() {
  const [loadsStr, setLoadsStr] = useState('4') // loads per week
  const [costPerLoad, setCostPerLoad] = useState('1.50') // $ detergent + utility

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, annual: 0 }
    const l = parseFloat(loadsStr)
    const c = parseFloat(costPerLoad)

    if (isNaN(l) || isNaN(c) || l < 0 || c < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const annual = l * 52 * c
    return { error: null, annual }
  }, [loadsStr, costPerLoad])

  return (
    <FormCalculatorShell title="Laundry Utility Solver" subtitle="Estimate yearly household expenditures on laundry washing loads" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Loads per Week" value={loadsStr} onChange={setLoadsStr} id="lc-l" />
          <RetroInput label="Cost per Load ($)" value={costPerLoad} onChange={setCostPerLoad} id="lc-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Annual Cost" value={results.annual.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
