'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MortgageCalculator() {
  const [priceStr, setPriceStr] = useState('300000')
  const [downStr, setDownStr] = useState('60000')
  const [rateStr, setRateStr] = useState('6.0')
  const [termStr, setTermStr] = useState('30') // years

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, payment: 0 }
    const p = parseFloat(priceStr)
    const d = parseFloat(downStr)
    const r = parseFloat(rateStr)
    const y = parseFloat(termStr)

    if (isNaN(p) || isNaN(d) || isNaN(r) || isNaN(y) || p <= 0 || d < 0 || r < 0 || y <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const principal = p - d
    if (principal <= 0) return { ...defaultObj, error: 'Down payment cannot match or exceed purchase price.' }
    const monthlyRate = (r / 100) / 12
    const months = y * 12
    const payment = monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : principal / months

    return { error: null, payment }
  }, [priceStr, downStr, rateStr, termStr])

  return (
    <FormCalculatorShell title="Mortgage Payment Solver" subtitle="Calculate monthly mortgage amortized payments" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Home Price ($)" value={priceStr} onChange={setPriceStr} id="mort-p" />
          <RetroInput label="Down Payment ($)" value={downStr} onChange={setDownStr} id="mort-d" />
          <RetroInput label="Interest Rate (%)" value={rateStr} onChange={setRateStr} id="mort-r" />
          <RetroInput label="Term (Years)" value={termStr} onChange={setTermStr} id="mort-y" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Monthly Payment" value={results.payment.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
