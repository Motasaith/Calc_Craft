'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LoanEmiCalculator() {
  const [loanStr, setLoanStr] = useState('50000')
  const [rateStr, setRateStr] = useState('7.5')
  const [termStr, setTermStr] = useState('60') // months

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, emi: 0 }
    const l = parseFloat(loanStr)
    const r = parseFloat(rateStr)
    const t = parseInt(termStr)

    if (isNaN(l) || isNaN(r) || isNaN(t) || l <= 0 || r < 0 || t <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const monthlyRate = (r / 100) / 12
    const emi = monthlyRate > 0
      ? (l * monthlyRate * Math.pow(1 + monthlyRate, t)) / (Math.pow(1 + monthlyRate, t) - 1)
      : l / t

    return { error: null, emi }
  }, [loanStr, rateStr, termStr])

  return (
    <FormCalculatorShell title="Loan EMI Solver" subtitle="Calculate Equated Monthly Installments for loans" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Loan Amount ($)" value={loanStr} onChange={setLoanStr} id="emi-l" />
          <RetroInput label="Interest Rate (APR %)" value={rateStr} onChange={setRateStr} id="emi-r" />
          <RetroInput label="Loan Term (Months)" value={termStr} onChange={setTermStr} id="emi-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Monthly Installment (EMI)" value={results.emi.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
