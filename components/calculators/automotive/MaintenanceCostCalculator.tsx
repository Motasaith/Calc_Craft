'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MaintenanceCostCalculator() {
  const [milesStr, setMilesStr] = useState('12000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cost: 0 }
    const m = parseFloat(milesStr)
    if (isNaN(m) || m < 0) return { ...defaultObj, error: 'Please enter a valid mileage.' }
    // Assume average maintenance of $0.09 per mile
    const cost = m * 0.09
    return { error: null, cost }
  }, [milesStr])

  return (
    <FormCalculatorShell title="Car Maintenance Cost Solver" subtitle="Estimate yearly maintenance costs based on miles driven" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Annual Miles Driven" value={milesStr} onChange={setMilesStr} id="mc-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Yearly Cost" value={results.cost.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
