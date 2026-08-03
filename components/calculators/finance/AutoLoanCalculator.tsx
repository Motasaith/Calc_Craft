'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AutoLoanCalculator() {
  const [priceStr, setPriceStr] = useState('25000')
  const [downStr, setDownStr] = useState('5000')
  const [rateStr, setRateStr] = useState('4.5')
  const [monthsStr, setMonthsStr] = useState('60')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, payment: 0 }
    const p = parseFloat(priceStr)
    const d = parseFloat(downStr)
    const r = parseFloat(rateStr)
    const m = parseInt(monthsStr)

    if (isNaN(p) || isNaN(d) || isNaN(r) || isNaN(m) || p <= 0 || d < 0 || m <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const principal = p - d
    if (principal <= 0) return { ...defaultObj, error: 'Down payment cannot match or exceed price.' }
    const rateMonthly = (r / 100) / 12
    const payment = rateMonthly > 0
      ? (principal * rateMonthly * Math.pow(1 + rateMonthly, m)) / (Math.pow(1 + rateMonthly, m) - 1)
      : principal / m

    return { error: null, payment }
  }, [priceStr, downStr, rateStr, monthsStr])

  return (
    <FormCalculatorShell title="Auto Loan Payment Solver" subtitle="Calculate auto payments based on loan values" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Vehicle Price ($)" value={priceStr} onChange={setPriceStr} id="al-p" />
          <RetroInput label="Down Payment ($)" value={downStr} onChange={setDownStr} id="al-d" />
          <RetroInput label="Interest Rate (APR %)" value={rateStr} onChange={setRateStr} id="al-r" />
          <RetroInput label="Term (Months)" value={monthsStr} onChange={setMonthsStr} id="al-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Monthly Auto Payment" value={results.payment.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
