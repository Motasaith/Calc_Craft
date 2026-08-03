'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TaxRefundCalculator() {
  const [withheldStr, setWithheldStr] = useState('12000') // tax withheld
  const [taxDueStr, setTaxDueStr] = useState('10000') // actual tax due

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, refund: 0, owed: 0 }
    const w = parseFloat(withheldStr)
    const d = parseFloat(taxDueStr)

    if (isNaN(w) || isNaN(d) || w < 0 || d < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const refund = Math.max(0, w - d)
    const owed = Math.max(0, d - w)

    return { error: null, refund, owed }
  }, [withheldStr, taxDueStr])

  return (
    <FormCalculatorShell title="Tax Refund Solver" subtitle="Estimate refund amounts or taxes owed based on total withholdings" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Tax Withheld ($)" value={withheldStr} onChange={setWithheldStr} id="tr-w" />
          <RetroInput label="Actual Income Tax Due ($)" value={taxDueStr} onChange={setTaxDueStr} id="tr-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Refund Amount" value={results.refund.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
              <ResultDisplay label="Additional Tax Owed" value={results.owed.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
