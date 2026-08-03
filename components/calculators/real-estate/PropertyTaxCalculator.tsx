'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PropertyTaxCalculator() {
  const [valueStr, setValueStr] = useState('250000') // appraised value
  const [millageStr, setMillageStr] = useState('1.2') // % rate or millage

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tax: 0 }
    const v = parseFloat(valueStr)
    const m = parseFloat(millageStr)

    if (isNaN(v) || isNaN(m) || v <= 0 || m < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const tax = v * (m / 100)
    return { error: null, tax }
  }, [valueStr, millageStr])

  return (
    <FormCalculatorShell title="Property Tax Solver" subtitle="Calculate annual property taxes from millage assessment rates" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Property Appraised Value ($)" value={valueStr} onChange={setValueStr} id="pt-v" />
          <RetroInput label="Assessment Tax Rate (%)" value={millageStr} onChange={setMillageStr} id="pt-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Annual Tax Due" value={results.tax.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
