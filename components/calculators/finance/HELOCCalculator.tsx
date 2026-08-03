'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HELOCCalculator() {
  const [valueStr, setValueStr] = useState('300000')
  const [mortgageStr, setMortgageStr] = useState('150000')
  const [ltvStr, setLtvStr] = useState('80') // % LTV limit

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, heloc: 0 }
    const val = parseFloat(valueStr)
    const mort = parseFloat(mortgageStr)
    const ltv = parseFloat(ltvStr)

    if (isNaN(val) || isNaN(mort) || isNaN(ltv) || val <= 0 || mort < 0 || ltv < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const maxLine = val * (ltv / 100)
    const heloc = Math.max(0, maxLine - mort)

    return { error: null, heloc }
  }, [valueStr, mortgageStr, ltvStr])

  return (
    <FormCalculatorShell title="HELOC Equity Line Solver" subtitle="Calculate maximum borrowing limits for Home Equity Lines of Credit" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Home Appraised Value ($)" value={valueStr} onChange={setValueStr} id="heloc-v" />
          <RetroInput label="Current Mortgage Balance ($)" value={mortgageStr} onChange={setMortgageStr} id="heloc-m" />
          <RetroInput label="Max Allowed LTV Limit (%)" value={ltvStr} onChange={setLtvStr} id="heloc-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="HELOC Line Available" value={results.heloc.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
