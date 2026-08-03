'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CarDepreciationCalculator() {
  const [purchasePriceStr, setPurchasePriceStr] = useState('30000')
  const [yearsStr, setYearsStr] = useState('5')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, value: 0, steps: [] as string[] }
    const price = parseFloat(purchasePriceStr)
    const y = parseInt(yearsStr)
    if (isNaN(price) || isNaN(y) || price <= 0 || y < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    // Assume 15% depreciation rate per year compound
    const value = price * Math.pow(0.85, y)
    return {
      error: null,
      value,
      steps: [
        `Assumed average depreciation rate: 15% per year`,
        `Formula: Value = Price × (1 - 0.15)^Years`,
        `Value after ${y} years = ${value.toLocaleString(undefined, {style: 'currency', currency: 'USD'})}`
      ]
    }
  }, [purchasePriceStr, yearsStr])

  return (
    <FormCalculatorShell title="Car Depreciation Estimator" subtitle="Estimate a vehicle value over time at 15% annual decay" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Purchase Price ($)" value={purchasePriceStr} onChange={setPurchasePriceStr} id="dep-p" />
          <RetroInput label="Ownership duration (years)" value={yearsStr} onChange={setYearsStr} id="dep-y" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Estimated Residual Value" value={results.value.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
