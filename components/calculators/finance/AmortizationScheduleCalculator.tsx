'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AmortizationScheduleCalculator() {
  const [amountStr, setAmountStr] = useState('10000')
  const [rateStr, setRateStr] = useState('5.0')
  const [monthsStr, setMonthsStr] = useState('12')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, emi: 0 }
    const l = parseFloat(amountStr)
    const r = parseFloat(rateStr)
    const m = parseInt(monthsStr)

    if (isNaN(l) || isNaN(r) || isNaN(m) || l <= 0 || r < 0 || m <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const rateMonthly = (r / 100) / 12
    const emi = rateMonthly > 0
      ? (l * rateMonthly * Math.pow(1 + rateMonthly, m)) / (Math.pow(1 + rateMonthly, m) - 1)
      : l / m

    return { error: null, emi }
  }, [amountStr, rateStr, monthsStr])

  return (
    <FormCalculatorShell title="Amortization Schedule Solver" subtitle="Calculate monthly installments for basic loan structures" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Principal Loan Amount ($)" value={amountStr} onChange={setAmountStr} id="as-l" />
          <RetroInput label="Interest Rate (APR %)" value={rateStr} onChange={setRateStr} id="as-r" />
          <RetroInput label="Duration (Months)" value={monthsStr} onChange={setMonthsStr} id="as-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Monthly Payment (EMI)" value={results.emi.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
