'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PropertyTaxDeductionCalculator() {
  const [taxPaidStr, setTaxPaidStr] = useState('5000')
  const [bracketStr, setBracketStr] = useState('22') // tax bracket %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, savings: 0 }
    const tax = parseFloat(taxPaidStr)
    const bracket = parseFloat(bracketStr)

    if (isNaN(tax) || isNaN(bracket) || tax < 0 || bracket < 0 || bracket > 100) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const savings = tax * (bracket / 100)
    return { error: null, savings }
  }, [taxPaidStr, bracketStr])

  return (
    <FormCalculatorShell title="Property Tax Deduction Solver" subtitle="Calculate tax write-off savings based on brackets" badge="TAX">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Property Tax Paid ($)" value={taxPaidStr} onChange={setTaxPaidStr} id="ptd-t" />
          <RetroInput label="Marginal Bracket (%)" value={bracketStr} onChange={setBracketStr} id="ptd-b" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Income Tax Savings" value={results.savings.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
