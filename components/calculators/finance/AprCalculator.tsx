'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AprCalculator() {
  const [interestStr, setInterestStr] = useState('10') // % interest rate
  const [feesStr, setFeesStr] = useState('500') // loan fees
  const [loanStr, setLoanStr] = useState('10000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, apr: 0 }
    const rate = parseFloat(interestStr)
    const fees = parseFloat(feesStr)
    const principal = parseFloat(loanStr)

    if (isNaN(rate) || isNaN(fees) || isNaN(principal) || principal <= 0 || rate < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Rough APR = (Interest + Fees) / Principal * 100 approx
    const apr = ((principal * (rate / 100) + fees) / principal) * 100
    return { error: null, apr }
  }, [interestStr, feesStr, loanStr])

  return (
    <FormCalculatorShell title="Annual Percentage Rate APR Solver" subtitle="Estimate actual APR by factoring interest rates and processing fees" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Base Interest Rate (%)" value={interestStr} onChange={setInterestStr} id="apr-i" />
          <RetroInput label="Additional Financing Fees ($)" value={feesStr} onChange={setFeesStr} id="apr-f" />
          <RetroInput label="Loan Principal Amount ($)" value={loanStr} onChange={setLoanStr} id="apr-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Effective APR Rate" value={`${results.apr.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
