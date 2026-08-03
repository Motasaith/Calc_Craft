'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CompoundAnnualGrowthCalculator() {
  const [startStr, setStartStr] = useState('1000')
  const [endStr, setEndStr] = useState('2500')
  const [yearsStr, setYearsStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cagr: 0 }
    const s = parseFloat(startStr)
    const e = parseFloat(endStr)
    const y = parseFloat(yearsStr)

    if (isNaN(s) || isNaN(e) || isNaN(y) || s <= 0 || e <= 0 || y <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const cagr = (Math.pow(e / s, 1 / y) - 1) * 100
    return { error: null, cagr }
  }, [startStr, endStr, yearsStr])

  return (
    <FormCalculatorShell title="CAGR Growth Solver" subtitle="Calculate Compound Annual Growth Rates of assets over time" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Initial Value ($)" value={startStr} onChange={setStartStr} id="cagr-s" />
          <RetroInput label="Ending Value ($)" value={endStr} onChange={setEndStr} id="cagr-e" />
          <RetroInput label="Duration (Years)" value={yearsStr} onChange={setYearsStr} id="cagr-y" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="CAGR Percentage" value={`${results.cagr.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
