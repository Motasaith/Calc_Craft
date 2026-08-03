'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WaterHeaterSizeCalculator() {
  const [peopleStr, setPeopleStr] = useState('4')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, size: 0 }
    const p = parseInt(peopleStr)
    if (isNaN(p) || p <= 0) return { ...defaultObj, error: 'Please enter a valid count.' }
    // General sizing: 1-2 people = 30 gal, 3-4 = 40 gal, 5+ = 50+ gal
    let size = 30
    if (p >= 5) size = 50
    else if (p >= 3) size = 40
    return { error: null, size }
  }, [peopleStr])

  return (
    <FormCalculatorShell title="Water Heater Tank Sizing Solver" subtitle="Estimate required hot water tank capacity based on occupancy" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Household Members" value={peopleStr} onChange={setPeopleStr} id="whs-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Recommended Tank Capacity" value={`${results.size} Gallons`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
