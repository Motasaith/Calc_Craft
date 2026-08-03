'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EstateTaxCalculator() {
  const [estateStr, setEstateStr] = useState('15000000') // $ total estate value
  const [exclusionStr, setExclusionStr] = useState('13610000') // 2024 exclusion

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, taxable: 0, tax: 0 }
    const estate = parseFloat(estateStr)
    const exclusion = parseFloat(exclusionStr)

    if (isNaN(estate) || isNaN(exclusion) || estate < 0 || exclusion < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const taxable = Math.max(0, estate - exclusion)
    const tax = taxable * 0.40 // 40% top federal rate

    return { error: null, taxable, tax }
  }, [estateStr, exclusionStr])

  return (
    <FormCalculatorShell title="Estate Inheritance Tax Solver" subtitle="Estimate federal estate tax liability using exclusion limits" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Estate Market Value ($)" value={estateStr} onChange={setEstateStr} id="et-v" />
          <RetroInput label="Unified Exclusion Limit ($)" value={exclusionStr} onChange={setExclusionStr} id="et-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Taxable Estate" value={results.taxable.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Est. Estate Tax (40%)" value={results.tax.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
